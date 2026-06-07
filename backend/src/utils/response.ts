import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
}

export const success = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200
): Response => {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  return res.status(statusCode).json(body);
};

export const fail = (
  res: Response,
  message: string,
  statusCode = 400,
  errors?: Array<{ field: string; message: string }>
): Response => {
  const body: ApiResponse = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};
