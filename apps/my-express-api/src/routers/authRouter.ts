import express from 'express';
import { signin, signup } from '../controllers';
import { SignupSchema } from '../types/auth/signup-body.dto';
import { validate } from '../middlewares/validations';
import { LoginSchema } from '../types/auth/login-body.dto';

const router = express.Router();

router.post('/signup', validate(SignupSchema), signup);
router.post('/login', validate(LoginSchema), signin);

export default router;