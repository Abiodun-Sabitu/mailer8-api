import app from './app.js';
import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Mailer8 API server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('🛑 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('🛑 SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('✅ Process terminated');
    process.exit(0);
  });
});

export default server;