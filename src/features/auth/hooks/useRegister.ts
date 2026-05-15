import { useState } from 'react';
import { authApi, RegisterData } from '../api/authApi';
import { ApiError } from '@/lib/api';

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.register(data);
      return { success: true, data: response.data };
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const errorMessage = apiError?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    register,
    loading,
    error,
  };
};

