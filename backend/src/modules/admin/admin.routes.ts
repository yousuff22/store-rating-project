import { Router, Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { authenticate } from '../../middleware/authenticate';
import { authorize } from '../../middleware/authorize';
import { prisma } from '../../lib/prisma';
import { success } from '../../utils/response';

const router = Router();

router.get('/stats', authenticate, authorize(Role.ADMIN), async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await prisma.$transaction([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);
    success(res, { totalUsers, totalStores, totalRatings });
  } catch (err) {
    next(err);
  }
});

export default router;
