import { Hono } from 'hono'
import { eq, and, or, sql, notInArray } from 'drizzle-orm'
import { opportunities, contacts, opportunityHistory, users } from '../schema'
import { authMiddleware } from '../auth'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const dashboardRouter = new Hono<{ Bindings: Env }>()

dashboardRouter.use('/*', authMiddleware)

dashboardRouter.get('/metrics', async (c) => {
  const user = c.get('user')
  const db = c.get('db')

  const oppWhere = user.role === 'SALES_REP'
    ? or(eq(opportunities.assignedToId, user.id), eq(opportunities.createdById, user.id))
    : undefined

  const contactWhere = user.role === 'SALES_REP'
    ? or(eq(contacts.assignedToId, user.id), eq(contacts.createdById, user.id))
    : undefined

  const [totalContacts, totalOpportunities, stageResults, pipelineResult, recentOpps] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(contacts).where(contactWhere),
    db.select({ count: sql<number>`count(*)` }).from(opportunities).where(oppWhere),
    db.select({
      stage: opportunities.stage,
      count: sql<number>`count(*)`,
      totalValue: sql<number>`coalesce(sum(cast(${opportunities.value} as real)), 0)`,
    }).from(opportunities).where(oppWhere).groupBy(opportunities.stage),
    db.select({
      total: sql<number>`coalesce(sum(cast(${opportunities.value} as real)), 0)`,
    }).from(opportunities).where(
      oppWhere
        ? and(oppWhere, notInArray(opportunities.stage, ['CLOSED_WON', 'CLOSED_LOST']))
        : notInArray(opportunities.stage, ['CLOSED_WON', 'CLOSED_LOST'])
    ),
    db.select().from(opportunities).where(oppWhere).orderBy(sql`${opportunities.updatedAt} desc`).limit(5),
  ])

  const stageCounts: Record<string, number> = {
    PROSPECT: 0, QUALIFIED: 0, PROPOSAL: 0, NEGOTIATION: 0, CLOSED_WON: 0, CLOSED_LOST: 0,
  }
  let totalValue = 0
  for (const row of stageResults) {
    stageCounts[row.stage] = row.count
    totalValue += row.totalValue
  }

  return c.json({
    success: true,
    data: {
      totalContacts: totalContacts[0]?.count ?? 0,
      totalOpportunities: totalOpportunities[0]?.count ?? 0,
      totalValue,
      opportunitiesByStage: stageCounts,
      pipelineValue: pipelineResult[0]?.total ?? 0,
      recentOpportunities: recentOpps.map((opp: Record<string, unknown>) => ({
        ...opp,
        value: opp.value ? parseFloat(opp.value as string) : 0,
      })),
    },
  })
})

export { dashboardRouter }
