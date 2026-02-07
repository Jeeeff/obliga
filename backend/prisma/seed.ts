import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Empresa Demo',
      slug: 'demo',
      plan: 'PRO',
      status: 'ACTIVE',
      openClawApiKey: 'test-key-123',
    },
  });

  const hash = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      passwordHash: hash,
      name: 'Admin',
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  const client = await prisma.client.create({
    data: {
      name: 'João Silva',
      email: 'joao@test.com',
      tenantId: tenant.id,
    },
  });

  await prisma.invoice.create({
    data: {
      amount: 1000,
      status: 'PENDING',
      dueDate: new Date('2026-03-01'),
      clientId: client.id,
      tenantId: tenant.id,
      items: {
        create: [{
          description: 'Serviço',
          quantity: 1,
          price: 1000,
        }],
      },
    },
  });

  console.log('Seed concluído!');
  console.log('Login: admin@demo.com');
  console.log('Senha: admin123');
}

main().finally(() => prisma.$disconnect());
