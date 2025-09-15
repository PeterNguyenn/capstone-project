import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Event from '../models/eventsModel';
import Registration from '../models/registrationModel';

const isAdmin = (req: Request) => (req.header('x-role') || '').toLowerCase() === 'admin';
const userId  = (req: Request) => (req.header('x-user-id') || '').trim();

const toDate = (date: string, time: string) => new Date(`${date}T${time}`);
const bad = (res: Response, msg: string, code = 400) => res.status(code).json({ error: msg });

export async function createEvent(req: Request, res: Response) {
  try {
    if (!isAdmin(req)) return bad(res, 'permission denied', 403);

    const {
      title, shortDescription, date, startTime, endTime,
      capacity, campus, location, status = 'published', createdBy
    } = req.body ?? {};

    const required = { title, shortDescription, date, startTime, endTime, capacity, campus, location };
    for (const [k, v] of Object.entries(required))
      if (v === undefined || v === null || v === '') return bad(res, `Missing field: ${k}`);

    if (Number(capacity) <= 0) return bad(res, 'capacity must be > 0');

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
    return res.status(201).json(doc);
  } catch (e: any) {
    console.error('createEvent', e);
    return bad(res, e?.message ?? 'internal', 500);
  }
}

export async function listEvents(req: Request, res: Response) {
  try {
    const upcoming = `${req.query.upcoming ?? ''}`.toLowerCase() === 'true';
    const filter: any = { status: 'published' };
    if (upcoming) filter.startsAt = { $gte: new Date() };
    const events = await Event.find(filter).sort({ startsAt: 1 }).limit(200).lean();
    return res.json(events);
  } catch (e: any) {
    console.error('listEvents', e);
    return bad(res, 'internal', 500);
  }
}

export async function getEvent(req: Request, res: Response) {
  try {
    const doc = await Event.findById(req.params.id).lean();
    if (!doc) return bad(res, 'not found', 404);
    return res.json(doc);
  } catch {
    return bad(res, 'invalid id');
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    if (!isAdmin(req)) return bad(res, 'permission denied', 403);

    const allowed = ['title','shortDescription','date','startTime','endTime','capacity','campus','location','status'] as const;
    const update: any = {};
    for (const k of allowed) if (k in req.body) update[k] = req.body[k];

    if (update.capacity !== undefined && Number(update.capacity) < 1) return bad(res, 'capacity must be > 0');

    if (update.date || update.startTime || update.endTime) {
      const current = await Event.findById(req.params.id).lean();
      if (!current) return bad(res, 'not found', 404);
      const date = update.date ?? current.date;
      const startTime = update.startTime ?? current.startTime;
      const endTime   = update.endTime ?? current.endTime;
      const startsAt = toDate(date, startTime);
      const endsAt   = toDate(date, endTime);
      if (startsAt.getTime() <= Date.now()) return bad(res, 'event must be in the future');
      if (endsAt <= startsAt) return bad(res, 'endTime must be after startTime');
      update.startsAt = startsAt; update.endsAt = endsAt;
    }

    const doc = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!doc) return bad(res, 'not found', 404);
    return res.json(doc);
  } catch (e: any) {
    console.error('updateEvent', e);
    return bad(res, 'internal', 500);
  }
}

export async function cancelEvent(req: Request, res: Response) {
  try {
    if (!isAdmin(req)) return bad(res, 'permission denied', 403);
    const doc = await Event.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!doc) return bad(res, 'not found', 404);
    return res.json(doc);
  } catch {
    return bad(res, 'invalid id');
  }
}

export async function joinEvent(req: Request, res: Response) {
  const uid = userId(req);
  if (!uid) return bad(res, 'x-user-id header required');

  const session = await mongoose.startSession();
  try {
    let payload: any = {};
    await session.withTransaction(async () => {
      const ev = await Event.findById(req.params.id).session(session);
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

      if (r.modifiedCount === 0) throw new Error('full'); // race
      payload = { joined: true, already: false };
    });
    return res.status(201).json(payload);
  } catch (e: any) {
    const map: Record<string, number> = { 'not-found': 404, 'not-open': 400, 'started': 400, 'full': 409 };
    return bad(res, e?.message ?? 'internal', map[e?.message] ?? 500);
  } finally {
    session.endSession();
  }
}

export async function leaveEvent(req: Request, res: Response) {
  const uid = userId(req);
  if (!uid) return bad(res, 'x-user-id header required');

  const session = await mongoose.startSession();
  try {
    let left = false;
    await session.withTransaction(async () => {
      const ev = await Event.findById(req.params.id).session(session);
      if (!ev) throw new Error('not-found');

      const del = await Registration.deleteOne({ event: ev._id, userId: uid }).session(session);
      left = del.deletedCount > 0;
      if (left) {
        await Event.updateOne({ _id: ev._id, attendeesCount: { $gt: 0 } }, { $inc: { attendeesCount: -1 } }).session(session);
      }
    });
    return res.json({ left });
  } catch (e: any) {
    return bad(res, e?.message === 'not-found' ? 'not found' : 'internal', e?.message === 'not-found' ? 404 : 500);
  } finally {
    session.endSession();
  }
}
