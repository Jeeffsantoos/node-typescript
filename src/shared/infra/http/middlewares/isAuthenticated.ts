/* eslint-disable no-unused-vars */
import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const secretKey: string | undefined = authConfig.jwt.secret;
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing,');
  }

  const [type, token] = authHeader.split(' ');

  if (!secretKey) {
    throw new Error('JWT secret is undefined in authConfig');
  }

  try {
    const decodedToken = verify(token, secretKey);

    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}
