import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import * as usersService from './users.service';
import { success } from '../../utils/response';

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, address, role, sortBy, sortDir } = req.query as Record<string, string>;
    const users = await usersService.listUsers({
      name,
      email,
      address,
      role: role as Role | undefined,
      sortBy: sortBy as 'name' | 'email' | 'role' | 'createdAt' | undefined,
      sortDir: sortDir as 'asc' | 'desc' | undefined,
    });
    success(res, users);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.createUser(req.body);
    success(res, user, 'User created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.createAdmin(req.body);
    success(res, user, 'Admin user created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await usersService.getUserById(parseInt(req.params.id, 10));
    success(res, user);
  } catch (err) {
    next(err);
  }
};
