import { z } from 'zod'

const configSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  DATABASE_URL: z.string().url().optional(),
  JWT_SECRET: z.string().min(8).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const config = configSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
})

export type Config = z.infer<typeof configSchema>
