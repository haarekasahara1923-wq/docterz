import { PrismaClient } from '@prisma/client'

// Singleton for Next.js hot-reload safety
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  if (!process.env.DATABASE_URL) {
    throw new Error('❌ DATABASE_URL environment variable is not set. Add it to .env.local')
  }

  // Use Neon serverless adapter if available, otherwise basic Prisma
  try {
    const { PrismaNeon } = require('@prisma/adapter-neon')
    const adapter = new PrismaNeon({
      connectionString: process.env.DATABASE_URL,
    })
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  } catch {
    // Fallback: standard Prisma (no Neon adapter)
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    })
  }
}

export const prisma = global.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma
}

export default prisma
