import { body } from 'express-validator';

export const upsertRatingValidation = [
  body('storeId').isInt({ min: 1 }).withMessage('storeId must be a valid store ID'),
  body('value')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be an integer between 1 and 5'),
];
