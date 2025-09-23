import express from 'express';
import request from 'supertest';

// Mock validation middleware and controllers before importing the router
jest.mock('../../middlewares/validations', () => ({
  validate: jest.fn((schema: any) => {
    return (req: any, res: any, next: any) => next();
  }),
}));

jest.mock('../../controllers/notificationController', () => ({
  registerToken: jest.fn((req: any, res: any) =>
    res.status(201).json({ ok: true, called: 'register' })
  ),
  unregisterToken: jest.fn((req: any, res: any) =>
    res.status(200).json({ ok: true, called: 'unregister' })
  ),
}));

import router from '../notificationRouter';
import * as controllers from '../../controllers/notificationController';

describe('notificationRouter', () => {
  let app: express.Express;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use(express.json());
    app.use('/notification', router);
  });

  it('POST /notification/register-token should invoke registerToken controller and return mocked response', async () => {
    const res = await request(app)
      .post('/notification/register-token')
      .send({ token: 'expoToken123', userId: 'user1' })
      .expect(201);

    expect(res.body).toEqual({ ok: true, called: 'register' });
    expect((controllers.registerToken as jest.Mock).mock.calls.length).toBe(1);
  });

  it('POST /notification/deactivate-token should invoke unregisterToken controller and return mocked response', async () => {
    const res = await request(app)
      .post('/notification/deactivate-token')
      .send({ token: 'expoToken123' })
      .expect(200);

    expect(res.body).toEqual({ ok: true, called: 'unregister' });
    expect((controllers.unregisterToken as jest.Mock).mock.calls.length).toBe(1);
  });

  it('unknown route under /notification returns 404', async () => {
    await request(app).get('/notification/unknown-route').expect(404);
  });
});