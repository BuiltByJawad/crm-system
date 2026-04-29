import { Hono } from 'hono'
import { eq, and, or, like, sql, desc } from 'drizzle-orm'
import { opportunities, opportunityHistory } from '../schema'
import { authMiddleware } from '../auth'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const opportunitiesRouter = new Hono<{ Bindings: Env }>()

opportunitiesRouter.use('/*', authMiddleware)

opportunitiesRouter.get('/', async (c) => {
  const user = c.get('user')
  const db = c.get('db')
  const url = new URL(c.req.url)
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const search = url.searchParams.get('search') || ''
  const stage = url.searchParams.get('stage') || ''
  const offset = (page - 1) * limit

  const conditions = []

  if (user.role === 'SALES_REP') {
    conditions.push(
      or(eq(opportunities.assignedToId, user.id), sql`${opportunities.assignedToId} IS NULL`, eq(opportunities.createdById, user.id))
    )
  }

  if (stage) {
    conditions.push(eq(opportunities.stage, stage as typeof opportunities.stage.enumValues[number]))
  }

  if (search) {
    conditions.push(
      or(
        like(opportunities.title, `%${search}%`),
        like(opportunities.description, `%${search}%`)
      )
    )
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined

  const [results, countResult] = await Promise.all([
    db.select().from(opportunities).where(whereClause).orderBy(desc(opportunities.updatedAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(opportunities).where(whereClause),
  ])

  const total = countResult[0]?.count ?? 0
  const mapped = results.map((opp: Record<string, unknown>) => ({
    ...opp,
    value: opp.value ? parseFloat(opp.value as string) : 0,
  }))

  return c.json({
    success: true,
    data: mapped,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
})

opportunitiesRouter.get('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  const result = await db.select().from(opportunities).where(eq(opportunities.id, id)).get()

  if (!result) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } }, 404)
  }

  const history = await db.select().from(opportunityHistory).where(eq(opportunityHistory.opportunityId, id)).orderBy(desc(opportunityHistory.changedAt))

  return c.json({
    success: true,
    data: {
      ...result,
      value: result.value ? parseFloat(result.value) : 0,
      history,
    },
  })
})

opportunitiesRouter.post('/', async (c) => {
  const user = c.get('user')
  const db = c.get('db')
  const body = await c.req.json()
  const id = crypto.randomUUID()

  if (!body.title || !body.contactId || !body.stage) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'title, contactId, and stage are required' } }, 400)
  }

  await db.insert(opportunities).values({
    id,
    title: body.title,
    description: body.description || null,
    value: body.value ? String(body.value) : null,
    currency: body.currency || 'USD',
    stage: body.stage,
    probability: body.probability ?? 0,
    closeDate: body.closeDate || null,
    contactId: body.contactId,
    createdById: user.id,
    assignedToId: body.assignedToId || null,
  })

  await db.insert(opportunityHistory).values({
    id: crypto.randomUUID(),
    opportunityId: id,
    newStage: body.stage,
    changeReason: 'Opportunity created',
    changedById: user.id,
  })

  const result = await db.select().from(opportunities).where(eq(opportunities.id, id)).get()

  return c.json({
    success: true,
    data: {
      ...result,
      value: result?.value ? parseFloat(result.value) : 0,
    },
  }, 201)
})

opportunitiesRouter.put('/:id', async (c) => {
  const user = c.get('user')
  const db = c.get('db')
  const id = c.req.param('id')
  const body = await c.req.json()

  const current = await db.select().from(opportunities).where(eq(opportunities.id, id)).get()
  if (!current) {
    return c.json({ success: false, error: { code: 'NOT_FOUND', message: 'Opportunity not found' } }, 404)
  }

  const updates: Record<string, string | number | null> = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.description !== undefined) updates.description = body.description
  if (body.value !== undefined) updates.value = String(body.value)
  if (body.currency !== undefined) updates.currency = body.currency
  if (body.stage !== undefined) updates.stage = body.stage
  if (body.probability !== undefined) updates.probability = body.probability
  if (body.closeDate !== undefined) updates.close_date = body.closeDate
  if (body.assignedToId !== undefined) updates.assigned_to_id = body.assignedToId
  updates.updated_at = new Date().toISOString().replace('T', ' ').split('.')[0]

  await db.update(opportunities).set(updates).where(eq(opportunities.id, id))

  if (body.stage && body.stage !== current.stage) {
    await db.insert(opportunityHistory).values({
      id: crypto.randomUUID(),
      opportunityId: id,
      previousStage: current.stage,
      newStage: body.stage,
      changeReason: 'Stage updated',
      changedById: user.id,
    })
  }

  const result = await db.select().from(opportunities).where(eq(opportunities.id, id)).get()

  return c.json({
    success: true,
    data: {
      ...result,
      value: result?.value ? parseFloat(result.value) : 0,
    },
  })
})

opportunitiesRouter.delete('/:id', async (c) => {
  const db = c.get('db')
  const id = c.req.param('id')

  await db.delete(opportunities).where(eq(opportunities.id, id))

  return c.json({ success: true, message: 'Opportunity deleted' })
})

export { opportunitiesRouter }
