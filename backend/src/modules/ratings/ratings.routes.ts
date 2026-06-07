import { Router } from 'express';
import { Role } from '@prisma/client';
import * as ratingsController from './ratings.controller';
import { upsertRatingValidation } from './ratings.validation';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';

const router = Router();

router.post('/', authenticate, authorize(Role.NORMAL_USER), upsertRatingValidation, validate, ratingsController.upsertRating);
router.get('/store/:storeId', authenticate, authorize(Role.ADMIN, Role.STORE_OWNER), ratingsController.getRatingsForStore);

export default router;
