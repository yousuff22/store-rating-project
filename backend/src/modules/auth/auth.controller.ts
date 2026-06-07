import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { success } from '../../utils/response';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.signup(req.body);
    success(res, user, 'Account created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.login(req.body);
    success(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
};

export const updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.updatePassword(req.user!.id, currentPassword, newPassword);
    success(res, null, 'Password updated successfully');
  } catch (err) {
    next(err);
  }
};
