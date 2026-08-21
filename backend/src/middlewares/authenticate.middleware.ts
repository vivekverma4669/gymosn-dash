import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/ApiError';
import { verifyAccessToken } from '../utils/token';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    throw ApiError.unauthorized('Missing or invalid Authorization header');
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role, gymId: payload.gymId };
    next();
  } catch {
    throw ApiError.unauthorized('Access token is invalid or expired');
  }
};
