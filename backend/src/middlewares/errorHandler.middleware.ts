import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../common/ApiError';
import { ApiResponse } from '../common/ApiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    if (!err.isOperational) {
      logger.error(err.message, err.stack);
    }
    ApiResponse.error(res, { statusCode: err.statusCode, message: err.message, errors: err.errors });
    return;
  }

  logger.error('Unhandled error', err);
  ApiResponse.error(res, { statusCode: 500, message: 'Internal server error' });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponse.error(res, { statusCode: 404, message: `Route not found: ${req.method} ${req.originalUrl}` });
};
