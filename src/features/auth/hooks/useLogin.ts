import { useState } from 'react';
import { authApi, LoginCredentials } from '../api/authApi';
import { ApiError } from '@/lib/api';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.login(credentials);
      return { success: true, data: response.data };
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const errorMessage = apiError?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error,
  };
};

