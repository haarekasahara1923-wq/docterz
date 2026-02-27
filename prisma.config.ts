import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// prisma.config.ts — Neon + Prisma 7 official format
// ref: https://neon.com/docs/guides/prisma

export default defineConfig({
  schema: 'prisma/schema.prisma',

  // datasource.url used by CLI (db push, migrate, studio)
  // ALWAYS use DIRECT_URL here (not pooled) to avoid PgBouncer issues
  datasource: {
    url: env('DIRECT_URL'),
  },
})
