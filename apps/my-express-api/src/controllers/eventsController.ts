import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Event from '../models/eventsModel';
import Registration from '../models/registrationModel';
import User from '../models/usersModel';
import Application from '../models/applicationsModel';
import { sendPushNotification } from './notificationController';

const userId = (req: Request) => (req.header('x-user-id') || '').trim();

const toDate = (date: string, time: string) => new Date(`${date}T${time}`);
const bad = (res: Response, msg: string, code = 400) => res.status(code).json({ error: msg });

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title, shortDescription, date, startTime, endTime,
      capacity, campus, location, status = 'published', createdBy
    } = req.body ?? {};
    const startsAt = toDate(date, startTime);
    const endsAt   = toDate(date, endTime);

    if (isNaN(startsAt.getTime()) || isNaN(endsAt.getTime())) return bad(res, 'invalid date/time');
    if (startsAt.getTime() <= Date.now()) return bad(res, 'event must be in the future');
    if (endsAt <= startsAt) return bad(res, 'endTime must be after startTime');

    const doc = await Event.create({
      title, shortDescription, date, startTime, endTime,
      startsAt, endsAt, capacity: Number(capacity),
      campus, location, status, createdBy
    });

    res.status(201).json({ success: true, message: 'created', data: doc });
  } catch (error) {
    console.log(error);
    bad(res, 'internal server error', 500);
  }
};

export const createEventReminder = async (req: Request, res: Response) => {
  try {
    const {
      title, message
    } = req.body ?? {};

    if (!title) return bad(res, 'title is required');
    if (!message) return bad(res, 'message is required');

    const eventId = req.params._id;

    // 1) registrations for the event
    const regs = await Registration.find({ event: eventId })
      .select('userId')
      .lean();

    if (!regs.length) {
      return res.status(200).json({ success: true, message: 'Event mentors', count: 0, data: [] });
    }

    // 2) normalize to strings and validate as ObjectId strings
    const uniqueStr: string[] = Array.from(
      new Set<string>(regs.map(r => (r.userId ?? '').toString()))
    );

    const validIdStrs: string[] = uniqueStr.filter((s) => typeof s === 'string' && Types.ObjectId.isValid(s));
    if (!validIdStrs.length) {
      return res.status(200).json({ success: true, message: 'Event mentors', count: 0, data: [] });
    }

    const userObjectIds: Types.ObjectId[] = validIdStrs.map((s) => new Types.ObjectId(s));
    for (const uId of userObjectIds) {
      sendPushNotification(title, message, {}, uId);
    }
    res.status(201).json({ success: true, message: 'created', data: { notified: userObjectIds.length } });
  } catch (error) {
    console.log(error);
    bad(res, 'internal server error', 500);
  }
};

type FilterType = {
  status?: 'published' | 'cancelled';
  startsAt?: { $gte: Date };
}

