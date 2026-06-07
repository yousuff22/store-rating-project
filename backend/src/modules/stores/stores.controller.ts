import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import * as storesService from './stores.service';
import { success } from '../../utils/response';

export const listStores = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, address, sortBy, sortDir } = req.query as Record<string, string>;
    const stores = await storesService.listStores({
      name,
      address,
      sortBy: sortBy as 'name' | 'address' | 'createdAt' | undefined,
      sortDir: sortDir as 'asc' | 'desc' | undefined,
      requestingUserId: req.user?.id,
      requestingUserRole: req.user?.role,
    });
    success(res, stores);
  } catch (err) {
    next(err);
  }
};

export const createStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const store = await storesService.createStore({ ...req.body, ownerId: parseInt(req.body.ownerId, 10) });
    success(res, store, 'Store created successfully', 201);
  } catch (err) {
    next(err);
  }
};

export const getMyStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const store = await storesService.getMyStore(req.user!.id);
    success(res, store);
  } catch (err) {
    next(err);
  }
};

export const getStoreById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const store = await storesService.getStoreById(
      parseInt(req.params.id, 10),
      req.user?.id,
      req.user?.role
    );
    success(res, store);
  } catch (err) {
    next(err);
  }
};
