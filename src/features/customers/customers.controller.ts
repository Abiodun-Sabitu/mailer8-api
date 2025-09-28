import { Request, Response } from 'express';
import { 
  createCustomer as createCustomerService,
  getCustomers as getCustomersService,
  getCustomerById as getCustomerByIdService,
  updateCustomer as updateCustomerService,
  deleteCustomer as deleteCustomerService
} from './customers.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok, notFound, noContent } from '../../utils/responses';
import { logger } from '../../config/logger';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomersQueryDto } from './customers.schemas';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateCustomerDto = req.body;
  const createdBy = req.user?.id!;

  const customer = await createCustomerService(data, createdBy);

  logger.info(`Customer created: ${customer.email}`, {
    customerId: customer.id,
    createdBy
  });

  created(res, customer, 'Customer created successfully');
});

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const query: GetCustomersQueryDto = req.query as any;

  const result = await getCustomersService(query);

  ok(res, result, 'Customers retrieved successfully');
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await getCustomerByIdService(id);

  if (!customer) {
    return notFound(res, 'Customer not found');
  }

  ok(res, customer, 'Customer retrieved successfully');
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateCustomerDto = req.body;

  const customer = await updateCustomerService(id, data);

  logger.info(`Customer updated: ${customer.email}`, {
    customerId: customer.id,
    updatedBy: req.user?.id
  });

  ok(res, customer, 'Customer updated successfully');
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if customer exists first
  const existingCustomer = await getCustomerByIdService(id);
  if (!existingCustomer) {
    return notFound(res, 'Customer not found');
  }

  await deleteCustomerService(id);

  logger.info(`Customer deleted: ${existingCustomer.email}`, {
    customerId: id,
    deletedBy: req.user?.id
  });

  ok(res, {}, 'Customer deleted successfully');
});