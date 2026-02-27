import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// prisma.config.ts — Prisma 7 + Neon PostgreSQL
// DATABASE_URL = pooled connection (runtime / Vercel serverless)
// DIRECT_URL   = direct connection (migrations only — optional on Vercel)

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // Use DIRECT_URL for migrations if available, otherwise fall back to DATABASE_URL
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || '',
  },
})
