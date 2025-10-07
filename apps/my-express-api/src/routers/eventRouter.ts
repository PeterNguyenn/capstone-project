import { Router } from 'express';
import {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  cancelEvent,
  joinEvent,
  leaveEvent,
  getEventMentors, // NEW
} from '../controllers/eventsController';
import { adminGuard } from '../middlewares/adminGuard';
import { mentorGuard } from '../middlewares/mentorGuard';
import { validate } from '../middlewares/validations';
import { CreateEventSchema } from '../types/event/create-event-body.dto';

const router = Router();

/**
 * Admin-only routes
 * - includes mentors listing for an event
 */
router.post('/', validate(CreateEventSchema), adminGuard, createEvent);
router.patch('/:id', adminGuard, updateEvent);
router.post('/:id/cancel', adminGuard, cancelEvent);
router.get('/:id/mentors', adminGuard, getEventMentors); // returns mentor info for the event

/**
 * Public / mentors routes
 */
router.get('/', mentorGuard, listEvents);
router.get('/:id', mentorGuard, getEvent);
router.post('/:id/join', mentorGuard, joinEvent);
router.post('/:id/leave', mentorGuard, leaveEvent);

export default router;
