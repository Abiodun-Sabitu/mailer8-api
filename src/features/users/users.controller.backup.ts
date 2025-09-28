import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { ok, notFound } from '../../utils/responses';
import { logger } from '../../config/logger';
import { GetUsersQueryDto, UpdateUserStatusDto } from './users.schemas';

export class UsersController {
  static getUsers = asyncHandler(async (req: Request, res: Response) => {
    const query: GetUsersQueryDto = req.query as any;

    const result = await UsersService.getUsers(query);

    ok(res, result, 'Users retrieved successfully');
  });

  static getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await UsersService.getUserById(id);

    if (!user) {
      return notFound(res, 'User not found');
    }

    ok(res, user, 'User retrieved successfully');
  });

  static updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: UpdateUserStatusDto = req.body;

    // Prevent self-deactivation
    if (req.user?.id === id && !data.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const user = await UsersService.updateUserStatus(id, data);

    logger.info(`User status updated: ${user.email}`, {
      userId: user.id,
      isActive: user.isActive,
      updatedBy: req.user?.id
    });

    ok(res, user, `User ${data.isActive ? 'activated' : 'deactivated'} successfully`);
  });
}