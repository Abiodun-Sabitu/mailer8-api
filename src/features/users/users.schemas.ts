import { z } from 'zod';

export const UpdateUserStatusSchema = z.object({
  body: z.object({
    isActive: z.boolean({ required_error: 'Please specify whether to activate or deactivate the user' })
  })
});

export const GetUsersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    search: z.string().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional(),
    isActive: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
  })
});

export type UpdateUserStatusDto = z.infer<typeof UpdateUserStatusSchema>['body'];
export type GetUsersQueryDto = z.infer<typeof GetUsersQuerySchema>['query'];