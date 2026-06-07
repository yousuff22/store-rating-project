import { Router } from 'express';
import * as authController from './auth.controller';
import { signupValidation, loginValidation, updatePasswordValidation } from './auth.validation';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/authenticate';

const router = Router();

router.post('/signup', signupValidation, validate, authController.signup);
router.post('/login', loginValidation, validate, authController.login);
router.patch('/password', authenticate, updatePasswordValidation, validate, authController.updatePassword);

export default router;
