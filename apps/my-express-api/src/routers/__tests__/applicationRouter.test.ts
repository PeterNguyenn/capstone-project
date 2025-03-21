import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import applicationRouter from '../applicationRouter';
import Application from '../../models/applicationsModel';
import User from '../../models/usersModel';
import jwt from 'jsonwebtoken';

import '../../utils/testSetup';

const app = express();
app.use(express.json());
app.use('/applications', applicationRouter);

describe('Application Routes Integration Tests', () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'user'
  };

  const mockApplication = {
    studentName: "John Doe",
    studentNumber: "12345678",
    address: "123 Main Street, City, Country",
    phoneNumber: "123-456-7890",
    alternateNumber: "098-765-4321",
    emailAddress: "john.doe@email.com",
    programOfStudy: "Computer Science",
    currentTerm: "Fall 2023",
    numberOfTermsInProgram: "4",
    campus: "Main Campus",
    anticipatedGraduationDate: "2024-05-30",
    dietaryRestrictions: "None",
    shirtSize: "L",
    accommodationsRequired: "No",
    references: [
      {
        name: "Jane Smith",
        relationship: "Professor",
        phoneNumber: "111-222-3333",
        emailAddress: "jane.smith@university.com"
      },
      {
        name: "Bob Wilson",
        relationship: "Previous Employer",
        phoneNumber: "444-555-6666",
        emailAddress: "bob.wilson@company.com"
      }
    ],
    whyInterested: "Passionate about mentoring and technology",
    makingDifference: "Want to help others learn and grow",
    strengths: "Communication, problem-solving, patience",
    areasOfGrowth: "Public speaking, leadership",
    extraSkills: "Fluent in multiple programming languages",
    additionalInfo: "Available for evening sessions"
  }
  
  const mockToken = jwt.sign(
    { userId: mockUser._id, email: mockUser.email },
    process.env.TOKEN_SECRET || 'test-secret'
  );

  beforeEach(async () => {
    await Application.deleteMany({});
    await User.create(mockUser);
  });

  describe('GET /applications', () => {
    it('should return paginated applications when authenticated', async () => {
      // Create test applications
      await Application.create([
        { userId: mockUser._id, ...mockApplication, studentName: "Test 1" },
        { userId: mockUser._id, ...mockApplication, studentName: "Test 2" }
      ]);

      const response = await request(app)
        .get('/applications')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'applications');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const response = await request(app)
        .get('/applications?page=2')
        .set('Authorization', `Bearer ${mockToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/applications')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('GET /applications/single-application', () => {
    it('should return a single application', async () => {
      const testApp = await Application.create({
        userId: mockUser._id,
        ...mockApplication,
      });

      const response = await request(app)
        .get('/applications/single-application')
        .set('Authorization', `Bearer ${mockToken}`)
        .query({ _id: testApp._id.toString() })
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'single Application');
      expect(response.body.data).toHaveProperty('studentName', mockApplication.studentName);
    });

    it('should return 404 for non-existent application', async () => {
      const response = await request(app)
        .get('/applications/single-application')
        .set('Authorization', `Bearer ${mockToken}`)
        .query({ _id: new mongoose.Types.ObjectId().toString() })
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Application unavailable');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/applications/single-application')
        .expect(401);

      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });
  });

  describe('POST /applications', () => {
    it('should create new application when authenticated', async () => {

      const response = await request(app)
        .post('/applications')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(mockApplication)
        .expect(201);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'created');
      expect(response.body.data).toHaveProperty('studentName', mockApplication.studentName);
    });

    it('should validate application schema', async () => {
      const response = await request(app)
        .post('/applications')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('errors');
    });
  });
});
