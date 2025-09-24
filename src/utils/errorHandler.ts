import { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { logger } from './logger.js';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!err.status && !err.statusCode) {
    err = createError(500, err.message || 'Internal Server Error');
  }

  const statusCode = err.status || err.statusCode || 500;

  logger.error(err.message, { 
    status: statusCode, 
    path: req.originalUrl, 
    method: req.method 
  });

  res.status(statusCode).json({
    error: {
      message: err.message,
      status: statusCode,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = createError(404, `Cannot ${req.method} ${req.originalUrl}`);
  next(error);
};