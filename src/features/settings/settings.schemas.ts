import { z } from 'zod';

export const UpdateDefaultTemplateSchema = z.object({
  body: z.object({
    templateId: z.string({ required_error: 'Please select a template' }).uuid('Please select a valid template')
  })
});

export const UpdateCronTimeSchema = z.object({
  body: z.object({
    cronTime: z.enum(['00:00', '07:00', '09:00'], { 
      required_error: 'Please select a send time',
      invalid_type_error: 'Please select a valid send time (12:00 AM, 7:00 AM, or 9:00 AM)'
    })
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