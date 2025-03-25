import { Request, Response } from 'express';
import { getApplications, singleApplication, createApplication, updateApplication } from '../applicationsController';
import Application from '../../models/applicationsModel';
import { AuthRequest } from '../authController';

jest.mock('../../models/applicationsModel');

describe('Applications Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthenticatedRequest: Partial<AuthRequest>;
  
  const mockApplication = {
    _id: 'test-id',
    userId: {
      email: 'test@example.com'
    },
    createdAt: new Date()
  };

  beforeEach(() => {
    mockRequest = {
      query: {},
      body: {},
      params: {}
    };
    mockAuthenticatedRequest = {
      ...mockRequest,
      user: { userId: 'test-id', email: 'test@example.com', role: 'user' }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getApplications', () => {
    it('should return paginated applications successfully', async () => {
      mockRequest.query = { page: '2' };
      
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockApplication])
      };
      
      (Application.find as jest.Mock).mockImplementation(() => mockFind);

      await getApplications(mockRequest as Request, mockResponse as Response);

      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockFind.skip).toHaveBeenCalledWith(10);
      expect(mockFind.limit).toHaveBeenCalledWith(10);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'applications',
        data: [mockApplication]
      });
    });

    it('should handle first page correctly', async () => {
      mockRequest.query = { page: '1' };
      
      const mockFind = {
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        populate: jest.fn().mockResolvedValue([mockApplication])
      };
      
      (Application.find as jest.Mock).mockImplementation(() => mockFind);

      await getApplications(mockRequest as Request, mockResponse as Response);

      expect(mockFind.skip).toHaveBeenCalledWith(0);
    });
  });

  describe('singleApplication', () => {
    it('should return a single application successfully', async () => {
      mockRequest.query = { _id: 'test-id' };
      
      (Application.findOne as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(mockApplication)
      }));

      await singleApplication(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'single Application',
        data: mockApplication
      });
    });

    it('should return 404 when application not found', async () => {
      mockRequest.query = { _id: 'non-existent-id' };
      
      (Application.findOne as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null)
      }));

      await singleApplication(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Application unavailable'
      });
    });
  });

  describe('createApplication', () => {
    it('should create a new application successfully', async () => {
      mockRequest.body = { someData: 'test data' };
      
      (Application.create as jest.Mock).mockResolvedValue(mockApplication);

      await createApplication(mockAuthenticatedRequest as AuthRequest, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'created',
        data: mockApplication
      });
    });
  });

  describe('updateApplication', () => {
    it('should update application status successfully', async () => {
      const mockExistingApplication = {
        _id: 'test-id',
        status: 'pending',
        save: jest.fn().mockResolvedValue({
          _id: 'test-id',
          status: 'accepted'
        })
      };
  
      mockRequest.params = { _id: 'test-id' };
      mockRequest.body = { status: 'accepted' };
      
      (Application.findOne as jest.Mock).mockResolvedValue(mockExistingApplication);
  
      await updateApplication(mockRequest as Request, mockResponse as Response);
  
      expect(Application.findOne).toHaveBeenCalledWith({ _id: 'test-id' });
      expect(mockExistingApplication.status).toBe('accepted');
      expect(mockExistingApplication.save).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Application updated successfully',
        data: expect.objectContaining({
          _id: 'test-id',
          status: 'accepted'
        })
      });
    });
  
    it('should return 404 when application not found', async () => {
      mockRequest.params = { _id: 'non-existent-id' };
      mockRequest.body = { status: 'accepted' };
      
      (Application.findOne as jest.Mock).mockResolvedValue(null);
  
      await updateApplication(mockRequest as Request, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Application not found'
      });
    });
  
    it('should handle errors during update', async () => {
      const mockError = new Error('Database error');
      mockRequest.params = { _id: 'test-id' };
      mockRequest.body = { status: 'accepted' };
      
      (Application.findOne as jest.Mock).mockResolvedValue({
        _id: 'test-id',
        status: 'pending',
        save: jest.fn().mockRejectedValue(mockError)
      });
  
      await updateApplication(mockRequest as Request, mockResponse as Response);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error updating application',
        error: 'Database error'
      });
    });
  });
});