export const listEvents = async (req: Request, res: Response) => {
  const { page , upcoming } = req.query;
  const itemsPerPage = 10;

  const isUpcoming = `${upcoming ?? ''}`.toLowerCase() === 'true';
  try {
    let pageNum = 0;
    if (typeof page === 'string') {
      const parsedPage = parseInt(page, 10);
      if (parsedPage <= 1) {
        pageNum = 0;
      } else {
        pageNum = parsedPage - 1;
      }
    }

    // Create a filter object that will be used in the find query
    const filter: FilterType = { status: 'published' };
    if (isUpcoming) filter.startsAt = { $gte: new Date() };

    const result = await Event.find(filter)
      .sort({ startsAt: 1 })
      .skip(pageNum * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    res.status(200).json({ success: true, page: page, limit: itemsPerPage,  message: 'applications', data: result });
  } catch (error) {
    console.error('listEvents', error);
    bad(res, 'internal server error', 500);
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const doc = await Event.findById(req.params._id).lean();
    if (!doc) return bad(res, 'not found', 404);
    res.status(200).json(doc);
  } catch (error) {
    console.error('getEvent', error);
    bad(res, 'invalid id', 400);
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const allowed = ['title', 'shortDescription', 'date', 'startTime', 'endTime', 'capacity', 'campus', 'location', 'status'] as const;
    const update: any = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    if (update.capacity !== undefined && Number(update.capacity) < 1) return bad(res, 'capacity must be > 0');

    if (update.date || update.startTime || update.endTime) {
      const current = await Event.findById(req.params._id).lean();
      if (!current) return bad(res, 'not found', 404);
      const date = update.date ?? current.date;
      const startTime = update.startTime ?? current.startTime;
      const endTime = update.endTime ?? current.endTime;
      const startsAt = toDate(date, startTime);
      const endsAt = toDate(date, endTime);
      if (startsAt.getTime() <= Date.now()) return bad(res, 'event must be in the future');
      if (endsAt <= startsAt) return bad(res, 'endTime must be after startTime');
      update.startsAt = startsAt;
      update.endsAt = endsAt;
    }

    const doc = await Event.findByIdAndUpdate(req.params._id, update, { new: true });
    if (!doc) return bad(res, 'not found', 404);
    res.status(200).json(doc);
  } catch (error) {
    console.error('updateEvent', error);
    bad(res, 'internal server error', 500);
  }
};

export const cancelEvent = async (req: Request, res: Response) => {
  try {
    const doc = await Event.findByIdAndUpdate(req.params._id, { status: 'cancelled' }, { new: true });
    if (!doc) return bad(res, 'not found', 404);
    res.status(200).json(doc);
  } catch (error) {
    console.error('cancelEvent', error);
    bad(res, 'invalid id', 400);
  }
};

export const joinEvent = async (req: Request, res: Response) => {
  const uid = userId(req);
  if (!uid) return bad(res, 'x-user-id header required');

  const session = await mongoose.startSession();
  try {
    let payload: any = {};
    await session.withTransaction(async () => {
      const ev = await Event.findById(req.params._id).session(session);
      if (!ev) throw new Error('not-found');
      if (ev.status !== 'published') throw new Error('not-open');
      if (ev.startsAt.getTime() <= Date.now()) throw new Error('started');

      const exists = await Registration.findOne({ event: ev._id, userId: uid }).session(session);
      if (exists) { payload = { joined: true, already: true }; return; }

      if (ev.attendeesCount >= ev.capacity) throw new Error('full');

      await Registration.create([{ event: ev._id, userId: uid }], { session });

      const r = await Event.updateOne(
        { _id: ev._id, attendeesCount: { $lt: ev.capacity } },
        { $inc: { attendeesCount: 1 } }
      ).session(session);

      if (r.modifiedCount === 0) throw new Error('full'); // race condition
      payload = { joined: true, already: false };
    });
    res.status(201).json(payload);
  } catch (error: any) {
    console.error('joinEvent', error);
    const map: Record<string, number> = { 'not-found': 404, 'not-open': 400, 'started': 400, 'full': 409 };
    bad(res, error?.message ?? 'internal server error', map[error?.message] ?? 500);
  } finally {
    session.endSession();
  }
};

export const leaveEvent = async (req: Request, res: Response) => {
  const uid = userId(req);
  if (!uid) return bad(res, 'x-user-id header required');

  const session = await mongoose.startSession();
  try {
    let left = false;
    await session.withTransaction(async () => {
      const ev = await Event.findById(req.params._id).session(session);
      if (!ev) throw new Error('not-found');

      const del = await Registration.deleteOne({ event: ev._id, userId: uid }).session(session);
      left = del.deletedCount > 0;
      if (left) {
        await Event.updateOne(
          { _id: ev._id, attendeesCount: { $gt: 0 } },
          { $inc: { attendeesCount: -1 } }
        ).session(session);
      }
    });
    res.status(200).json({ left });
  } catch (error: any) {
    console.error('leaveEvent', error);
    bad(res, error?.message === 'not-found' ? 'not found' : 'internal server error', error?.message === 'not-found' ? 404 : 500);
  } finally {
    session.endSession();
  }
};

/**
 * List mentors registered to an event
 * - Admin: returns all registered mentors
 * - Mentor: returns only their own registration (or empty if not registered)
 * Prefers Applications (studentNumber/currentTerm/phone/email/name).
 * Falls back to Users and includes studentId/currentTerm/phoneNumber if present on the user.
 */
export const getEventMentors = async (req: Request, res: Response) => {
  try {
    const eventId = req.params._id;
    const user = (req as any).user;

    // 1) registrations for the event
    let regs = await Registration.find({ event: eventId })
      .select('userId')
      .lean();

    // If mentor (not admin), only return their own registration
    if (user && user.role === 'mentor') {
      const mentorId = user.userId || user._id;
      regs = regs.filter(r => r.userId?.toString() === mentorId.toString());
    }

    if (!regs.length) {
      return res.status(200).json({ success: true, message: 'Event mentors', count: 0, data: [] });
    }

    // 2) normalize to strings and validate as ObjectId strings
    const uniqueStr: string[] = Array.from(
      new Set<string>(regs.map(r => (r.userId ?? '').toString()))
    );

    const validIdStrs: string[] = uniqueStr.filter((s) => typeof s === 'string' && Types.ObjectId.isValid(s));
    if (!validIdStrs.length) {
      return res.status(200).json({ success: true, message: 'Event mentors', count: 0, data: [] });
    }

    const userObjectIds: Types.ObjectId[] = validIdStrs.map((s) => new Types.ObjectId(s));

    // 3) preferred profile source: Applications
    const apps = await Application.find(
      { userId: { $in: userObjectIds } },
      { userId: 1, studentName: 1, studentNumber: 1, currentTerm: 1, phoneNumber: 1, emailAddress: 1 }
    ).lean();

    const appMap = new Map<string, {
      name?: string;
      studentId?: string;
      currentTerm?: string;
      phoneNumber?: string;
      email?: string;
    }>();

    for (const a of apps) {
      appMap.set(String(a.userId), {
        name: a.studentName,
        studentId: a.studentNumber,
        currentTerm: a.currentTerm,
        phoneNumber: a.phoneNumber,
        email: a.emailAddress
      });
    }

    // 4) fallback for users without application — include extra fields if your User model has them
    const missingIdStrs = validIdStrs.filter((idStr) => !appMap.has(idStr));

    let userFallback: Record<string, {
      name?: string;
      email?: string;
      studentId?: string;
      currentTerm?: string;
      phoneNumber?: string;
    }> = {};

    if (missingIdStrs.length) {
      const missingOids = missingIdStrs.map((s) => new Types.ObjectId(s));
      const users = await User.find(
        { _id: { $in: missingOids } },
        { name: 1, email: 1, studentId: 1, currentTerm: 1, phoneNumber: 1 }
      ).lean();

      userFallback = users.reduce<typeof userFallback>((acc, u) => {
        acc[String(u._id)] = {
          name: (u as any).name ?? '',
          email: (u as any).email ?? '',
          studentId: (u as any).studentId,
          currentTerm: (u as any).currentTerm,
          phoneNumber: (u as any).phoneNumber,
        };
        return acc;
      }, {});
    }

    // 5) compose output in the same order as the validated string ids
    const data = validIdStrs.map((idStr) => {
      const fromApp = appMap.get(idStr);
      if (fromApp) return fromApp;

      const fb = userFallback[idStr] ?? {};
      return {
        name: fb.name ?? '',
        studentId: fb.studentId,
        currentTerm: fb.currentTerm,
        phoneNumber: fb.phoneNumber,
        email: fb.email ?? '',
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Event mentors',
      count: data.length,
      data
    });
  } catch (error) {
    console.error('getEventMentors', error);
    return bad(res, 'internal server error', 500);
  }
};
