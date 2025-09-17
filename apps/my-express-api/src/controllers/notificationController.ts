import { Request, Response } from "express";
import { Expo } from 'expo-server-sdk';
import PushToken from "../models/notificationTokenModel";

const expo = new Expo();

export const registerToken = async (req: Request, res: Response) => {
	try {
    const { token, userId, deviceId, platform, appVersion } = req.body;

    if (!Expo.isExpoPushToken(token)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid push token' 
      });
    }
    console.log('Registering token:', { token, userId, deviceId, platform, appVersion });
    // Check if token already exists
    const existingToken = await PushToken.findOne({ token });
    
    if (existingToken) {
      // Update existing token
      existingToken.userId = userId || existingToken.userId;
      existingToken.deviceId = deviceId || existingToken.deviceId;
      existingToken.platform = platform || existingToken.platform;
      existingToken.appVersion = appVersion || existingToken.appVersion;
      existingToken.isActive = true;
      existingToken.lastUsed = new Date();
      
      await existingToken.save();
      
      return res.json({ 
        success: true, 
        message: 'Token updated successfully',
        tokenId: existingToken._id
      });
    }

    // Create new token
    const newToken = new PushToken({
      token,
      userId,
      deviceId,
      platform,
      appVersion
    });

    await newToken.save();
    console.log('New token saved:', newToken);
    res.json({ 
      success: true, 
      message: 'Token registered successfully',
      tokenId: newToken._id
    });

  } catch (error) {
    console.error('Error registering token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register token' 
    });
  }
};

export const unregisterToken = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    const pushToken = await PushToken.findOne({ token });
    if (!pushToken) {
      return res.status(404).json({ 
        success: false, 
        message: 'Token not found' 
      });
    }

    pushToken.isActive = false;
    await pushToken.save();
    
    res.json({ 
      success: true, 
      message: 'Token deactivated successfully' 
    });

  } catch (error) {
    console.error('Error deactivating token:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to deactivate token' 
    });
  }
}

export async function sendPushNotification(title, body, data = {}, targetUserId = null) {
  try {
    // Get active tokens from database
    console.log('Sending notification to user:', targetUserId);
    const tokenDocs = await PushToken.getActiveTokens(targetUserId);
    const pushTokens = tokenDocs.map(doc => doc.token);

    if (pushTokens.length === 0) {
      console.log('No active push tokens found');
      return [];
    }

    // Create messages array
    const messages = [];
    const invalidTokens = [];
    
    for (const pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not valid`);
        invalidTokens.push(pushToken);
        continue;
      }

      messages.push({
        to: pushToken,
        sound: 'default',
        title: title,
        body: body,
        data: data,
      });
    }

    // Mark invalid tokens as inactive
    if (invalidTokens.length > 0) {
      await PushToken.updateMany(
        { token: { $in: invalidTokens } },
        { isActive: false }
      );
    }

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending push notification chunk:', error);
      }
    }

    // Update lastUsed for successfully sent tokens
    const successfulTokens = pushTokens.filter((_, index) => 
      tickets[index] && tickets[index].status === 'ok'
    );
    
    if (successfulTokens.length > 0) {
      await PushToken.updateMany(
        { token: { $in: successfulTokens } },
        { lastUsed: new Date() }
      );
    }

    return tickets;

  } catch (error) {
    console.error('Error in sendPushNotification:', error);
    throw error;
  }
}