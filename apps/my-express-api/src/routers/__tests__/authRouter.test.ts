import request from 'supertest';
import express from 'express';
import authRouter from '../authRouter';
import jwt from 'jsonwebtoken';
import '../../utils/testSetup';
import { hashPassword } from '../../utils/hashing';
import User from '../../models/usersModel';

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Routes Integration Tests', () => {
  const mockUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'user'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should create a new user successfully', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send(mockUser)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'User created successfully');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', mockUser.email);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /auth/signin', () => {
    it('should login user successfully', async () => {
      const loginCredentials = {
        email: mockUser.email,
        password: mockUser.password
      };

      const hashedPassword = await hashPassword(mockUser.password);
      await User.create({
        ...mockUser,
        password: hashedPassword
      });
  

      const response = await request(app)
        .post('/auth/signin')
        .send(loginCredentials)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should validate login credentials', async () => {
      const response = await request(app)
        .post('/auth/signin')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /auth/logout', () => {
    it('should logout user successfully', async () => {
      const token = jwt.sign(
        { userId: 'test-id', email: mockUser.email },
        process.env.TOKEN_SECRET || 'test-secret'
      );

      const response = await request(app)
        .post('/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Logged out successfully');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/auth/logout')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('GET /auth/me', () => {
    it('should return user profile when authenticated', async () => {

      const hashedPassword = await hashPassword(mockUser.password);
      const createdUser = await User.create({
        ...mockUser,
        password: hashedPassword
      });
  
      const token = jwt.sign(
        { userId: createdUser.id, email: mockUser.email },
        process.env.TOKEN_SECRET || 'test-secret'
      );

      const response = await request(app)
        .get('/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('user');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });
});
