import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'Please enter the customer\'s first name' }).min(1, 'Please enter the customer\'s first name'),
    lastName: z.string({ required_error: 'Please enter the customer\'s last name' }).min(1, 'Please enter the customer\'s last name'),
    email: z.string({ required_error: 'Please enter the customer\'s email address' }).email('Please enter a valid email address'),
    dob: z.string({ required_error: 'Please enter the customer\'s date of birth' }).or(z.date()).transform((val) => {
      if (typeof val === 'string') {
        const date = new Date(val);
        if (isNaN(date.getTime())) {
          throw new Error('Please enter a valid date of birth');
        }
        return date;
      }
      return val;
    })
  })
});

export const UpdateCustomerSchema = z.object({
  body: CreateCustomerSchema.shape.body.partial()
});

export const GetCustomersQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
    q: z.string().optional(), // search query
    isActive: z.string().optional().transform(val => val === 'true' ? true : val === 'false' ? false : undefined)
  })
});

export type CreateCustomerDto = z.infer<typeof CreateCustomerSchema>['body'];
export type UpdateCustomerDto = z.infer<typeof UpdateCustomerSchema>['body'];
export type GetCustomersQueryDto = z.infer<typeof GetCustomersQuerySchema>['query'];