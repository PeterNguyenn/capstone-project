import express from 'express';
import { identifier } from '../middlewares/identification';
import { validate } from '../middlewares/validations';
import { ApplicationSchema } from '../types/auth/create-application-body.dto';
import { createApplication, getApplications, singleApplication } from '../controllers/applicationsController';


const router = express.Router();

router.get('/', identifier, getApplications);
router.get('/single-application', singleApplication);
router.post('/', validate(ApplicationSchema), identifier, createApplication);

export default router;