import { Request, Response } from 'express';
import {
  registerToken,
  unregisterToken,
  sendPushNotification
} from '../notificationController';
import PushToken from '../../models/notificationTokenModel';

// ✅ Correct Jest mock for expo-server-sdk
jest.mock('expo-server-sdk', () => {
  class FakeExpo {
    chunkPushNotifications = jest.fn((messages) => [messages]);
    sendPushNotificationsAsync = jest.fn(async (chunk) =>
      chunk.map(() => ({ status: 'ok' }))
    );
  }

  // Attach a mock static method to the class itself
  (FakeExpo as any).isExpoPushToken = jest.fn((token: string) =>
    token.startsWith('ExpoPush')
  );

  return { Expo: FakeExpo };
});

// Import AFTER the mock so we get the mocked class
import { Expo } from 'expo-server-sdk';

// ✅ Mock the PushToken Mongoose model
jest.mock('../../models/notificationTokenModel');

describe('Notification Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = { body: {} };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
    // Patch PushToken.prototype.save to set _id on instance
    (PushToken.prototype.save as jest.Mock).mockImplementation(function () {
      this._id = this._id || 'abc123';
      return Promise.resolve(this);
    });
    // Reset Expo.isExpoPushToken to default
    (Expo as any).isExpoPushToken.mockImplementation((token: string) => token.startsWith('ExpoPush'));
  });

  // -------- registerToken --------
  describe('registerToken', () => {
    it('registers a new token', async () => {
      mockRequest.body = {
        token: 'ExpoPushToken123',
        userId: 'user1',
        deviceId: 'device1',
        platform: 'ios',
        appVersion: '1.0',
      };

  (PushToken.findOne as unknown as jest.Mock).mockResolvedValue(null);

      // Mock the PushToken constructor to return an object with _id and save
      const pushTokenInstance = {
        _id: 'abc123',
        save: jest.fn().mockImplementation(function () { return Promise.resolve(this); }),
      };
  (PushToken as unknown as jest.Mock).mockImplementation(() => pushTokenInstance);

      await registerToken(mockRequest as Request, mockResponse as Response);

      expect(PushToken.findOne).toHaveBeenCalledWith({ token: 'ExpoPushToken123' });
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          tokenId: 'abc123',
        })
      );
    });

    it('updates an existing token', async () => {
      const existing: any = { _id: 'tok123', userId: 'oldUser', save: jest.fn().mockResolvedValue({}) };
  (PushToken.findOne as unknown as jest.Mock).mockResolvedValue(existing);

      mockRequest.body = { token: 'ExpoPushTokenABC', userId: 'newUser' };

      await registerToken(mockRequest as Request, mockResponse as Response);

      expect(existing.userId).toBe('newUser');
      expect(existing.isActive).toBe(true);
      expect(existing.save).toHaveBeenCalled();
    });

    it('rejects invalid token', async () => {
      mockRequest.body = { token: 'badToken' };
  (Expo as any).isExpoPushToken.mockReturnValue(false);

      await registerToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Invalid push token' })
      );
    });

    it('handles database errors', async () => {
  (PushToken.findOne as unknown as jest.Mock).mockRejectedValue(new Error('DB fail'));
      mockRequest.body = { token: 'ExpoPushToken123' };

      await registerToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Failed to register token' })
      );
    });
  });

  // -------- unregisterToken --------
  describe('unregisterToken', () => {
    it('deactivates token', async () => {
      const fakeDoc: any = { isActive: true, save: jest.fn().mockResolvedValue({}) };
  (PushToken.findOne as unknown as jest.Mock).mockResolvedValue(fakeDoc);
      mockRequest.body = { token: 'ExpoPushToken123' };

      await unregisterToken(mockRequest as Request, mockResponse as Response);

      expect(fakeDoc.isActive).toBe(false);
      expect(fakeDoc.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: 'Token deactivated successfully' })
      );
    });

    it('returns 404 if token missing', async () => {
  (PushToken.findOne as unknown as jest.Mock).mockResolvedValue(null);
      mockRequest.body = { token: 'missing' };

      await unregisterToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Token not found' })
      );
    });

    it('handles database errors', async () => {
  (PushToken.findOne as unknown as jest.Mock).mockRejectedValue(new Error('DB error'));
      mockRequest.body = { token: 'ExpoPushToken123' };

      await unregisterToken(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: false, message: 'Failed to deactivate token' })
      );
    });
  });

  // -------- sendPushNotification --------
  describe('sendPushNotification', () => {
    it('sends notifications to valid tokens', async () => {
  (PushToken.getActiveTokens as unknown as jest.Mock).mockResolvedValue([{ token: 'ExpoPushToken123' }]);

      const tickets = await sendPushNotification('Title', 'Body');

      expect(PushToken.getActiveTokens).toHaveBeenCalled();
      expect(Array.isArray(tickets)).toBe(true);
      expect(tickets[0]).toHaveProperty('status', 'ok');
    });

    it('returns [] when no tokens', async () => {
  (PushToken.getActiveTokens as unknown as jest.Mock).mockResolvedValue([]);

      const tickets = await sendPushNotification('Title', 'Body');

      expect(tickets).toEqual([]);
    });

    it('marks invalid tokens inactive', async () => {
  (PushToken.getActiveTokens as unknown as jest.Mock).mockResolvedValue([{ token: 'BadToken' }]);
      (Expo as any).isExpoPushToken.mockReturnValue(false);

      await sendPushNotification('Title', 'Body');

  expect((PushToken.updateMany as unknown as jest.Mock)).toHaveBeenCalledWith(
        { token: { $in: ['BadToken'] } },
        { isActive: false }
      );
    });

    it('throws on database error', async () => {
  (PushToken.getActiveTokens as unknown as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(sendPushNotification('Title', 'Body')).rejects.toThrow('DB error');
    });
  });
});
