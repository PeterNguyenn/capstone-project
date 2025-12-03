import { AxiosError } from 'axios';
import { ErrorResponse } from '../types';

export class ApiError extends Error {
  status: number;
  code?: string;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, code?: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export const handleApiError = (error: AxiosError<ErrorResponse>): ApiError => {
  const status = error.response?.status || 500;
  const message = error.response?.data?.message || 'An unexpected error occurred';
  const code = error.response?.data?.code;
  const errors = error.response?.data?.errors;

  // Log error in development
  if (__DEV__) {
    // console.error('[API Error]', { status, message, code, errors });
  }

  return new ApiError(message, status, code, errors);
};