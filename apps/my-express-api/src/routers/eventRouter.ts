import { Router } from 'express';
import {
  createEvent, listEvents, getEvent, updateEvent, cancelEvent,
  joinEvent, leaveEvent
} from '../controllers/eventsController';
import { adminGuard } from '../middlewares/adminGuard';
import { identifier } from '../middlewares/identification';
import { validate } from '../middlewares/validations';
import { CreateEventSchema } from '../types/event/create-event-body.dto';

const router = Router();

// Admin
router.post('/', validate(CreateEventSchema),adminGuard, createEvent);
router.patch('/:id',adminGuard, updateEvent);
router.post('/:id/cancel',adminGuard, cancelEvent);

// Public / Mentors
router.get('/',identifier, listEvents);
router.get('/:id',identifier, getEvent);
router.post('/:id/join',identifier, joinEvent);
router.post('/:id/leave',identifier, leaveEvent);

export default router;
