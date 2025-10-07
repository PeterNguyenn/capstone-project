/**
 * Events router integration test (replica-set DB for Mongoose transactions)
 * - Spins up MongoMemoryReplSet so sessions/transactions work
 * - Mocks admin/mentor guards (no JWTs)
 * - Mocks Application model to prevent heavy validation/hooks during User.create
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

/**
 * Mock the Application model BEFORE importing router.
 * Provide a query-like object (supports .lean()).
 */
const mockAppFind = jest.fn().mockReturnValue({
  lean: () => Promise.resolve([]),
});
const mockAppCreate = jest.fn().mockResolvedValue(null);

jest.mock('../../models/applicationsModel', () => ({
  __esModule: true,
  default: {
    find: (...args: any[]) => mockAppFind(...args),
    create: (...args: any[]) => mockAppCreate(...args),
  },
}));

// Import the real router AFTER mocks
import eventRouter from '../../routers/eventRouter';
// Seed mentors for the mentors endpoint test
import User from '../../models/usersModel';

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
        capacity: 2,
        mentorsRequired: 2,
        numberOfMentorsRequired: 2,
        campus: 'Trafalgar',
        location: 'Room B201',
      });

    expect([200, 201]).toContain(res.status);

    // Strict: your createEvent returns { success, message, data: doc }
    id = res.body?.data?._id ?? '';
    if (!id) {
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
    const upd = await request(app)
      .patch(`/api/events/${id}`)
      .set('Content-Type', 'application/json')
      .send({ endTime: '19:00' });
    expect(upd.status).toBe(200);

    const cancel = await request(app).post(`/api/events/${id}/cancel`);
    expect(cancel.status).toBe(200);

    const again = await request(app).post(`/api/events/${id}/join`).set('x-user-id', U1);
    expect([400, 409]).toContain(again.status);
  });

  // Mentors listing
  it('returns mentors info for an event', async () => {
    // fresh published event
    const create = await request(app)
      .post('/api/events')
      .set('Content-Type', 'application/json')
      .send({
        title: 'Mentor Info Event',
        shortDescription: 'For mentors endpoint test',
        date,
        startTime: '10:00',
        endTime: '11:00',
        capacity: 10,
        campus: 'Trafalgar',
        location: 'Room A101',
      });
    expect([200, 201]).toContain(create.status);

    const eventId = create.body?.data?._id as string;
    expect(typeof eventId).toBe('string');
    expect(eventId).toHaveLength(24);

    // seed 2 mentor users
    const M1 = '444444444444444444444444';
    const M2 = '555555555555555555555555';

    await User.create([
      {
        _id: new mongoose.Types.ObjectId(M1),
        name: 'Alice Mentor',
        studentId: 'S10001',
        currentTerm: 'Fall 2024',
        phoneNumber: '111-111-1111',
        email: 'alice@example.com',
        password: 'x',
        role: 'mentor',
      },
      {
        _id: new mongoose.Types.ObjectId(M2),
        name: 'Bob Mentor',
        studentId: 'S10002',
        currentTerm: 'Fall 2024',
        phoneNumber: '222-222-2222',
        email: 'bob@example.com',
        password: 'x',
        role: 'mentor',
      },
    ]);

    // join both mentors
    const j1 = await request(app).post(`/api/events/${eventId}/join`).set('x-user-id', M1);
    expect([200, 201]).toContain(j1.status);

    const j2 = await request(app).post(`/api/events/${eventId}/join`).set('x-user-id', M2);
    expect([200, 201]).toContain(j2.status);

    // >>>>>>> inject Application docs so controller can enrich profile fields
    mockAppFind.mockReturnValueOnce({
      lean: () =>
        Promise.resolve([
          {
            userId: new mongoose.Types.ObjectId(M1),
            studentName: 'Alice Mentor',
            studentNumber: 'S10001',
            currentTerm: 'Fall 2024',
            phoneNumber: '111-111-1111',
            emailAddress: 'alice@example.com',
          },
          {
            userId: new mongoose.Types.ObjectId(M2),
            studentName: 'Bob Mentor',
            studentNumber: 'S10002',
            currentTerm: 'Fall 2024',
            phoneNumber: '222-222-2222',
            emailAddress: 'bob@example.com',
          },
        ]),
    });
    // <<<<<<<

    // fetch mentors list (admin-only; mocked)
    const res = await request(app).get(`/api/events/${eventId}/mentors`);
    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('message', 'Event mentors');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.count).toBe(2);

    const emails = res.body.data.map((m: any) => m.email).sort();
    expect(emails).toEqual(['alice@example.com', 'bob@example.com'].sort());

    for (const m of res.body.data) {
      expect(m).toHaveProperty('name');
      expect(m).toHaveProperty('studentId');
      expect(m).toHaveProperty('currentTerm');
      expect(m).toHaveProperty('phoneNumber');
      expect(m).toHaveProperty('email');
      expect(m).not.toHaveProperty('password');
    }
  });
});
