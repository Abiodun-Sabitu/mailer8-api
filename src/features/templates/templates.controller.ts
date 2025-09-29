import { Request, Response } from 'express';
import { createTemplate as createTemplateService, getTemplates as getTemplatesService, getTemplateById as getTemplateByIdService, updateTemplate as updateTemplateService, deleteTemplate as deleteTemplateService } from './templates.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok, notFound, noContent } from '../../utils/responses';
import { logger } from '../../config/logger';
import { CreateTemplateDto, UpdateTemplateDto, GetTemplatesQueryDto } from './templates.schemas';

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateTemplateDto = req.body;
    const createdBy = req.user?.id!;

    const template = await createTemplateService(data, createdBy);

    logger.info(`Template created: ${template.name}`, {
      templateId: template.id,
      createdBy
    });

    created(res, template, 'Template created successfully');
});

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const query: GetTemplatesQueryDto = req.query as any;

  const result = await getTemplatesService(query);

  ok(res, result, 'Templates retrieved successfully');
});

export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = await getTemplateByIdService(id);

  if (!template) {
    return notFound(res, 'Template not found');
  }

  ok(res, template, 'Template retrieved successfully');
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateTemplateDto = req.body;

  const template = await updateTemplateService(id, data);

  logger.info(`Template updated: ${template.name}`, {
    templateId: template.id,
    updatedBy: req.user?.id
  });

  ok(res, template, 'Template updated successfully');
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if template exists first
  const existingTemplate = await getTemplateByIdService(id);
  if (!existingTemplate) {
    return notFound(res, 'Template not found');
  }

  await deleteTemplateService(id);

  logger.info(`Template deleted: ${existingTemplate.name}`, {
    templateId: id,
    deletedBy: req.user?.id
  });

  ok(res, {}, 'Template deleted successfully');
});