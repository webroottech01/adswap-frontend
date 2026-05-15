import api from '@/lib/api';

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

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<AuthResponse>('/v1/auth/login', credentials);
    if (response.data?.token) {
      api.setAuthToken(response.data.token);
    }
    return response;
  },

  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/v1/auth/register', data);
    if (response.data?.token) {
      api.setAuthToken(response.data.token);
    }
    return response;
  },

  logout: async () => {
    try {
      await api.post('/v1/auth/logout');
    } finally {
      api.clearAuthToken();
    }
  },

  me: async () => {
    return api.get<AuthResponse['user']>('/v1/auth/me');
  },
};

