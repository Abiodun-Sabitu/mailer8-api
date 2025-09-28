import { Setting } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { UpdateDefaultTemplateDto, UpdateCronTimeDto, UpdateGenericSettingDto } from './settings.schemas';

export interface SettingsObject {
  defaultTemplateId?: string;
  cronTime?: string;
  [key: string]: string | undefined;
}

export class SettingsService {
  static async getAllSettings(): Promise<SettingsObject> {
    const settings = await prisma.setting.findMany();
    
    const settingsObject: SettingsObject = {};
    settings.forEach(setting => {
      settingsObject[setting.key] = setting.value;
    });

    return settingsObject;
  }

  static async getSetting(key: string): Promise<string | null> {
    const setting = await prisma.setting.findUnique({
      where: { key }
    });

    return setting?.value || null;
  }

  static async updateDefaultTemplate(data: UpdateDefaultTemplateDto): Promise<Setting> {
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
  }

  static async updateCronTime(data: UpdateCronTimeDto): Promise<Setting> {
    const setting = await prisma.setting.upsert({
      where: { key: 'cronTime' },
      update: { value: data.cronTime },
      create: {
        key: 'cronTime',
        value: data.cronTime
      }
    });

    return setting;
  }

  static async updateGenericSetting(key: string, data: UpdateGenericSettingDto): Promise<Setting> {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value: data.value },
      create: {
        key,
        value: data.value
      }
    });

    return setting;
  }

  static async getDefaultTemplate(): Promise<{ id: string; name: string; subject: string; body: string } | null> {
    const defaultTemplateId = await this.getSetting('defaultTemplateId');
    
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
  }

  static async getCronTime(): Promise<string> {
    const cronTime = await this.getSetting('cronTime');
    return cronTime || '07:00'; // Default fallback to match .env SEND_TIME
  }
}