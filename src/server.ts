import { config } from 'dotenv';
config(); // Load environment variables first

import app from './app';
import { connectDatabase, disconnectDatabase } from './db/prisma';
import { logger } from './config/logger';
import { startDevelopmentCronJobs } from './services/cronService';

const PORT = parseInt(process.env.PORT || '8000', 10);

const startServer = async () => {
  try {
    // ✅ Try to connect to the database (but don't crash if it fails)
    const dbConnected = await connectDatabase();
    if (!dbConnected) {
      logger.warn('Server starting without database connection');
    }

    // ✅ Start the server regardless of database connection status
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📍 Server URL: http://localhost:${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Setup development cron jobs (only in development)
    if (process.env.NODE_ENV !== 'production' && dbConnected) {
      await startDevelopmentCronJobs();
      logger.info('📝 In production, use external scheduler to call POST /api/jobs/cron/birthday-emails');
    }

    // Graceful shutdown (DB + server close)
    const gracefulShutdown = async (signal: string) => {
      logger.info(`🛑 ${signal} received, shutting down gracefully...`);
      try {
        await disconnectDatabase();
        server.close(() => {
          logger.info('✅ Process terminated');
          process.exit(0);
        });
      } catch (error) {
        logger.error('❌ Error during shutdown', { error });
        process.exit(1);
      }
    };

    // Handle different signals for cross-platform compatibility
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    
    // Windows-specific signal handling
    if (process.platform === 'win32') {
      process.on('SIGBREAK', () => gracefulShutdown('SIGBREAK'));
    }
  } catch (error) {
    logger.error('❌ Failed to start server', { error });
    process.exit(1);
  }
};

startServer();
