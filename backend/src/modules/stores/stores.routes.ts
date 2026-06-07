import { Router } from 'express';
import { Role } from '@prisma/client';
import * as storesController from './stores.controller';
import { createStoreValidation } from './stores.validation';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

// /mine must be before /:id to avoid param conflict
router.get('/mine', authenticate, authorize(Role.STORE_OWNER), storesController.getMyStore);
router.get('/', authenticate, authorize(Role.ADMIN, Role.NORMAL_USER), storesController.listStores);
router.post('/', authenticate, authorize(Role.ADMIN), createStoreValidation, validate, storesController.createStore);
router.get('/:id', authenticate, authorize(Role.ADMIN, Role.NORMAL_USER), storesController.getStoreById);

export default router;
