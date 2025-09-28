import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export const ok = <T>(res: Response, data: T, message?: string): void => {
  res.status(200).json({
    success: true,
    message,
    data
  });
};

export const created = <T>(res: Response, data: T, message?: string): void => {
  res.status(201).json({
    success: true,
    message: message || 'Resource created successfully',
    data
  });
};

export const noContent = (res: Response, message?: string): void => {
  res.status(204).json({
    success: true,
    message: message || 'Operation completed successfully'
  });
};

export const badRequest = (res: Response, message: string, details?: any): void => {
  res.status(400).json({
    success: false,
    message,
    details
  });
};

export const unauthorized = (res: Response, message: string = 'Unauthorized'): void => {
  res.status(401).json({
    success: false,
    message
  });
};

export const forbidden = (res: Response, message: string = 'Forbidden'): void => {
  res.status(403).json({
    success: false,
    message
  });
};

export const notFound = (res: Response, message: string = 'Resource not found'): void => {
  res.status(404).json({
    success: false,
    message
  });
};

export const conflict = (res: Response, message: string = 'Resource already exists'): void => {
  res.status(409).json({
    success: false,
    message
  });
};

export const internalServerError = (res: Response, message: string = 'Internal server error'): void => {
  res.status(500).json({
    success: false,
    message
  });
};