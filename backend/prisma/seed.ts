import { PrismaClient, ObligationType, ObligationStatus } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding...')

  // 1. Create Tenant (was Workspace)
  let tenant = await prisma.tenant.findUnique({ where: { slug: 'devlogic-hq' } })
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: { 
        name: 'DevLogic HQ',
        slug: 'devlogic-hq',
        plan: 'ENTERPRISE',
        status: 'ACTIVE'
      }
    })
    console.log('Created tenant:', tenant.name)
  } else {
    console.log('Using existing tenant:', tenant.name)
  }

  // 2. Create Clients
  const clientNames = ['Acme Corp', 'Globex Inc', 'Soylent Corp']
  const clients = []
  
  for (const name of clientNames) {
    let client = await prisma.client.findFirst({ where: { name, tenantId: tenant.id } })
    if (!client) {
      client = await prisma.client.create({
        data: {
          tenantId: tenant.id,
          name,
          email: `contact@${name.toLowerCase().replace(' ', '')}.com`
        }
      })
      console.log('Created client:', client.name)
    }
    clients.push(client)
  }

  // 3. Create Users
  const passwordHash = await bcrypt.hash('password123', 10)

  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@obliga.com' },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Admin User',
      email: 'admin@obliga.com',
      passwordHash,
      role: 'ADMIN'
    }
  })
  console.log('Created/Verified Admin: admin@obliga.com')

  // Client User (assigned to first client)
  await prisma.user.upsert({
    where: { email: 'client@acme.com' },
    update: { clientId: clients[0].id },
    create: {
      tenantId: tenant.id,
      name: 'Client User',
      email: 'client@acme.com',
      passwordHash,
      role: 'CLIENT',
      clientId: clients[0].id
    }
  })
  console.log('Created/Verified Client User: client@acme.com')

  // 4. Create Obligations (Only if none exist)
  const count = await prisma.obligation.count({ where: { tenantId: tenant.id } })
  if (count === 0) {
      const statuses: ObligationStatus[] = ['PENDING', 'SUBMITTED', 'APPROVED', 'CHANGES_REQUESTED', 'OVERDUE']
      const types: ObligationType[] = ['PAYMENT', 'DOCUMENT', 'APPROVAL']
    
      for (let i = 1; i <= 10; i++) {
        const client = clients[i % clients.length]
        const status = statuses[i % statuses.length]
        const type = types[i % types.length]
        
        // Set due date based on status to make it realistic
        let dueDate = new Date()
        if (status === 'OVERDUE') {
            dueDate.setDate(dueDate.getDate() - 5) // Past
        } else if (status === 'PENDING') {
            dueDate.setDate(dueDate.getDate() + 5) // Future
        } else {
            dueDate.setDate(dueDate.getDate() + (Math.random() > 0.5 ? 5 : -5))
        }
    
        await prisma.obligation.create({
          data: {
            tenantId: tenant.id,
            clientId: client.id,
            title: `Obligation #${i} - ${type}`,
            type,
            status,
            dueDate,
            description: 'This is a test obligation description.'
          }
        })
      }
      console.log('Created 10 obligations')
  } else {
      console.log('Obligations already exist, skipping.')
  }

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
