export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  page?: number;
  message?: string;
  success: boolean;
}

export interface ErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}