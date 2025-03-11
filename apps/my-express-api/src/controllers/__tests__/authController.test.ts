import { Request, Response } from 'express';
import { signup, signin, logout, profile, AuthRequest } from '../authController';
import User from '../../models/usersModel';
import * as hashing from '../../utils/hashing';
import jwt from 'jsonwebtoken';

jest.mock('../../models/usersModel');
jest.mock('../../utils/hashing');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {
  let mockRequest: Partial<Request>;
  let mockAuthenticatedRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  const mockUser = {
    _id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword123',
    role: 'user'
  };

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockAuthenticatedRequest = {
      ...mockRequest,
      user: { userId: 'test-id', email: 'test@example.com', role: 'user' }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn()
    };
  });

  describe('signup', () => {
    it('should create a new user successfully', async () => {
      mockRequest.body = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hashing.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

      await signup(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.send).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'User created successfully',
          data: expect.objectContaining({
            token: 'mockToken'
          })
        })
      );
    });

    it('should return error if user already exists', async () => {
      mockRequest.body = {
        email: 'existing@example.com',
        password: 'password123'
      };
      
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      await signup(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'User already exists!'
      });
    });
  });

  describe('signin', () => {
    it('should login user successfully', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      (User.findOne as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser)
      }));
      (hashing.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('mockToken');

      await signin(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.cookie).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { token: 'mockToken' },
        message: 'logged in successfully'
      });
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await logout(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('Authorization');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully'
      });
    });
  });

  describe('profile', () => {
    it('should return user profile successfully', async () => {
      (User.findById as jest.Mock).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockUser)
      }));

      await profile(mockAuthenticatedRequest as AuthRequest, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: { user: mockUser }
      });
    });
  });
});
