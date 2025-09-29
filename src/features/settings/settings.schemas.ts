import { z } from 'zod';

// Available timezones
export const SUPPORTED_TIMEZONES = [
  'Africa/Lagos',
  'UTC',
  'America/New_York',
  'America/Chicago', 
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney'
] as const;

// 24-hour time format validation pattern
export const TIME_24H_PATTERN = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export const UpdateDefaultTemplateSchema = z.object({
  body: z.object({
    templateId: z.string({ required_error: 'Please select a template' }).uuid('Please select a valid template')
  })
});

export const UpdateCronTimeSchema = z.object({
  body: z.object({
    cronTime: z.string()
      .regex(TIME_24H_PATTERN, 'Please enter a valid time in HH:MM format (00:00 - 23:59)')
      .refine(val => {
        const [hours, minutes] = val.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, 'Please enter a valid time in HH:MM format')
  })
});

// Unified settings update schema
export const UpdateSettingsSchema = z.object({
  body: z.object({
    defaultTemplateId: z.string().uuid('Please select a valid template').optional(),
    sendTime: z.string()
      .regex(TIME_24H_PATTERN, 'Please enter a valid time in HH:MM format (00:00 - 23:59)')
      .refine(val => {
        const [hours, minutes] = val.split(':').map(Number);
        return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
      }, 'Please enter a valid time in HH:MM format')
      .optional(),
    timezone: z.enum(SUPPORTED_TIMEZONES, {
      invalid_type_error: 'Please select a valid timezone'
    }).optional(),
    companyName: z.string().min(1, 'Company name cannot be empty').optional()
  }).refine(
    (data) => Object.keys(data).length > 0,
    { message: 'At least one setting must be provided' }
  )
});

export const UpdateGenericSettingSchema = z.object({
  body: z.object({
    key: z.string({ required_error: 'Please enter a setting name' }).min(2, 'Please enter a setting name'),
    value: z.string({ required_error: 'Please enter a setting value' }).min(1, 'Please enter a setting value')
  })
});

export type UpdateDefaultTemplateDto = z.infer<typeof UpdateDefaultTemplateSchema>['body'];
export type UpdateCronTimeDto = z.infer<typeof UpdateCronTimeSchema>['body'];
export type UpdateSettingsDto = z.infer<typeof UpdateSettingsSchema>['body'];
export type UpdateGenericSettingDto = z.infer<typeof UpdateGenericSettingSchema>['body'];
export type SupportedTimezone = typeof SUPPORTED_TIMEZONES[number];
export type SendTime = string; // Any valid 24-hour time format (HH:MM)