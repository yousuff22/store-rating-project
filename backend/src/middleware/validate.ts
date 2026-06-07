import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { fail } from '../utils/response';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map((err) => ({
      field: (err as { path?: string; param?: string }).path || (err as { param?: string }).param || 'unknown',
      message: err.msg as string,
    }));
    fail(res, 'Validation failed', 422, formatted);
    return;
  }
  next();
};
