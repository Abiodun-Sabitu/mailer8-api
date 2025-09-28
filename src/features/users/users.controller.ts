import { Request, Response } from 'express';
import { getUsers as getUsersService, getUserById as getUserByIdService, updateUserStatus as updateUserStatusService } from './users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, notFound } from '../../utils/responses';
import { logger } from '../../config/logger';
import { GetUsersQueryDto, UpdateUserStatusDto } from './users.schemas';

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const query: GetUsersQueryDto = req.query as any;

  const result = await getUsersService(query);

  ok(res, result, 'Users retrieved successfully');
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await getUserByIdService(id);

  if (!user) {
    return notFound(res, 'User not found');
  }

  ok(res, user, 'User retrieved successfully');
});

export const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const data: UpdateUserStatusDto = req.body;

  // Prevent self-deactivation
  if (req.user?.id === id && !data.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate your own account'
    });
  }

  const user = await updateUserStatusService(id, data);

  logger.info(`User status updated: ${user.email}`, {
    userId: user.id,
    isActive: user.isActive,
    updatedBy: req.user?.id
  });

  ok(res, user, `User ${data.isActive ? 'activated' : 'deactivated'} successfully`);
});