import { Router } from 'express';
import { getSettings, updateSettings } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';
import { validateBody } from '../../middleware/validate';
import { UpdateSettingsSchema } from './settings.schemas';

const router = Router();

// All routes require authentication and SUPER_ADMIN role
router.use(authenticate);
router.use(requireSuperAdmin);

// Get all settings (includes available templates)
router.get('/', getSettings);

// Unified settings update endpoint
router.patch(
  '/',
  validateBody(UpdateSettingsSchema.shape.body),
  updateSettings
);

export default router;