
import request from 'supertest';
import app from '../index';
import prisma from '../utils/prisma';
import { expect } from '@jest/globals';
import bcrypt from 'bcrypt';

const TEST_PREFIX = `test_${Date.now()}`;

describe('API Integration Tests', () => {
    let adminToken: string;
    let clientToken: string;
    let otherClientToken: string;
    let tenantId: string;
    let clientId: string;
    let otherClientId: string;
    let obligationId: string;

    const adminEmail = `${TEST_PREFIX}_admin@example.com`;
    const clientEmail = `${TEST_PREFIX}_client@example.com`;
    const otherClientEmail = `${TEST_PREFIX}_other@example.com`;
    const password = 'password123';

    beforeAll(async () => {
        // Create Tenant
        const tenant = await prisma.tenant.create({
            data: { 
                name: `${TEST_PREFIX} Tenant`,
                slug: `${TEST_PREFIX.toLowerCase()}-tenant`,
                plan: 'PRO',
                status: 'ACTIVE'
            }
        });
        tenantId = tenant.id;

        // Create Admin
        await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Test Admin',
                passwordHash: '$2b$10$EpIxNwllqWq7qqK1W.y/..h./.y/.y/.y/.y/.y/.y/.y/.y/.y', // Mock hash
                role: 'ADMIN',
                tenantId
            }
        });
        
        // I need bcrypt to hash password for setup
        const hash = await bcrypt.hash(password, 10);
        
        // Update Admin with real hash
        await prisma.user.update({
            where: { email: adminEmail },
            data: { passwordHash: hash }
        });

    });

    afterAll(async () => {
        // Cleanup
        await prisma.activityLog.deleteMany({ where: { tenantId } });
        await prisma.comment.deleteMany({ where: { tenantId } });
        await prisma.attachment.deleteMany({ where: { tenantId } });
        await prisma.obligation.deleteMany({ where: { tenantId } });
        await prisma.user.deleteMany({ where: { tenantId } });
        await prisma.client.deleteMany({ where: { tenantId } });
        await prisma.tenant.delete({ where: { id: tenantId } });
        await prisma.$disconnect();
    });

    describe('Auth & Permissions', () => {
        it('should login as admin', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ email: adminEmail, password });
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('accessToken');
            adminToken = res.body.accessToken;
        });

        it('should get current user profile', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.email).toBe(adminEmail);
            expect(res.body.role).toBe('ADMIN');
        });
    });

    describe('Clients Management', () => {
        it('should allow admin to create a client', async () => {
            const res = await request(app)
                .post('/api/clients')
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
                .get('/api/clients')
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.find((c: { id: string }) => c.id === clientId)).toBeTruthy();
        });

        // Setup Client User
        it('should setup client user', async () => {
             const hash = await bcrypt.hash(password, 10);

             // Create User linked to Client
             await prisma.user.create({
                 data: {
                     email: clientEmail,
                     name: 'Test Client User',
                     passwordHash: hash,
                     role: 'CLIENT',
                    tenantId,
                    clientId
                 }
             });

             // Login as Client
             const res = await request(app)
                .post('/api/auth/login')
                .send({ email: clientEmail, password });
             
             expect(res.status).toBe(200);
             clientToken = res.body.accessToken;
        });
    });

    describe('Obligations Flow', () => {
        it('should allow admin to create obligation', async () => {
            const res = await request(app)
                .post('/api/obligations')
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
                .get('/api/obligations')
                .set('Authorization', `Bearer ${clientToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
            expect(res.body[0].id).toBe(obligationId);
        });

        it('client should submit obligation', async () => {
            const res = await request(app)
                .post(`/api/obligations/${obligationId}/submit`)
                .set('Authorization', `Bearer ${clientToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('SUBMITTED');
        });

        it('admin should approve obligation', async () => {
            const res = await request(app)
                .post(`/api/obligations/${obligationId}/approve`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('APPROVED');
        });
    });

    describe('Comments & Attachments', () => {
        it('should allow commenting', async () => {
            const res = await request(app)
                .post(`/api/obligations/${obligationId}/comments`)
                .set('Authorization', `Bearer ${clientToken}`)
                .send({ message: 'Done!' });
            
            expect(res.status).toBe(201);
        });

        it('should list comments', async () => {
            const res = await request(app)
                .get(`/api/obligations/${obligationId}/comments`)
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
                .post(`/api/obligations/${obligationId}/attachments`)
                .set('Authorization', `Bearer ${clientToken}`)
                .attach('file', buffer, 'test.txt');
            
            expect(res.status).toBe(201);
        });

        it('should list attachments', async () => {
             const res = await request(app)
                .get(`/api/obligations/${obligationId}/attachments`)
                .set('Authorization', `Bearer ${adminToken}`);
             
             expect(res.status).toBe(200);
             expect(res.body.length).toBe(1);
             expect(res.body[0].fileName).toBe('test.txt');
        });
    });

    describe('Isolation', () => {
        beforeAll(async () => {
            // Create another client & user
             const hash = await bcrypt.hash(password, 10);
             
             const clientRes = await request(app)
                .post('/api/clients')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ name: 'Other Client', email: otherClientEmail });
             otherClientId = clientRes.body.id;

             await prisma.user.create({
                 data: {
                     email: otherClientEmail,
                     name: 'Other User',
                     passwordHash: hash,
                     role: 'CLIENT',
                     tenantId,
                     clientId: otherClientId
                 }
             });

             const res = await request(app)
                .post('/api/auth/login')
                .send({ email: otherClientEmail, password });
             otherClientToken = res.body.accessToken;
        });

        it('other client should NOT see first client obligations', async () => {
            const res = await request(app)
                .get('/api/obligations')
                .set('Authorization', `Bearer ${otherClientToken}`);
            
            expect(res.status).toBe(200);
            const found = res.body.find((o: { id: string }) => o.id === obligationId);
            expect(found).toBeUndefined();
        });
    });
});
