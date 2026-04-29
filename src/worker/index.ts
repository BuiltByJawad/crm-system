/// <reference types="@cloudflare/workers-types" />
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createDb } from './db'
import { auth } from './routes/auth'
import { contactsRouter } from './routes/contacts'
import { opportunitiesRouter } from './routes/opportunities'
import { dashboardRouter } from './routes/dashboard'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Env }>()

app.use('/*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowHeaders: ['Content-Type', 'Authorization'] }))

app.use('/*', async (c, next) => {
  const db = createDb(c.env.DB)
  c.set('db', db)
  await next()
})

app.get('/', (c) => c.json({ status: 'ok', service: 'crm-api' }))
app.get('/health', (c) => c.json({ status: 'ok' }))

app.route('/api/v1/auth', auth)
app.route('/api/v1/contacts', contactsRouter)
app.route('/api/v1/opportunities', opportunitiesRouter)
app.route('/api/v1/dashboard', dashboardRouter)

app.notFound((c) => c.json({ success: false, error: { code: 'NOT_FOUND', message: `Route not found: ${c.req.method} ${c.req.path}` } }, 404))

export default app
