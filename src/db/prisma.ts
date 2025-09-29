import { PrismaClient } from '@prisma/client';
import { logger } from '../config/logger';

declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern for Prisma client
export const prisma = globalThis.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}

export const connectDatabase = async (): Promise<boolean> => {
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Failed to connect to database', { error });
    return false;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    logger.info('📦 Database disconnected successfully');
  } catch (error) {
    logger.error('Failed to disconnect from database', { error });
  }
};