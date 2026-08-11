import { Response } from 'express';

interface SuccessPayload<T> {
  statusCode?: number;
  message: string;
  data?: T;
}

interface ErrorPayload {
  statusCode?: number;
  message: string;
  errors?: string[];
}

export class ApiResponse {
  static success<T>(res: Response, { statusCode = 200, message, data }: SuccessPayload<T>): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data: data ?? null,
    });
  }

  static created<T>(res: Response, message: string, data?: T): Response {
    return ApiResponse.success(res, { statusCode: 201, message, data });
  }

  static error(res: Response, { statusCode = 500, message, errors = [] }: ErrorPayload): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }
}
