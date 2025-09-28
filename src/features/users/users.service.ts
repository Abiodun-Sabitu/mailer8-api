import { User, Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { parsePagination, createPaginatedResponse, PaginatedResponse } from '../../utils/pagination';
import { GetUsersQueryDto, UpdateUserStatusDto } from './users.schemas';

export const getUsers = async (query: GetUsersQueryDto): Promise<PaginatedResponse<Omit<User, 'password'>>> => {
  const pagination = parsePagination({ page: query.page, limit: query.limit });
  
  // Build where clause
  const where: Prisma.UserWhereInput = {};
  
  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search, mode: 'insensitive' } },
      { lastName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } }
    ];
  }
  
  if (query.role) {
    where.role = query.role;
  }
  
  if (query.isActive !== undefined) {
    where.isActive = query.isActive;
  }

  // Get users with pagination
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      },
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.user.count({ where })
  ]);

  return createPaginatedResponse(users, total, pagination);
};

export const getUserById = async (id: string): Promise<Omit<User, 'password'> | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};

export const updateUserStatus = async (id: string, data: UpdateUserStatusDto): Promise<Omit<User, 'password'>> => {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: data.isActive },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });

  return user;
};