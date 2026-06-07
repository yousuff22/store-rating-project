import { body } from 'express-validator';

export const createStoreValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Store name must be between 20 and 60 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required')
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  body('ownerId')
    .isInt({ min: 1 })
    .withMessage('ownerId must be a valid user ID'),
];
