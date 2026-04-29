import { Hono } from 'hono'
import { eq, and, or, like, sql, desc } from 'drizzle-orm'
import { contacts, users } from '../schema'
import { authMiddleware } from '../auth'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const contactsRouter = new Hono<{ Bindings: Env }>()

contactsRouter.use('/*', authMiddleware)

contactsRouter.get('/', async (c) => {
  const user = c.get('user')
  const db = c.get('db')
  const url = new URL(c.req.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const search = url.searchParams.get('search') || ''
  const offset = (page - 1) * limit

  let conditions = []

  if (user.role === 'SALES_REP') {
    conditions.push(
      or(eq(contacts.assignedToId, user.id), sql`${contacts.assignedToId} IS NULL`, eq(contacts.createdById, user.id))
    )
  }

  if (search) {
    conditions.push(
      or(
        like(contacts.firstName, `%${search}%`),
        like(contacts.lastName, `%${search}%`),
        like(contacts.company, `%${search}%`),
        like(contacts.email, `%${search}%`)
      )
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [results, countResult] = await Promise.all([
    db.select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      company: contacts.company,
      email: contacts.email,
      phone: contacts.phone,
      address: contacts.address,
      notes: contacts.notes,
      tags: contacts.tags,
      createdById: contacts.createdById,
      assignedToId: contacts.assignedToId,
      createdAt: contacts.createdAt,
      updatedAt: contacts.updatedAt,
      creatorFirstName: users.firstName,
      creatorLastName: users.lastName,
      creatorEmail: users.email,
    })
    .from(contacts)
    .leftJoin(users, eq(contacts.createdById, users.id))
    .where(whereClause)
    .orderBy(desc(contacts.updatedAt))
    .limit(limit)
    .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(contacts).where(whereClause),
  ])

  const total = countResult[0]?.count ?? 0
  const mapped = results.map(r => ({
    id: r.id,
    firstName: r.firstName,
    lastName: r.lastName,
    company: r.company,
    email: r.email,
    phone: r.phone,
    address: r.address,
    notes: r.notes,
    tags: r.tags ? r.tags.split(',').filter(Boolean) : [],
    createdById: r.createdById,
    assignedToId: r.assignedToId,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    createdBy: r.creatorFirstName ? {
      id: r.createdById,
      firstName: r.creatorFirstName,
      lastName: r.creatorLastName,
      email: r.creatorEmail,
    } : null,
  }))

  return c.json({
    success: true,
    data: mapped,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

contactsRouter.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).get()

  if (!result) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Contact not found' } }, 404)
  }

  return c.json({
    success: true,
    data: {
      ...result,
      tags: result.tags ? result.tags.split(',').filter(Boolean) : [],
    },
  })
})

contactsRouter.post('/', async (c) => {
  const user = c.get('user')
  const db = c.get('db')
  const body = await c.req.json()
  const id = crypto.randomUUID()

  await db.insert(contacts).values({
    id,
    firstName: body.firstName,
    lastName: body.lastName,
    company: body.company || null,
    email: body.email || null,
    phone: body.phone || null,
    address: body.address || null,
    notes: body.notes || null,
    tags: body.tags ? body.tags.join(',') : null,
    createdById: user.id,
    assignedToId: body.assignedToId || null,
  })

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).get()

  return c.json({
    success: true,
    data: {
      ...result,
      tags: result?.tags ? result.tags.split(',').filter(Boolean) : [],
    },
  }, 201)
})

contactsRouter.put('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')
  const body = await c.req.json()

  const updates: Record<string, string | null> = {}
  if (body.firstName !== undefined) updates.first_name = body.firstName
  if (body.lastName !== undefined) updates.last_name = body.lastName
  if (body.company !== undefined) updates.company = body.company
  if (body.email !== undefined) updates.email = body.email
  if (body.phone !== undefined) updates.phone = body.phone
  if (body.address !== undefined) updates.address = body.address
  if (body.notes !== undefined) updates.notes = body.notes
  if (body.tags !== undefined) updates.tags = body.tags ? body.tags.join(',') : null
  if (body.assignedToId !== undefined) updates.assigned_to_id = body.assignedToId
  updates.updated_at = new Date().toISOString().replace('T', ' ').split('.')[0]

  await db.update(contacts).set(updates).where(eq(contacts.id, id))

  const result = await db.select().from(contacts).where(eq(contacts.id, id)).get()

  return c.json({
    success: true,
    data: {
      ...result,
      tags: result?.tags ? result.tags.split(',').filter(Boolean) : [],
    },
  })
})

contactsRouter.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  await db.delete(contacts).where(eq(contacts.id, id))

  return c.json({ success: true, message: 'Contact deleted' })
})

export { contactsRouter }
