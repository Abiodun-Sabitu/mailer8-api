import { Customer, Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { parsePagination, createPaginatedResponse, PaginatedResponse } from '../../utils/pagination';
import { CreateCustomerDto, UpdateCustomerDto, GetCustomersQueryDto } from './customers.schemas';

export class CustomersService {
  static async createCustomer(data: CreateCustomerDto, createdBy: string): Promise<Customer> {
    const customer = await prisma.customer.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email.toLowerCase(),
        dob: data.dob,
        createdBy,
        isActive: true
      }
    });

    return customer;
  }

  static async getCustomers(query: GetCustomersQueryDto): Promise<PaginatedResponse<Customer>> {
    const pagination = parsePagination({ page: query.page, limit: query.limit });
    
    // Build where clause
    const where: Prisma.CustomerWhereInput = {};
    
    if (query.q) {
      where.OR = [
        { firstName: { contains: query.q, mode: 'insensitive' } },
        { lastName: { contains: query.q, mode: 'insensitive' } },
        { email: { contains: query.q, mode: 'insensitive' } }
      ];
    }
    
    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    // Get customers with pagination
    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    return createPaginatedResponse(customers, total, pagination);
  }

  static async getCustomerById(id: string): Promise<Customer | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return customer;
  }

  static async updateCustomer(id: string, data: UpdateCustomerDto): Promise<Customer> {
    const updateData: Prisma.CustomerUpdateInput = {};
    
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.email) updateData.email = data.email.toLowerCase();
    if (data.dob) updateData.dob = data.dob;

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return customer;
  }

  static async deleteCustomer(id: string): Promise<void> {
    await prisma.customer.delete({
      where: { id }
    });
  }

  static async getBirthdayCustomers(date?: Date): Promise<Customer[]> {
    const targetDate = date || new Date();
    const month = targetDate.getMonth() + 1; // Prisma uses 1-based months
    const day = targetDate.getDate();

    const customers = await prisma.$queryRaw<Customer[]>`
      SELECT * FROM customers 
      WHERE isActive = true 
      AND EXTRACT(MONTH FROM dob) = ${month}
      AND EXTRACT(DAY FROM dob) = ${day}
      ORDER BY firstName, lastName
    `;

    return customers;
  }
}