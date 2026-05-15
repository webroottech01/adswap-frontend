import { useState } from 'react';
import { profileApi, UpdateProfileData, ChangeEmailData, ChangePasswordData, Profile } from './api';
import { ApiError } from '@/lib/api';

/**
 * Hook for updating user profile (name)
 */
export const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateProfile = async (data: UpdateProfileData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const profile = await profileApi.updateProfile(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true, data: profile };
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      const errorMessage = apiError?.message || apiError?.errors?.name?.[0] || 'Failed to update profile. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error,
    success,
  };
};

/**
 * Hook for changing user email
 */
export const useChangeEmail = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changeEmail = async (data: ChangeEmailData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const profile = await profileApi.changeEmail(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true, data: profile };
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      
      // Handle different error types
      if (apiError?.status === 409) {
        // Email already taken
        const errorMessage = apiError?.message || 'Email address is already taken.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } else if (apiError?.status === 401) {
        // Invalid password
        const errorMessage = apiError?.message || 'Invalid password provided.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } else if (apiError?.errors) {
        // Validation errors
        const firstError = Object.values(apiError.errors)[0]?.[0] || 'Validation failed.';
        setError(firstError);
        return { success: false, error: firstError };
      } else {
        const errorMessage = apiError?.message || 'Failed to change email. Please try again.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    changeEmail,
    loading,
    error,
    success,
  };
};

/**
 * Hook for changing user password
 */
export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (data: ChangePasswordData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await profileApi.changePassword(data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      return { success: true };
    } catch (err: any) {
      const apiError = err.response?.data as ApiError;
      
      // Handle different error types
      if (apiError?.status === 401) {
        // Invalid password
        const errorMessage = apiError?.message || 'Invalid password provided.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } else if (apiError?.status === 422 && apiError?.error === 'same_password') {
        // New password is same as current password
        const errorMessage = apiError?.message || 'The new password must be different from your current password.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } else if (apiError?.errors) {
        // Validation errors
        const firstError = Object.values(apiError.errors)[0]?.[0] || 'Validation failed.';
        setError(firstError);
        return { success: false, error: firstError };
      } else {
        const errorMessage = apiError?.message || 'Failed to change password. Please try again.';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    loading,
    error,
    success,
  };
};

