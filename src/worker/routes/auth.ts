import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { users } from '../schema'
import { authMiddleware } from '../auth'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

function generateId(): string {
  return crypto.randomUUID()
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password)
  return passwordHash === hash
}

async function signToken(userId: string, secret: string): Promise<string> {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload = btoa(JSON.stringify({ userId, exp: Math.floor(Date.now() / 1000) + 3600 }))
  const signatureInput = `${header}.${payload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureInput))
  const signature = btoa(String.fromCharCode(...new Uint8Array(sig)))
  return `${header}.${payload}.${signature}`
}

const auth = new Hono<{ Bindings: Env }>()

auth.post('/register', async (c) => {
  const body = await c.req.json()
  const { email, password, firstName, lastName, role } = body

  if (!email || !password || !firstName || !lastName) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } }, 400)
  }

  const db = c.get('db')

  const existing = await db.select().from(users).where(eq(users.email, email)).get()
  if (existing) {
    return c.json({ success: false, error: { code: 'USER_EXISTS', message: 'User with this email already exists' } }, 409)
  }

  const hashedPassword = await hashPassword(password)
  const id = generateId()

  await db.insert(users).values({
    id,
    email,
    password: hashedPassword,
    firstName,
    lastName,
    role: role || 'SALES_REP',
  })

  const token = await signToken(id, c.env.JWT_SECRET)

  return c.json({
    success: true,
    data: {
      user: { id, email, firstName, lastName, role: role || 'SALES_REP' },
      token,
    },
  }, 201)
})

auth.post('/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  if (!email || !password) {
    return c.json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } }, 400)
  }

  const db = c.get('db')
  const user = await db.select().from(users).where(eq(users.email, email)).get()

  if (!user || !user.isActive) {
    return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, 401)
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return c.json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } }, 401)
  }

  const token = await signToken(user.id, c.env.JWT_SECRET)

  return c.json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    },
  })
})

auth.get('/me', authMiddleware, async (c) => {
  const user = c.get('user')
  return c.json({ success: true, data: user })
})

auth.put('/me', authMiddleware, async (c) => {
  const user = c.get('user')
  const body = await c.req.json()
  const db = c.get('db')

  const updates: Record<string, string> = {}
  if (body.firstName) updates.first_name = body.firstName
  if (body.lastName) updates.last_name = body.lastName
  if (body.email) updates.email = body.email

  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, user.id))
  }

  return c.json({
    success: true,
    data: { ...user, ...body },
  })
})

export { auth }
