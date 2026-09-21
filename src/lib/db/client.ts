import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

export const hasDatabaseUrl = Boolean(
  process.env.DATABASE_URL &&
    process.env.DATABASE_URL.trim() !== '' &&
    !process.env.DATABASE_URL.includes('placeholder')
);

const globalForPrisma = globalThis as unknown as {
  prismaInstance?: PrismaClient | null;
};

function createPrismaClient(): PrismaClient | null {
  if (!hasDatabaseUrl) {
    return null;
  }

  try {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  } catch (error) {
    console.warn('[DHARVIKA PRISMA] Failed to initialize PrismaClient adapter:', error);
    return null;
  }
}

export const prisma: PrismaClient | null =
  globalForPrisma.prismaInstance !== undefined
    ? globalForPrisma.prismaInstance
    : createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaInstance = prisma;
}
