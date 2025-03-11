import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleApiError } from './utils';
import { ErrorResponse } from './types';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }


      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default apiClient;


// Response interceptor for handling common response cases
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ErrorResponse>) => {
    // Check if unauthorized (401) for token refresh or logout
    if (error.response?.status === 401) {
      // Option 1: Try to refresh token
      // const refreshed = await refreshToken();
      // if (refreshed) { retry original request }
      
      // Option 2: Log out user if token is invalid
      await AsyncStorage.removeItem('auth_token');
      // Notify auth context/store to update state
      // authStore.signOut();
    }
    
    return Promise.reject(handleApiError(error));
  });