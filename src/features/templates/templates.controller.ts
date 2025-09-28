import { Request, Response } from 'express';
import { TemplatesService } from './templates.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok, notFound, noContent } from '../../utils/responses';
import { logger } from '../../config/logger';
import { CreateTemplateDto, UpdateTemplateDto, GetTemplatesQueryDto } from './templates.schemas';

export const createTemplate = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateTemplateDto = req.body;
    const createdBy = req.user?.id!;

    const template = await TemplatesService.createTemplate(data, createdBy);

    logger.info(`Template created: ${template.name}`, {
      templateId: template.id,
      createdBy
    });

    created(res, template, 'Template created successfully');
});

export const getTemplates = asyncHandler(async (req: Request, res: Response) => {
  const query: GetTemplatesQueryDto = req.query as any;

  const result = await TemplatesService.getTemplates(query);

  ok(res, result, 'Templates retrieved successfully');
});

export const getTemplateById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const template = await TemplatesService.getTemplateById(id);

  if (!template) {
    return notFound(res, 'Template not found');
  }

  ok(res, template, 'Template retrieved successfully');
});

export const updateTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateTemplateDto = req.body;

  const template = await TemplatesService.updateTemplate(id, data);

  logger.info(`Template updated: ${template.name}`, {
    templateId: template.id,
    updatedBy: req.user?.id
  });

  ok(res, template, 'Template updated successfully');
});

export const deleteTemplate = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if template exists first
  const existingTemplate = await TemplatesService.getTemplateById(id);
  if (!existingTemplate) {
    return notFound(res, 'Template not found');
  }

  await TemplatesService.deleteTemplate(id);

  logger.info(`Template deleted: ${existingTemplate.name}`, {
    templateId: id,
    deletedBy: req.user?.id
  });

  noContent(res, 'Template deleted successfully');
});