import { body } from 'express-validator';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>/?]).{8,16}$/;

export const createUserValidation = [
  body('name')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters'),
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
  body('password')
    .matches(PASSWORD_REGEX)
    .withMessage('Password must be 8-16 characters with at least one uppercase letter and one special character'),
  body('role')
    .optional()
    .isIn(['NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be NORMAL_USER or STORE_OWNER'),
];
