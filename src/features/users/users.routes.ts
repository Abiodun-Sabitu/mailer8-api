import { Router } from 'express';
import { getUsers, getUserById, updateUserStatus } from './users.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';
import { validateQuery, validateBody } from '../../middleware/validate';
import { GetUsersQuerySchema, UpdateUserStatusSchema } from './users.schemas';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get current user profile (already handled in auth routes as /auth/me)
// Get users list (SUPER_ADMIN only)
router.get(
  '/',
  requireSuperAdmin,
  validateQuery(GetUsersQuerySchema.shape.query),
  getUsers
);

// Get user by ID (Super Admin only)
router.get('/:id', requireSuperAdmin, getUserById);

// Update user status (Super Admin only)
router.patch(
  '/:id/status',
  requireSuperAdmin,
  validateBody(UpdateUserStatusSchema.shape.body),
  updateUserStatus
);

export default router;