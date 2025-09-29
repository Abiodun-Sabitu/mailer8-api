import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

export const signAccessToken = (payload: TokenPayload): string => {
  const jwtPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };
  
  return jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  } as jwt.SignOptions);
};

export const signRefreshToken = (payload: TokenPayload): string => {
  const jwtPayload = {
    userId: payload.userId,
    email: payload.email,
    role: payload.role
  };
  
  return jwt.sign(jwtPayload, process.env.REFRESH_SECRET!, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload)
  };
};