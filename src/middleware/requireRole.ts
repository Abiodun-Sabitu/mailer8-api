import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthenticatedRequest } from './auth';

export const requireRole = (requiredRole: Role) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    // SUPER_ADMIN can access everything
    if (req.user.role === 'SUPER_ADMIN') {
      next();
      return;
    }

    // Check if user has required role
    if (req.user.role !== requiredRole) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Convenience middleware for SUPER_ADMIN only routes
export const requireSuperAdmin = requireRole('SUPER_ADMIN');