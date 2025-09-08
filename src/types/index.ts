// Types globaux de l'application

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  theme: Theme;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}
