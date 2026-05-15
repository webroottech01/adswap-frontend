import { createAsyncThunk } from '@reduxjs/toolkit';
import { AppDispatch, RootState } from '@/lib/store';
import { authApi, LoginCredentials, RegisterData } from '../api';
import { setCredentials, clearAuth, setLoading, setError, setUser } from './authSlice';
import { ApiError } from '@/lib/api';
import api from '@/lib/api';

/**
 * Extract error message from API error response
 */
const extractErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: ApiError } };
    const apiError = axiosError.response?.data;
    
    if (apiError) {
      // Handle validation errors
      if (apiError.errors) {
        const firstError = Object.values(apiError.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0];
        }
      }
      // Handle general error message
      if (apiError.message) {
        return apiError.message;
      }
    }
  }
  
  return 'An unexpected error occurred';
};

/**
 * Login thunk - authenticates user and stores credentials
 */
export const loginThunk = createAsyncThunk<
  void,
  LoginCredentials,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authApi.login(credentials);
      
      dispatch(setCredentials({
        user: response.user,
        token: response.token,
      }));

      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Register thunk - creates new user and stores credentials
 */
export const registerThunk = createAsyncThunk<
  void,
  RegisterData,
  { dispatch: AppDispatch; rejectValue: string }
>(
  'auth/register',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authApi.register(data);
      
      dispatch(setCredentials({
        user: response.user,
        token: response.token,
      }));

      dispatch(setLoading(false));
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      dispatch(setError(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Logout thunk - invalidates token and clears auth state
 */
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      dispatch(setLoading(true));
      await authApi.logout();
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      dispatch(clearAuth());
      dispatch(setLoading(false));
    }
  }
);

/**
 * Restore session thunk - validates existing token and restores user
 */
export const restoreSessionThunk = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch; state: RootState }
>(
  'auth/restoreSession',
  async (_, { dispatch, getState }) => {
    const state = getState();
    const token = state.auth.token || api.getAuthToken();

    if (!token) {
      return;
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const user = await authApi.getCurrentUser();
      
      dispatch(setUser(user));
      dispatch(setLoading(false));
    } catch (error) {
      // Token is invalid, clear auth state
      dispatch(clearAuth());
      dispatch(setLoading(false));
    }
  }
);

