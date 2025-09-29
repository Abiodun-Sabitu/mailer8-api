import { Setting } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { UpdateDefaultTemplateDto, UpdateCronTimeDto, UpdateGenericSettingDto, UpdateSettingsDto, SupportedTimezone, SendTime } from './settings.schemas';

export interface SettingsObject {
  defaultTemplateId?: string;
  defaultTemplateName?: string;
  cronTime?: string;
  sendTime?: string;
  timezone?: string;
  companyName?: string;
  [key: string]: string | undefined;
}

export interface SettingsWithTemplates {
  settings: SettingsObject;
  availableTemplates: Array<{id: string; name: string}>;
}

// Simple time formatting utility - no timezone conversion needed
export const formatCronTime = (time: SendTime): string => {
  // Validate time format
  const timePattern = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timePattern.test(time)) {
    throw new Error('Invalid time format. Use HH:MM format (00:00 - 23:59)');
  }
  
  // For simplicity, cronTime is the same as sendTime
  // The cron job will run in the specified timezone from database
  return time;
};

export const getAllSettings = async (): Promise<SettingsWithTemplates> => {
  const settings = await prisma.setting.findMany();
  
  const settingsObject: SettingsObject = {};
  settings.forEach(setting => {
    settingsObject[setting.key] = setting.value;
  });

  // If there's a defaultTemplateId, fetch the template name
  if (settingsObject.defaultTemplateId) {
    const template = await prisma.emailTemplate.findUnique({
      where: { 
        id: settingsObject.defaultTemplateId,
        isActive: true
      },
      select: {
        name: true
      }
    });
    
    if (template) {
      settingsObject.defaultTemplateName = template.name;
    }
  }

  // Convert cronTime back to user-friendly sendTime if timezone is set
  if (settingsObject.cronTime && settingsObject.timezone) {
    // This is a reverse conversion - in practice, you might store both
    settingsObject.sendTime = settingsObject.cronTime; // Simplified for now
  }

  // Get available templates for frontend dropdowns
  const availableTemplates = await getAvailableTemplates();

  return {
    settings: settingsObject,
    availableTemplates
  };
};



export const getSetting = async (key: string): Promise<string | null> => {
  const setting = await prisma.setting.findUnique({
    where: { key }
  });

  return setting?.value || null;
};

export const updateDefaultTemplate = async (data: UpdateDefaultTemplateDto): Promise<Setting> => {
  // Verify template exists and is active
  const template = await prisma.emailTemplate.findUnique({
    where: { 
      id: data.templateId,
      isActive: true
    }
  });

  if (!template) {
    throw new Error('Template not found or inactive');
  }

  const setting = await prisma.setting.upsert({
    where: { key: 'defaultTemplateId' },
    update: { value: data.templateId },
    create: {
      key: 'defaultTemplateId',
      value: data.templateId
    }
  });

  return setting;
};

export const updateCronTime = async (data: UpdateCronTimeDto): Promise<Setting> => {
  const setting = await prisma.setting.upsert({
    where: { key: 'cronTime' },
    update: { value: data.cronTime },
    create: {
      key: 'cronTime',
      value: data.cronTime
    }
  });

  return setting;
};

export const updateGenericSetting = async (key: string, data: UpdateGenericSettingDto): Promise<Setting> => {
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value: data.value },
    create: {
      key,
      value: data.value
    }
  });

  return setting;
};

export const getDefaultTemplate = async (): Promise<{ id: string; name: string; subject: string; body: string } | null> => {
  const defaultTemplateId = await getSetting('defaultTemplateId');
  
  if (!defaultTemplateId) {
    return null;
  }

  const template = await prisma.emailTemplate.findUnique({
    where: { 
      id: defaultTemplateId,
      isActive: true
    },
    select: {
      id: true,
      name: true,
      subject: true,
      body: true
    }
  });

  return template;
};

export const getCronTime = async (): Promise<string> => {
  const cronTime = await getSetting('cronTime');
  return cronTime || '07:00'; // Default fallback to match .env FixedCronTime
};

export const getTimezone = async (): Promise<string> => {
  const timezone = await getSetting('timezone');
  return timezone || 'Africa/Lagos'; // Default fallback
};

// Get available templates for settings dropdown
export const getAvailableTemplates = async (): Promise<Array<{id: string; name: string}>> => {
  const templates = await prisma.emailTemplate.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
  
  return templates;
};

// Unified settings update function
export const updateSettings = async (data: UpdateSettingsDto): Promise<Setting[]> => {
  const updatedSettings: Setting[] = [];
  
  // Handle default template update
  if (data.defaultTemplateId) {
    // Verify template exists and is active
    const template = await prisma.emailTemplate.findUnique({
      where: { 
        id: data.defaultTemplateId,
        isActive: true
      }
    });

    if (!template) {
      throw new Error('Template not found or inactive');
    }

    const setting = await prisma.setting.upsert({
      where: { key: 'defaultTemplateId' },
      update: { value: data.defaultTemplateId },
      create: {
        key: 'defaultTemplateId',
        value: data.defaultTemplateId
      }
    });
    
    updatedSettings.push(setting);
  }
  
  // Handle timezone and send time together
  if (data.timezone || data.sendTime) {
    const currentTimezone = data.timezone || await getSetting('timezone') || 'Africa/Lagos';
    const currentSendTime = data.sendTime || await getSetting('sendTime') || '07:00';
    
    // Update timezone if provided
    if (data.timezone) {
      const timezoneSetting = await prisma.setting.upsert({
        where: { key: 'timezone' },
        update: { value: data.timezone },
        create: {
          key: 'timezone',
          value: data.timezone
        }
      });
      updatedSettings.push(timezoneSetting);
    }
    
    // Update sendTime if provided
    if (data.sendTime) {
      const sendTimeSetting = await prisma.setting.upsert({
        where: { key: 'sendTime' },
        update: { value: data.sendTime },
        create: {
          key: 'sendTime',
          value: data.sendTime
        }
      });
      updatedSettings.push(sendTimeSetting);
    }
    
    // Set cronTime to same as sendTime (no conversion needed)
    const cronTime = formatCronTime(currentSendTime as SendTime);
    const cronTimeSetting = await prisma.setting.upsert({
      where: { key: 'cronTime' },
      update: { value: cronTime },
      create: {
        key: 'cronTime',
        value: cronTime
      }
    });
    updatedSettings.push(cronTimeSetting);
  }
  
  // Handle company name setting
  if (data.companyName) {
    const companyNameSetting = await prisma.setting.upsert({
      where: { key: 'companyName' },
      update: { value: data.companyName },
      create: {
        key: 'companyName',
        value: data.companyName
      }
    });
    updatedSettings.push(companyNameSetting);
  }
  
  return updatedSettings;
};