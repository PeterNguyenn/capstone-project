// contexts/NotificationContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import notificationService, { NotificationData } from '../api/services/notification.service';

// Types and Interfaces
interface NotificationContextType {
  isInitialized: boolean;
  pushToken: string | null;
  lastNotification: Notifications.Notification | null;
  updateUserToken: (userId: string) => Promise<void>;
  deactivateToken: () => Promise<void>;
  reinitialize: () => Promise<void>;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    initializeNotifications();
    
    return () => {
      notificationService.cleanup();
    };
  }, []);

  const initializeNotifications = async (): Promise<void> => {
    try {
      await notificationService.initialize();
      const token = notificationService.getToken();
      setPushToken(token);
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      setIsInitialized(false);
      throw error;
    }
  };

  const updateUserToken = async (userId: string): Promise<void> => {
    try {
      await notificationService.updateUserToken(userId);
    } catch (error) {
      console.error('Error updating user token:', error);
      throw error;
    }
  };

  const deactivateToken = async (): Promise<void> => {
    try {
      await notificationService.deactivateToken();
      setPushToken(null);
    } catch (error) {
      console.error('Error deactivating token:', error);
      throw error;
    }
  };

  const value: NotificationContextType = {
    isInitialized,
    pushToken,
    lastNotification,
    updateUserToken,
    deactivateToken,
    reinitialize: initializeNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};