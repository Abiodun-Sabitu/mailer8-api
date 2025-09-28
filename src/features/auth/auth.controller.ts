/// <reference path="../../types/express.d.ts" />
import { Request, Response } from 'express';
import { registerAdmin as registerAdminService, login as loginService, refreshToken as refreshTokenService, getCurrentUser as getCurrentUserService } from './auth.service';
import { asyncHandler } from '../../utils/asyncHandler';
import { created, ok, unauthorized } from '../../utils/responses';
import { logger } from '../../config/logger';
import { RegisterAdminDto, LoginDto } from './auth.schemas';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data: RegisterAdminDto = req.body;
  const createdBy = req.user?.id!; // Ensured by requireSuperAdmin middleware

  const user = await registerAdminService(data, createdBy);

  logger.info(`New admin registered: ${user.email}`, {
    userId: user.id,
    createdBy
  });

  created(res, {
    user
  }, 'Admin created successfully. They can now login with their credentials.');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data: LoginDto = req.body;

  const result = await loginService(data);

  logger.info(`User logged in: ${result.user.email}`, {
    userId: result.user.id
  });

  // Set refresh token as httpOnly cookie with unique name
  res.cookie('mailer8_refresh_token', result.tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
  });

  ok(res, {
    user: result.user,
    accessToken: result.tokens.accessToken
  }, 'Login successful');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (userId) {
    logger.info(`User logged out: ${req.user?.email}`, { userId });
  }

  res.clearCookie('mailer8_refresh_token');
  ok(res, null, 'Logout successful');
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.mailer8_refresh_token;

  if (!refreshToken) {
    return unauthorized(res, 'Refresh token not provided');
  }

  try {
    const result = await refreshTokenService(refreshToken);

    // Set new refresh token as httpOnly cookie
    res.cookie('mailer8_refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
    });

    ok(res, {
      user: result.user,
      accessToken: result.tokens.accessToken
    }, 'Token refreshed successfully');
  } catch (error) {
    // Clear invalid refresh token
    res.clearCookie('mailer8_refresh_token');
    return unauthorized(res, 'Invalid or expired refresh token');
  }
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  
  const userId = req.user?.id!;

  const user = await getCurrentUserService(userId);

  if (!user) {
    return unauthorized(res, 'User not found');
  }

  ok(res, user, 'User profile retrieved successfully');
});