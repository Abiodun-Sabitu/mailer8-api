import { User } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateTokens, TokenPayload } from '../../utils/crypto';
import { RegisterAdminDto, LoginDto } from './auth.schemas';

export class AuthService {
  static async registerAdmin(data: RegisterAdminDto, createdBy: string): Promise<Omit<User, 'password'>> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: 'ADMIN',
        isActive: true
      }
    });

    // Return user without password (no tokens - they need to login separately)
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  static async login(data: LoginDto): Promise<{
    user: Omit<User, 'password'>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    // Find user by email
  
    const user = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const tokens = generateTokens(tokenPayload);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  static async refreshToken(refreshToken: string): Promise<{
    user: Omit<User, 'password'>;
    tokens: { accessToken: string; refreshToken: string };
  }> {
    try {
      // Verify the refresh token (this will throw if invalid/expired)
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as TokenPayload;

      // Get fresh user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId }
      });

      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokenPayload: TokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const tokens = generateTokens(tokenPayload);

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword,
        tokens
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  static async getCurrentUser(userId: string): Promise<Omit<User, 'password'> | null> {
   
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
  }
}