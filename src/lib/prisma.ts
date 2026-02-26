import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

// ─── Singleton Pattern for Next.js ────────────────────────────────────────────
// Prevents multiple PrismaClient instances during hot-reload in development

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      '❌ DATABASE_URL is not set. Please add it to your .env file.\n' +
      'Get it from: https://console.neon.tech → Your Project → Connection Details'
    )
  }

  // Use Neon serverless adapter (works on Vercel Edge + Serverless functions)
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

// Singleton: reuse client across requests in development
export const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
