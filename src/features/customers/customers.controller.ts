import { Request, Response } from 'express';
import { CustomersService } from './customers.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok, notFound, noContent } from '../../utils/responses';
import { logger } from '../../config/logger';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomersQueryDto } from './customers.schemas';

export const createCustomer = asyncHandler(async (req: Request, res: Response) => {
  const data: CreateCustomerDto = req.body;
  const createdBy = req.user?.id!;

  const customer = await CustomersService.createCustomer(data, createdBy);

  logger.info(`Customer created: ${customer.email}`, {
    customerId: customer.id,
    createdBy
  });

  created(res, customer, 'Customer created successfully');
});

export const getCustomers = asyncHandler(async (req: Request, res: Response) => {
  const query: GetCustomersQueryDto = req.query as any;

  const result = await CustomersService.getCustomers(query);

  ok(res, result, 'Customers retrieved successfully');
});

export const getCustomerById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const customer = await CustomersService.getCustomerById(id);

  if (!customer) {
    return notFound(res, 'Customer not found');
  }

  ok(res, customer, 'Customer retrieved successfully');
});

export const updateCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateCustomerDto = req.body;

  const customer = await CustomersService.updateCustomer(id, data);

  logger.info(`Customer updated: ${customer.email}`, {
    customerId: customer.id,
    updatedBy: req.user?.id
  });

  ok(res, customer, 'Customer updated successfully');
});

export const deleteCustomer = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if customer exists first
  const existingCustomer = await CustomersService.getCustomerById(id);
  if (!existingCustomer) {
    return notFound(res, 'Customer not found');
  }

  await CustomersService.deleteCustomer(id);

  logger.info(`Customer deleted: ${existingCustomer.email}`, {
    customerId: id,
    deletedBy: req.user?.id
  });

  noContent(res, 'Customer deleted successfully');
});