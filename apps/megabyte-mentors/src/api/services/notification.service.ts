// services/notificationService.ts
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import Constants from 'expo-constants';

// Types and Interfaces
export interface NotificationData {
  type?: 'order_update' | 'message' | 'profile_update' | 'deep_link' | string;
  orderId?: string;
  route?: string;
  userId?: string;
  [key: string]: any;
}

export interface TokenRegistrationPayload {
  token: string;
  deviceId: string;
  platform: string;
  appVersion: string;
  userId?: string;
}

export interface TokenRegistrationResponse {
  success: boolean;
  message: string;
  tokenId?: string;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private token: string | null = null;
  private notificationListener: Notifications.EventSubscription | null = null;
  private responseListener: Notifications.EventSubscription | null = null;

  constructor() {
    this.token = null;
    this.notificationListener = null;
    this.responseListener = null;
  }

  async initialize(): Promise<void> {
    try {
      // Register for push notifications
      await this.registerForPushNotifications();
      
      // Set up listeners
      this.setupListeners();
      
      console.log('Notification service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  private async registerForPushNotifications(): Promise<string | undefined> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return;
    }
    
    try {
      const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error('projectId is not defined');
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      
      this.token = tokenData.data;
      console.log('Push token:', this.token);
      
      // Send token to backend
      await this.sendTokenToBackend(this.token);
      
      return this.token;
    } catch (error) {
      console.error('Error getting push token:', error);
      throw error;
    }
  }

  private setupListeners(): void {
    // Handle notifications received while app is in foreground
    this.notificationListener = Notifications.addNotificationReceivedListener(
      this.handleNotificationReceived.bind(this)
    );

    // Handle notification taps
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      this.handleNotificationResponse.bind(this)
    );
  }

  private handleNotificationReceived(notification: Notifications.Notification): void {
    console.log('Notification received:', notification);
    
    // You can add custom logic here based on notification type
    const data = notification.request.content.data as NotificationData;
    
    // Example: Show custom in-app notification
    // this.showInAppNotification(notification);
  }

  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    console.log('Notification tapped:', response);
    
    const data = response.notification.request.content.data as NotificationData;
    
    // Handle navigation based on notification data
    this.handleNotificationNavigation(data);
  }

  private handleNotificationNavigation(data: NotificationData): void {
    if (!data || !data.type) return;

    try {
      switch (data.type) {
        case 'order_update':
          if (data.orderId) {
            router.push(`/(application)/orders/${data.orderId}`);
          }
          break;
        
        case 'message':
          router.push('/(tabs)/messages');
          break;
        
        case 'profile_update':
          router.push('/(tabs)/profile');
          break;
          
        case 'deep_link':
          if (data.route) {
            router.push(data.route as any);
          }
          break;
          
        default:
          // Default behavior - go to main tabs
          router.push('/(tabs)');
          break;
      }
    } catch (error) {
      console.error('Error handling notification navigation:', error);
      // Fallback navigation
      router.push('/(tabs)');
    }
  }

  private async sendTokenToBackend(token: string, userId?: string): Promise<TokenRegistrationResponse> {
    try {
      const apiUrl = 'http://localhost:3000';
      if (!apiUrl) {
        throw new Error('API_URL is not defined');
      }
      console.log('Sending token to backend:', token, userId);
      const payload: TokenRegistrationPayload = {
        token,
        deviceId: await this.getDeviceId(),
        platform: Platform.OS,
        appVersion: '1.0.0',
        userId: userId,
        // userId: getCurrentUserId(), // Add this if you have user context
      };

      const response = await fetch(`${apiUrl}/api/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TokenRegistrationResponse = await response.json();
      console.log('Token registration result:', result);
      
      return result;
    } catch (error) {
      console.error('Error registering token:', error);
      throw error;
    }
  }

  private async getDeviceId(): Promise<string> {
    // You can use a more sophisticated device ID generation
    // For now, we'll use a combination of platform and a random string
    const deviceId = (await Device.osInternalBuildId) || 
                    `${Platform.OS}-${Math.random().toString(36).substr(2, 9)}`;
    return deviceId;
  }

  async updateUserToken(userId: string): Promise<void> {
    if (this.token && userId) {
      try {
        await this.sendTokenToBackend(this.token, userId);
      } catch (error) {
        console.error('Error updating user token:', error);
        throw error;
      }
    }
  }

  async deactivateToken(): Promise<void> {
    if (!this.token) return;
    
    try {
      const apiUrl = 'http://localhost:3000';
      if (!apiUrl) {
        throw new Error('API_URL is not defined');
      }

      const response = await fetch(`${apiUrl}/api/notifications/deactivate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: this.token }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      console.log('Token deactivated successfully');
    } catch (error) {
      console.error('Error deactivating token:', error);
      throw error;
    }
  }

  cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  // Utility method to get the current token
  getToken(): string | null {
    return this.token;
  }
}

// Export singleton instance
export default new NotificationService();