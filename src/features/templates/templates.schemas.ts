import { z } from 'zod';

export const CreateTemplateSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Please enter a template name' }).min(2, 'Please enter a template name'),
    subject: z.string({ required_error: 'Please enter an email subject' }).min(2, 'Please enter an email subject'),
    body: z.string({ required_error: 'Please enter the email content' }).min(10, 'Please enter the email content')
  })
});

export const UpdateTemplateSchema = z.object({
  body: CreateTemplateSchema.shape.body.partial()
});

export const GetTemplatesQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    search: z.string().optional(), // search by name or subject
    isActive: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
  })
});

export type CreateTemplateDto = z.infer<typeof CreateTemplateSchema>['body'];
export type UpdateTemplateDto = z.infer<typeof UpdateTemplateSchema>['body'];
export type GetTemplatesQueryDto = z.infer<typeof GetTemplatesQuerySchema>['query'];