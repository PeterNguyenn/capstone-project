import express from 'express';
import { identifier } from '../middlewares/identification';
import { validate } from '../middlewares/validations';
import { adminGuard } from '../middlewares/adminGuard';
import { ApplicationSchema } from '../types/auth/create-application-body.dto';
import { UpdateApplicationStatusSchema } from '../types/auth/update-application.dto';
import { createApplication, getApplications, singleApplication, updateApplication } from '../controllers/applicationsController';


const router = express.Router();

router.get('/', identifier, getApplications);
router.get('/single-application', identifier, singleApplication);
router.post('/', validate(ApplicationSchema), identifier, createApplication);
router.put('/:_id/review', validate(UpdateApplicationStatusSchema), adminGuard, updateApplication);

export default router;