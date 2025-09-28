import { Request, Response } from 'express';
import { SettingsService } from './settings.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/responses';
import { logger } from '../../config/logger';
import { 
  UpdateDefaultTemplateDto, 
  UpdateCronTimeDto, 
  UpdateGenericSettingDto 
} from './settings.schemas';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await SettingsService.getAllSettings();

  ok(res, settings, 'Settings retrieved successfully');
});

export const updateDefaultTemplate = asyncHandler(async (req: Request, res: Response) => {
  const data: UpdateDefaultTemplateDto = req.body;

  const setting = await SettingsService.updateDefaultTemplate(data);

  logger.info(`Default template updated: ${data.templateId}`, {
    updatedBy: req.user?.id
  });

  ok(res, setting, 'Default template updated successfully');
});

export const updateCronTime = asyncHandler(async (req: Request, res: Response) => {
  const data: UpdateCronTimeDto = req.body;

  const setting = await SettingsService.updateCronTime(data);

  logger.info(`Cron time updated: ${data.cronTime}`, {
    updatedBy: req.user?.id
  });

  ok(res, setting, 'Cron time updated successfully');
});

export const updateGenericSetting = asyncHandler(async (req: Request, res: Response) => {
  const { key } = req.params;
  const data: UpdateGenericSettingDto = req.body;

  // Prevent updating certain protected keys through generic endpoint
  const protectedKeys = ['defaultTemplateId', 'cronTime'];
  if (protectedKeys.includes(key)) {
    return res.status(400).json({
      success: false,
      message: `Use specific endpoint to update ${key}`
    });
  }

  const setting = await SettingsService.updateGenericSetting(key, data);

  logger.info(`Setting updated: ${key} = ${data.value}`, {
    updatedBy: req.user?.id
  });

  ok(res, setting, 'Setting updated successfully');
});