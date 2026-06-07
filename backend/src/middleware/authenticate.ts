import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { fail } from '../utils/response';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    fail(res, 'Authentication required', 401);
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role, email: payload.email };
    next();
  } catch {
    fail(res, 'Invalid or expired token', 401);
  }
};
