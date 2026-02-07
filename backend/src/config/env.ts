import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('3001'),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(1, "JWT_ACCESS_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  CORS_ORIGINS: z.string().transform((val) => val.split(',').map((origin) => origin.trim())),
  ADMIN_BOOTSTRAP_KEY: z.string().optional(),
  OPENCLAW_ENABLED: z.string().transform((val) => val === 'true').default('false'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', JSON.stringify(parsedEnv.error.format(), null, 2))
  process.exit(1)
}

export const env = parsedEnv.data
