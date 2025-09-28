import { Router } from 'express';
import { getSettings, updateDefaultTemplate, updateCronTime, updateGenericSetting } from './settings.controller';
import { authenticate } from '../../middleware/auth';
import { requireSuperAdmin } from '../../middleware/requireRole';
import { validateBody } from '../../middleware/validate';
import {
  UpdateDefaultTemplateSchema,
  UpdateCronTimeSchema,
  UpdateGenericSettingSchema
} from './settings.schemas';

const router = Router();

// All routes require authentication and SUPER_ADMIN role
router.use(authenticate);
router.use(requireSuperAdmin);

// Get all settings
router.get('/', getSettings);

// Update default template
router.patch(
  '/default-template',
  validateBody(UpdateDefaultTemplateSchema.shape.body),
  updateDefaultTemplate
);

// Update cron time
router.patch(
  '/cron-time',
  validateBody(UpdateCronTimeSchema.shape.body),
  updateCronTime
);

// Update generic setting
router.patch(
  '/:key',
  validateBody(UpdateGenericSettingSchema.shape.body),
  updateGenericSetting
);

export default router;