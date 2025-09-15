import { Router } from 'express';
import {
  createEvent, listEvents, getEvent, updateEvent, cancelEvent,
  joinEvent, leaveEvent
} from '../controllers/eventsController';

const router = Router();

// Admin
router.post('/', createEvent);
router.patch('/:id', updateEvent);
router.post('/:id/cancel', cancelEvent);

// Public / Mentors
router.get('/', listEvents);
router.get('/:id', getEvent);
router.post('/:id/join', joinEvent);
router.post('/:id/leave', leaveEvent);

export default router;
