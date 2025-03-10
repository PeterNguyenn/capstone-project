import express from 'express';
import { profile, signin, signup } from '../controllers';
import { SignupSchema } from '../types/auth/signup-body.dto';
import { validate } from '../middlewares/validations';
import { LoginSchema } from '../types/auth/login-body.dto';
import { identifier } from '../middlewares/identification';

const router = express.Router();

router.post('/signup', validate(SignupSchema), signup);
router.post('/signin', validate(LoginSchema), signin);
router.get('/me', identifier, profile);

export default router;