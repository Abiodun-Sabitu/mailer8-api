import { Router } from 'express';
import { register, login, logout, me, refreshToken } from './auth.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';
import { validateBody } from '../../middleware/validate';
import { RegisterAdminSchema, LoginSchema } from './auth.schemas';

const router = Router();

// Public routes
router.post('/login', validateBody(LoginSchema.shape.body), login);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

// Protected routes
router.post(
  '/register',
  authenticate,
  requireSuperAdmin,
  validateBody(RegisterAdminSchema.shape.body),
  register
);

router.get('/me', authenticate, me);

export default router;