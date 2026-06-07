import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { fail } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[ERROR]', err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = (err.meta?.target as string[])?.join(', ') || 'field';
      fail(res, `A record with this ${field} already exists`, 409);
      return;
    }
    if (err.code === 'P2025') {
      fail(res, 'Record not found', 404);
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    fail(res, 'Invalid data provided', 400);
    return;
  }

  const status = (err as { status?: number }).status || 500;
  const message = status === 500 ? 'Internal server error' : err.message;
  fail(res, message, status);
};
