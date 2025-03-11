import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../axios-config';
import { ApiResponse } from '../types';

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponseData {
  token: string;
  user: AuthUser;
}

export interface ProfileResponseData {
  user: AuthUser;
}


const authService = {
  signIn: async (credentials: SignInCredentials): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/api/auth/signin', 
      credentials
    );
    return response.data;
  },

  signUp: async (userData: SignUpData): Promise<ApiResponse<AuthResponseData>> => {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>(
      '/api/auth/signup', 
      userData
    );
    return response.data;
  },

  signOut: async (): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>(
      '/api/auth/logout', 
    );
    await AsyncStorage.removeItem('auth_token');
    return response.data;
  },
  

  getProfile: async (): Promise<ApiResponse<ProfileResponseData>> => {
    const response = await apiClient.get<ApiResponse<ProfileResponseData>>(
      '/api/auth/me'
    );
    return response.data;
  },
};

export default authService;