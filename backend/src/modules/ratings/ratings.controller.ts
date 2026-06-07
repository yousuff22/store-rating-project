import { Request, Response, NextFunction } from 'express';
import * as ratingsService from './ratings.service';
import { success } from '../../utils/response';

export const upsertRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rating = await ratingsService.upsertRating(
      req.user!.id,
      parseInt(req.body.storeId, 10),
      parseInt(req.body.value, 10)
    );
    success(res, rating, 'Rating submitted successfully', 200);
  } catch (err) {
    next(err);
  }
};

export const getRatingsForStore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const ratings = await ratingsService.getRatingsForStore(parseInt(req.params.storeId, 10));
    success(res, ratings);
  } catch (err) {
    next(err);
  }
};
