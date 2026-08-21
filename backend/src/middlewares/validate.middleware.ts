import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ApiError } from '../common/ApiError';

export const validate = (schema: AnyZodObject) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        throw ApiError.badRequest(
          'Validation failed',
          err.errors.map((e) => `${e.path.join('.')}: ${e.message}`)
        );
      }
      throw err;
    }
  };
};
