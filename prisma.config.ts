import { defineConfig } from 'prisma/config'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

// Load .env in non-Next.js contexts (e.g. prisma CLI)
import 'dotenv/config'

export default defineConfig({
  earlyAccess: true,

  schema: './prisma/schema.prisma',

  migrate: {
    // Direct URL used for migrations (bypasses PgBouncer pooler)
    async adapter() {
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
      })
      return new PrismaNeon(pool)
    },
  },
})
