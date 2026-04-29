import { PrismaClient, UserRole, OpportunityStage } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  })

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 12)
  const manager = await prisma.user.upsert({
    where: { email: 'manager@crm.com' },
    update: {},
    create: {
      email: 'manager@crm.com',
      password: managerPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: UserRole.MANAGER,
    },
  })

  // Create sales rep user
  const repPassword = await bcrypt.hash('rep123', 12)
  const salesRep = await prisma.user.upsert({
    where: { email: 'rep@crm.com' },
    update: {},
    create: {
      email: 'rep@crm.com',
      password: repPassword,
      firstName: 'Mike',
      lastName: 'Chen',
      role: UserRole.SALES_REP,
    },
  })

  // Create another sales rep
  const rep2Password = await bcrypt.hash('rep123', 12)
  const salesRep2 = await prisma.user.upsert({
    where: { email: 'rep2@crm.com' },
    update: {},
    create: {
      email: 'rep2@crm.com',
      password: rep2Password,
      firstName: 'Emma',
      lastName: 'Davis',
      role: UserRole.SALES_REP,
    },
  })

  console.log('👥 Created users:', { admin: admin.id, manager: manager.id, salesRep: salesRep.id, salesRep2: salesRep2.id })

  // Create sample contacts
  const contacts = [
    {
      firstName: 'John',
      lastName: 'Smith',
      company: 'TechCorp Inc.',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0101',
      address: '123 Business St, Tech City, TC 12345',
      notes: 'CEO of TechCorp. Interested in enterprise solutions.',
      tags: ['enterprise', 'technology', 'high-value'],
      createdById: admin.id,
      assignedToId: salesRep.id,
    },
    {
      firstName: 'Jane',
      lastName: 'Doe',
      company: 'StartupXYZ',
      email: 'jane.doe@startupxyz.com',
      phone: '+1-555-0102',
      address: '456 Innovation Ave, Startup City, SC 67890',
      notes: 'CTO of StartupXYZ. Looking for development tools.',
      tags: ['startup', 'technology', 'mid-value'],
      createdById: admin.id,
      assignedToId: salesRep.id,
    },
    {
      firstName: 'Bob',
      lastName: 'Wilson',
      company: 'RetailPlus',
      email: 'bob.wilson@retailplus.com',
      phone: '+1-555-0103',
      address: '789 Commerce Blvd, Retail Town, RT 45678',
      notes: 'Operations Manager at RetailPlus. Needs inventory management system.',
      tags: ['retail', 'operations', 'mid-value'],
      createdById: manager.id,
      assignedToId: salesRep2.id,
    },
    {
      firstName: 'Alice',
      lastName: 'Brown',
      company: 'ConsultingPro',
      email: 'alice.brown@consultingpro.com',
      phone: '+1-555-0104',
      address: '321 Professional Pkwy, Consulting City, CC 98765',
      notes: 'Senior Consultant. Interested in CRM solutions for client management.',
      tags: ['consulting', 'crm', 'high-value'],
      createdById: manager.id,
      assignedToId: salesRep.id,
    },
    {
      firstName: 'Charlie',
      lastName: 'Davis',
      company: 'ManufacturingCo',
      email: 'charlie.davis@manufacturingco.com',
      phone: '+1-555-0105',
      address: '654 Industrial Dr, Manufacturing City, MC 54321',
      notes: 'Plant Manager. Looking for manufacturing ERP system.',
      tags: ['manufacturing', 'erp', 'enterprise'],
      createdById: admin.id,
      assignedToId: salesRep2.id,
    },
  ]

  const createdContacts = []
  for (const contactData of contacts) {
    const contact = await prisma.contact.upsert({
      where: { email: contactData.email! },
      update: {},
      create: contactData,
    })
    createdContacts.push(contact)
  }

  console.log('📞 Created contacts:', createdContacts.length)

  // Create sample opportunities
  const opportunities = [
    {
      title: 'Enterprise CRM Implementation',
      description: 'Full CRM deployment for TechCorp with custom integrations',
      value: 150000.00,
      currency: 'USD',
      stage: OpportunityStage.PROPOSAL,
      probability: 75,
      closeDate: new Date('2026-06-30'),
      contactId: createdContacts[0].id,
      createdById: salesRep.id,
      assignedToId: salesRep.id,
    },
    {
      title: 'Development Tools Package',
      description: 'Complete development toolkit for StartupXYZ team',
      value: 25000.00,
      currency: 'USD',
      stage: OpportunityStage.QUALIFIED,
      probability: 60,
      closeDate: new Date('2026-05-15'),
      contactId: createdContacts[1].id,
      createdById: salesRep.id,
      assignedToId: salesRep.id,
    },
    {
      title: 'Inventory Management System',
      description: 'Cloud-based inventory solution for RetailPlus',
      value: 45000.00,
      currency: 'USD',
      stage: OpportunityStage.NEGOTIATION,
      probability: 85,
      closeDate: new Date('2026-04-30'),
      contactId: createdContacts[2].id,
      createdById: salesRep2.id,
      assignedToId: salesRep2.id,
    },
    {
      title: 'CRM Consulting Services',
      description: 'Implementation consulting for ConsultingPro CRM adoption',
      value: 75000.00,
      currency: 'USD',
      stage: OpportunityStage.CLOSED_WON,
      probability: 100,
      closeDate: new Date('2026-03-15'),
      contactId: createdContacts[3].id,
      createdById: salesRep.id,
      assignedToId: salesRep.id,
    },
    {
      title: 'Manufacturing ERP Suite',
      description: 'Complete ERP system for ManufacturingCo operations',
      value: 200000.00,
      currency: 'USD',
      stage: OpportunityStage.PROSPECT,
      probability: 25,
      closeDate: new Date('2026-08-31'),
      contactId: createdContacts[4].id,
      createdById: salesRep2.id,
      assignedToId: salesRep2.id,
    },
  ]

  const createdOpportunities = []
  for (const oppData of opportunities) {
    const opportunity = await prisma.opportunity.create({
      data: oppData,
    })
    createdOpportunities.push(opportunity)
  }

  console.log('🎯 Created opportunities:', createdOpportunities.length)

  console.log('✅ Database seeding completed successfully!')
  console.log('\nDemo Credentials:')
  console.log('Admin: admin@crm.com / admin123')
  console.log('Manager: manager@crm.com / manager123')
  console.log('Sales Rep: rep@crm.com / rep123')
  console.log('Sales Rep 2: rep2@crm.com / rep123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
