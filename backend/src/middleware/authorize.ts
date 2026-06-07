import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { fail } from '../utils/response';

export const authorize = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      fail(res, 'Forbidden: insufficient permissions', 403);
      return;
    }
    next();
  };
};
