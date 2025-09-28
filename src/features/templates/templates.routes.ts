import { Router } from 'express';
import { createTemplate, getTemplates, getTemplateById, updateTemplate, deleteTemplate } from './templates.controller';
import { authenticate } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';
import {
  CreateTemplateSchema,
  UpdateTemplateSchema,
  GetTemplatesQuerySchema
} from './templates.schemas';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create template
router.post(
  '/',
  validateBody(CreateTemplateSchema.shape.body),
  createTemplate
);

// Get templates list
router.get(
  '/',
  validateQuery(GetTemplatesQuerySchema.shape.query),
  getTemplates
);

// Get template by ID
router.get('/:id', getTemplateById);

// Update template
router.patch(
  '/:id',
  validateBody(UpdateTemplateSchema.shape.body),
  updateTemplate
);

// Delete template
router.delete('/:id', deleteTemplate);

export default router;