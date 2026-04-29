import request from 'supertest'
import { describe, it, expect, vi } from 'vitest'

vi.mock('../config/database', () => ({
  prisma: {},
}))

const { createApp } = await import('./app')

describe('api health', () => {
  it('GET /health returns ok', async () => {
    const app = createApp()
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('GET /ready returns ready', async () => {
    const app = createApp()
    const res = await request(app).get('/ready')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ready' })
  })
})

describe('auth validation', () => {
  it('POST /api/v1/auth/login rejects invalid body', async () => {
    const app = createApp()
    const res = await request(app).post('/api/v1/auth/login').send({})

    expect(res.status).toBe(400)
    expect(res.body?.success).toBe(false)
    expect(res.body?.error?.code).toBe('VALIDATION_ERROR')
  })
})
