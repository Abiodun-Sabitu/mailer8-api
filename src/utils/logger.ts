import winston from 'winston';

// Create Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, error }) => {
      if (error && typeof error === 'object' && 'message' in error) {
        return `${timestamp} ${level}: ${message} - ${(error as Error).message}`;
      }
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Stream for Morgan
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger };
export default logger;