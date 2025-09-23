/**
 * Events router integration test (replica-set DB for Mongoose transactions)
 * - Spins up MongoMemoryReplSet so sessions/transactions work
 * - Mocks admin/mentor guards (no JWTs)
 * - Robustly extracts IDs and list shapes
 */
jest.setTimeout(60000);

import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

// ---- Mock guards BEFORE importing the router
type ReqWithUser = Request & { userId?: string; role?: 'admin' | 'mentor' };

jest.mock('../../middlewares/adminGuard', () => {
  const adminGuard = (_req: Request, _res: Response, next: NextFunction) => {
    const req = _req as ReqWithUser;
    req.userId = 'aaaaaaaaaaaaaaaaaaaaaaaa'; // 24 hex
    req.role = 'admin';
    next();
  };
  return { adminGuard };
});

jest.mock('../../middlewares/mentorGuard', () => {
  const mentorGuard = (req0: Request, _res: Response, next: NextFunction) => {
    const req = req0 as ReqWithUser;
    req.userId = (req.headers['x-user-id'] as string) ?? 'bbbbbbbbbbbbbbbbbbbbbbbb';
    req.role = 'mentor';
    next();
  };
  return { mentorGuard };
});

// Import the real router AFTER mocks
import eventRouter from '../../routers/eventRouter';

// --- Replica-set Mongo for transactions
let replset: MongoMemoryReplSet;

beforeAll(async () => {
  replset = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const uri = replset.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await replset.stop();
});

// ---- Helpers
function buildApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/events', eventRouter);
  return app;
}

function futureDate(days = 7): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function extractIdLoose(body: any): string | undefined {
  const candidates = [
    body?._id,
    body?.id,
    body?.data?._id,
    body?.data?.id,
    body?.data?.event?._id,
    body?.event?._id,
    body?.result?._id,
    body?.data?.result?._id,
  ].filter(Boolean);
  const first = candidates.find((v: unknown) => typeof v === 'string' && (v as string).length === 24);
  if (first) return first as string;

  // Fallback: find any 24-hex id string in payload
  const asString = JSON.stringify(body);
  const m = asString.match(/"([a-fA-F0-9]{24})"/);
  return m?.[1];
}

type EventDto = {
  _id: string;
  title: string;
  shortDescription: string;
  date: string;
  startTime: string;
  endTime: string;
  campus: string;
  location: string;
  status?: 'published' | 'cancelled';
  attendees?: string[];
};

function getEventsArray(body: any): EventDto[] {
  if (Array.isArray(body)) return body as EventDto[];
  if (Array.isArray(body?.data)) return body.data as EventDto[];
  if (Array.isArray(body?.events)) return body.events as EventDto[];
  if (Array.isArray(body?.data?.events)) return body.data.events as EventDto[];
  if (Array.isArray(body?.data?.items)) return body.data.items as EventDto[];
  return [];
}

// ---- Tests
describe('Events Router (with mocked guards + shared DB setup)', () => {
  const app = buildApp();
  const date = futureDate(7);

  const U1 = '111111111111111111111111';
  const U2 = '222222222222222222222222';
  const U3 = '333333333333333333333333';

  let id = '';

  it('creates an event (admin)', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Capstone Test Event',
        shortDescription: 'Router test',
        date,
        startTime: '17:00',
        endTime: '18:30',
        // name variability; validators ignore extras
        capacity: 2,
        mentorsRequired: 2,
        numberOfMentorsRequired: 2,
        campus: 'Trafalgar',
        location: 'Room B201',
      });

    expect([200, 201]).toContain(res.status);

    id = extractIdLoose(res.body) ?? '';

    if (!id) {
      // fallback: fetch list and match by title
      const list = await request(app).get('/api/events?upcoming=true').set('x-user-id', U1);
      expect(list.status).toBe(200);
      const arr = getEventsArray(list.body);
      id = arr.find((e) => e.title === 'Capstone Test Event')?._id ?? '';
    }

    expect(typeof id).toBe('string');
    expect(id).toHaveLength(24);
  });

  it('lists upcoming (mentor)', async () => {
    const res = await request(app).get('/api/events?upcoming=true').set('x-user-id', U1);
    expect(res.status).toBe(200);
    const arr = getEventsArray(res.body);
    expect(arr.some((e) => e._id === id)).toBe(true);
  });

  it('join enforces capacity', async () => {
    const a = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U1);
    expect([200, 201]).toContain(a.status);

    const b = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U2);
    expect([200, 201]).toContain(b.status);

    const c = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U3);
    expect([400, 409]).toContain(c.status); // full
  });

  it('leave then another mentor can join', async () => {
    const leave = await request(app).post(`/api/events/${id}/leave`).set('x-user-id', U2);
    expect(leave.status).toBe(200);
    expect(leave.body?.left).toBe(true);

    const join = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U3);
    expect([200, 201]).toContain(join.status);
  });

  it('update and cancel (admin), then joining fails', async () => {
    const upd = await request(app).patch(`/api/events/${id}`).set('Content-Type', 'application/json').send({ endTime: '19:00' });
    expect(upd.status).toBe(200);

    const cancel = await request(app).post(`/api/events/${id}/cancel`);
    expect(cancel.status).toBe(200);

    const again = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U1);
    expect([400, 409]).toContain(again.status);
  });
});
