import { z } from 'zod';

export const UpdateDefaultTemplateSchema = z.object({
  body: z.object({
    templateId: z.string({ required_error: 'Please select a template' }).uuid('Please select a valid template')
  })
});

export const UpdateCronTimeSchema = z.object({
  body: z.object({
    cronTime: z.string({ required_error: 'Please enter the email send time' }).regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Please enter time in HH:mm format (e.g., 09:30)')
  })
});

export const UpdateGenericSettingSchema = z.object({
  body: z.object({
    key: z.string({ required_error: 'Please enter a setting name' }).min(2, 'Please enter a setting name'),
    value: z.string({ required_error: 'Please enter a setting value' }).min(1, 'Please enter a setting value')
  })
});

export type UpdateDefaultTemplateDto = z.infer<typeof UpdateDefaultTemplateSchema>['body'];
export type UpdateCronTimeDto = z.infer<typeof UpdateCronTimeSchema>['body'];
export type UpdateGenericSettingDto = z.infer<typeof UpdateGenericSettingSchema>['body'];