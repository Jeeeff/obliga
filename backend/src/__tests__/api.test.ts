
import request from 'supertest';
import app from '../index';
import prisma from '../utils/prisma';
import { expect } from '@jest/globals';

const TEST_PREFIX = `test_${Date.now()}`;

describe('API Integration Tests', () => {
    let adminToken: string;
    let clientToken: string;
    let otherClientToken: string;
    let workspaceId: string;
    let clientId: string;
    let otherClientId: string;
    let obligationId: string;

    const adminEmail = `${TEST_PREFIX}_admin@example.com`;
    const clientEmail = `${TEST_PREFIX}_client@example.com`;
    const otherClientEmail = `${TEST_PREFIX}_other@example.com`;
    const password = 'password123';

    beforeAll(async () => {
        // Create Workspace
        const workspace = await prisma.workspace.create({
            data: { name: `${TEST_PREFIX} Workspace` }
        });
        workspaceId = workspace.id;

        // Create Admin
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Test Admin',
                passwordHash: '$2b$10$EpIxNwllqWq7qqK1W.y/..h./.y/.y/.y/.y/.y/.y/.y/.y/.y', // Mock hash (not used if we hit login endpoint with real bcrypt, wait. We need real hash or create via register?)
                // Actually, login endpoint checks password. I need to register or insert with known hash.
                // I'll rely on the fact that I can't register easily in production mode.
                // So I will insert a user with a KNOWN hash for "password123".
                // Hash for "password123" is approx: $2b$10$EpIxNwllqWq7qqK1W.y/.. (need real hash)
                // Better: Use a helper or just create the user and generate token manually?
                // No, I want to test /auth/login.
                // I'll generate a real hash using bcrypt.
                role: 'ADMIN',
                workspaceId
            }
        });
        
        // I need bcrypt to hash password for setup
        const bcrypt = require('bcrypt');
        const hash = await bcrypt.hash(password, 10);
        
        // Update Admin with real hash
        await prisma.user.update({
            where: { email: adminEmail },
            data: { passwordHash: hash }
        });

    });

    afterAll(async () => {
        // Cleanup
        await prisma.activityLog.deleteMany({ where: { workspaceId } });
        await prisma.comment.deleteMany({ where: { obligation: { workspaceId } } });
        await prisma.attachment.deleteMany({ where: { obligation: { workspaceId } } });
        await prisma.obligation.deleteMany({ where: { workspaceId } });
        await prisma.user.deleteMany({ where: { workspaceId } });
        await prisma.client.deleteMany({ where: { workspaceId } });
        await prisma.workspace.delete({ where: { id: workspaceId } });
        await prisma.$disconnect();
    });

    describe('Auth & Permissions', () => {
        it('should login as admin', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: adminEmail, password });
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            adminToken = res.body.accessToken;
        });

        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/auth/me')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.email).toBe(adminEmail);
            expect(res.body.role).toBe('ADMIN');
        });
    });

    describe('Clients Management', () => {
        it('should allow admin to create a client', async () => {
            const res = await request(app)
                .post('/clients')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Test Client Ltd',
                    email: clientEmail
                });
            
            expect(res.status).toBe(201);
            clientId = res.body.id;
        });

        it('should list clients as admin', async () => {
            const res = await request(app)
                .get('/clients')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.find((c: any) => c.id === clientId)).toBeTruthy();
        });

        // Setup Client User
        it('should setup client user', async () => {
             const bcrypt = require('bcrypt');
             const hash = await bcrypt.hash(password, 10);

             // Create User linked to Client
             await prisma.user.create({
                 data: {
                     email: clientEmail,
                     name: 'Test Client User',
                     passwordHash: hash,
                     role: 'CLIENT',
                     workspaceId,
                     clientId
                 }
             });

             // Login as Client
             const res = await request(app)
                .post('/auth/login')
                .send({ email: clientEmail, password });
             
             expect(res.status).toBe(200);
             clientToken = res.body.accessToken;
        });
    });

    describe('Obligations Flow', () => {
        it('should allow admin to create obligation', async () => {
            const res = await request(app)
                .post('/obligations')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: 'Monthly Tax',
                    clientId: clientId,
                    type: 'PAYMENT',
                    dueDate: new Date().toISOString(),
                    description: 'Please pay taxes'
                });
            
            if (res.status !== 201) {
                throw new Error(`Create Obligation Failed: ${JSON.stringify(res.body)}`);
            }
            expect(res.status).toBe(201);
            obligationId = res.body.id;
        });

        it('client should see their obligation', async () => {
            const res = await request(app)
                .get('/obligations')
                .set('Authorization', `Bearer ${clientToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].id).toBe(obligationId);
        });

        it('client should submit obligation', async () => {
            const res = await request(app)
                .post(`/obligations/${obligationId}/submit`)
                .set('Authorization', `Bearer ${clientToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('SUBMITTED');
        });

        it('admin should approve obligation', async () => {
            const res = await request(app)
                .post(`/obligations/${obligationId}/approve`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('APPROVED');
        });
    });

    describe('Comments & Attachments', () => {
        it('should allow commenting', async () => {
            const res = await request(app)
                .post(`/obligations/${obligationId}/comments`)
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ message: 'Done!' });
            
            expect(res.status).toBe(201);
        });

        it('should list comments', async () => {
            const res = await request(app)
                .get(`/obligations/${obligationId}/comments`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(1);
            expect(res.body[0].message).toBe('Done!');
        });
        
        // Attachments require multipart, bit tricky with supertest but supported
        // Skipping complex file upload test for brevity unless critical, 
        // but user asked for it. I'll do a simple mock or skip if too complex without file.
        // Actually supertest .attach() works well.
        it('should upload attachment', async () => {
            const buffer = Buffer.from('test file content');
            const res = await request(app)
                .post(`/obligations/${obligationId}/attachments`)
                .set('Authorization', `Bearer ${clientToken}`)
                .attach('file', buffer, 'test.txt');
            
            expect(res.status).toBe(201);
        });

        it('should list attachments', async () => {
             const res = await request(app)
                .get(`/obligations/${obligationId}/attachments`)
                .set('Authorization', `Bearer ${adminToken}`);
             
             expect(res.status).toBe(200);
             expect(res.body.length).toBe(1);
             expect(res.body[0].fileName).toBe('test.txt');
        });
    });

    describe('Isolation', () => {
        beforeAll(async () => {
            // Create another client & user
             const bcrypt = require('bcrypt');
             const hash = await bcrypt.hash(password, 10);
             
             const clientRes = await request(app)
                .post('/clients')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Other Client', email: otherClientEmail });
             otherClientId = clientRes.body.id;

             await prisma.user.create({
                 data: {
                     email: otherClientEmail,
                     name: 'Other User',
                     passwordHash: hash,
                     role: 'CLIENT',
                     workspaceId,
                     clientId: otherClientId
                 }
             });

             const res = await request(app)
                .post('/auth/login')
                .send({ email: otherClientEmail, password });
             otherClientToken = res.body.accessToken;
        });

        it('other client should NOT see first client obligations', async () => {
            const res = await request(app)
                .get('/obligations')
                .set('Authorization', `Bearer ${otherClientToken}`);
            
            expect(res.status).toBe(200);
            const found = res.body.find((o: any) => o.id === obligationId);
            expect(found).toBeUndefined();
        });
    });
});
