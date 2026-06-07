import { Router } from 'express';
import { Role } from '@prisma/client';
import * as usersController from './users.controller';
import { createUserValidation } from './users.validation';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();
const adminOnly = [authenticate, authorize(Role.ADMIN)];

router.get('/', ...adminOnly, usersController.listUsers);
router.post('/', ...adminOnly, createUserValidation, validate, usersController.createUser);
router.post('/admins', ...adminOnly, createUserValidation, validate, usersController.createAdmin);
router.get('/:id', ...adminOnly, usersController.getUserById);

export default router;
