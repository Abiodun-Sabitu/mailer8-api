import { Router } from 'express';
import { 
  createCustomer, 
  getCustomers, 
  getCustomerById, 
  updateCustomer, 
  deleteCustomer 
} from './customers.controller';
import { authenticate } from '../../middleware/auth';
import { validateBody, validateQuery } from '../../middleware/validate';
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
  GetCustomersQuerySchema
} from './customers.schemas';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Create customer
router.post(
  '/',
  validateBody(CreateCustomerSchema.shape.body),
  createCustomer
);

// Get customers list
router.get(
  '/',
  validateQuery(GetCustomersQuerySchema.shape.query),
  getCustomers
);

// Get customer by ID
router.get('/:id', getCustomerById);

// Update customer
router.patch(
  '/:id',
  validateBody(UpdateCustomerSchema.shape.body),
  updateCustomer
);

// Delete customer
router.delete('/:id', deleteCustomer);

export default router;