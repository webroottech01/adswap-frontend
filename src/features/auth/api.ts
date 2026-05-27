import api from '@/lib/api';

// Types matching backend DTOs
export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

/**
 * Feature-level API wrapper for auth endpoints.
 * This abstraction allows easy migration to microservices later.
 */
export const authApi = {
  /**
   * Login user and receive JWT token
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new user and receive JWT token
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    return response.data;
  },

  /**
   * Logout user and invalidate token
   */
  async logout(): Promise<void> {
    await api.post('/api/v1/auth/logout');
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/v1/auth/me');
    return response.data;
  },
};











