import { useState, useEffect } from 'react';
import { authApi, AuthResponse } from '../api/authApi';
import api from '@/lib/api';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = api.getAuthToken();
    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await authApi.me();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      api.clearAuthToken();
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    if (response.data?.user) {
      setUser(response.data.user);
      setIsAuthenticated(true);
    }
    return response;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };
};

