import { z } from 'zod';

export const RegisterAdminSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Please enter your email address' }).email('Please enter a valid email address'),
    password: z.string({ required_error: 'Please enter your password' }).min(8, 'Password must be at least 8 characters'),
    firstName: z.string({ required_error: 'Please enter your first name' }).min(1, 'Please enter your first name'),
    lastName: z.string({ required_error: 'Please enter your last name' }).min(1, 'Please enter your last name'),
    role: z.literal('ADMIN').optional()
  })
});

export const LoginSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Please enter your email address' }).email('Please enter a valid email address'),
    password: z.string({ required_error: 'Please enter your password' }).min(8, 'Password must be at least 8 characters')
  })
});

export type RegisterAdminDto = z.infer<typeof RegisterAdminSchema>['body'];
export type LoginDto = z.infer<typeof LoginSchema>['body'];