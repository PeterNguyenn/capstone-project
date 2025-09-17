import express from 'express';
import { identifier } from '../middlewares/identification';
import { validate } from '../middlewares/validations';
import { TokenRegisterSchema } from '../types/notification/create-application-body.dto';
import { registerToken, unregisterToken } from '../controllers/notificationController';


const router = express.Router();

router.post('/register-token', validate(TokenRegisterSchema), registerToken);
router.post('/deactivate-token', validate(TokenRegisterSchema), unregisterToken);

export default router;