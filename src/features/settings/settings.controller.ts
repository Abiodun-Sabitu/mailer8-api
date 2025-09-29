import { Request, Response } from 'express';
import { 
  getAllSettings as getAllSettingsService, 
  updateSettings as updateSettingsService
} from './settings.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok } from '../../utils/responses';
import { logger } from '../../config/logger';
import { UpdateSettingsDto } from './settings.schemas';

export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  const data = await getAllSettingsService();

  ok(res, data, 'Settings retrieved successfully');
});

// Unified settings update endpoint
export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const data: UpdateSettingsDto = req.body;

  const updatedSettings = await updateSettingsService(data);

  logger.info('Settings updated', {
    updatedBy: req.user?.id,
    settingsCount: updatedSettings.length,
    keys: updatedSettings.map(s => s.key)
  });

  ok(res, updatedSettings, 'Settings updated successfully');
});