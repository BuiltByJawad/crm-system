/// <reference types="@cloudflare/workers-types" />
import { Context, Next } from 'hono'
import { eq } from 'drizzle-orm'
import { users } from './schema'
import type { DB } from './db'

interface Env {
  DB: D1Database
  JWT_SECRET: string
}

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

declare module 'hono' {
  interface ContextVariableMap {
    user: AuthUser
    db: DB
  }
}

async function verifyToken(token: string, secret: string): Promise<{ userId: string } | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [headerB64, payloadB64, signatureB64] = parts

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    )

    const signature = Uint8Array.from(atob(signatureB64), c => c.charCodeAt(0))
    const data = encoder.encode(`${headerB64}.${payloadB64}`)

    const valid = await crypto.subtle.verify('HMAC', key, signature, data)
    if (!valid) return null

    const payload = JSON.parse(atob(payloadB64))
    if (payload.exp && Date.now() / 1000 > payload.exp) return null

    return { userId: payload.userId }
  } catch {
    return null
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authHeader = c.req.header('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ success: false, error: { code: 'AUTHENTICATION_REQUIRED', message: 'Authentication token required' } }, 401)
  }

  const token = authHeader.substring(7)
  const decoded = await verifyToken(token, c.env.JWT_SECRET)

  if (!decoded) {
    return c.json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' } }, 401)
  }

  const db = c.get('db')
  const user = await db.select().from(users).where(eq(users.id, decoded.userId)).get()

  if (!user || !user.isActive) {
    return c.json({ success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found or inactive' } }, 401)
  }

  c.set('user', {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  })

  await next()
}
