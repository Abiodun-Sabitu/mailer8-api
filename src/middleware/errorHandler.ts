import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../config/logger';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError | ZodError | Prisma.PrismaClientKnownRequestError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Error occurred', {
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    url: req.url,
    method: req.method
  });

  // Zod validation errors
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      details: errorMessages
    });
    return;
  }

  // Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          message: 'Resource already exists',
          details: error.meta?.target ? `Duplicate field: ${error.meta.target}` : undefined
        });
        return;

      case 'P2025':
        res.status(404).json({
          success: false,
          message: 'Resource not found'
        });
        return;

      case 'P2003':
        res.status(400).json({
          success: false,
          message: 'Invalid reference - related resource not found'
        });
        return;

      default:
        res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
        return;
    }
  }

  // Custom API errors with status codes
  if ('statusCode' in error && error.statusCode) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
    return;
  }

  // Default server error
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};