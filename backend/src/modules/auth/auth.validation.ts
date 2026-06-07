import { body } from 'express-validator';

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>/?]).{8,16}$/;

export const signupValidation = [
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
];

export const loginValidation = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];

export const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .matches(PASSWORD_REGEX)
    .withMessage('New password must be 8-16 characters with at least one uppercase letter and one special character'),
];
