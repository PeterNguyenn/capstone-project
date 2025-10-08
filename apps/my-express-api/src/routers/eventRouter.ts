import { Router } from 'express';
import {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  cancelEvent,
  joinEvent,
  leaveEvent,
  getEventMentors,
  createEventReminder, // NEW
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
router.patch('/:_id', adminGuard, updateEvent);
router.post('/:_id/reminder', adminGuard, createEventReminder);
router.post('/:_id/cancel', adminGuard, cancelEvent);
router.get('/:_id/mentors', adminGuard, getEventMentors); // returns mentor info for the event

/**
 * Public / mentors routes
 */
router.get('/', mentorGuard, listEvents);
router.get('/:_id', mentorGuard, getEvent);
router.post('/:_id/join', mentorGuard, joinEvent);
router.post('/:_id/leave', mentorGuard, leaveEvent);

export default router;
