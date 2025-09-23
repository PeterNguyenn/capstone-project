jest.mock('../../models/notificationTokenModel', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    updateMany: jest.fn(),
    getActiveTokens: jest.fn(),
  },
}));

import PushToken from '../../models/notificationTokenModel';
import { unregisterToken } from '../notificationController';

describe('notificationController.unregisterToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when token is not found', async () => {
    (PushToken.findOne as jest.Mock).mockResolvedValue(null);

    const req: any = { body: { token: 'token123' } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await unregisterToken(req, res);

    expect(PushToken.findOne).toHaveBeenCalledWith({ token: 'token123' });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Token not found',
    });
  });

  it('deactivates found token and returns success', async () => {
    const mockDoc: any = {
      isActive: true,
      save: jest.fn().mockResolvedValue(true),
    };
    (PushToken.findOne as jest.Mock).mockResolvedValue(mockDoc);

    const req: any = { body: { token: 'token123' } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await unregisterToken(req, res);

    expect(PushToken.findOne).toHaveBeenCalledWith({ token: 'token123' });
    expect(mockDoc.isActive).toBe(false);
    expect(mockDoc.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Token deactivated successfully',
    });
  });

  it('returns 500 when saving the token fails', async () => {
    const mockDoc: any = {
      isActive: true,
      save: jest.fn().mockRejectedValue(new Error('db error')),
    };
    (PushToken.findOne as jest.Mock).mockResolvedValue(mockDoc);

    const req: any = { body: { token: 'token123' } };
    const res: any = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await unregisterToken(req, res);

    expect(PushToken.findOne).toHaveBeenCalledWith({ token: 'token123' });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Failed to deactivate token',
    });
  });
});