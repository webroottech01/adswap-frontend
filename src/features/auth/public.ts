import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store';
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  restoreSessionThunk,
} from './redux/authThunks';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectAuthError,
} from './redux/selectors';
import type { LoginCredentials, RegisterData, User } from './api';

/**
 * Public API for auth module.
 * 
 * This is the ONLY file that other modules should import from.
 * It hides all Redux internals and provides a clean contract.
 */

/**
 * Hook to access current auth session state
 */
export function useAuthSession() {
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
  };
}

/**
 * Login function - authenticates user with credentials
 */
export function useLogin() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const result = await dispatch(loginThunk(credentials));
      return {
        success: loginThunk.fulfilled.match(result),
        error: loginThunk.rejected.match(result) ? result.payload : null,
      };
    },
    [dispatch]
  );

  return {
    login,
    isLoading,
    error,
  };
}

/**
 * Register function - creates new user account
 */
export function useRegister() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectAuthError);

  const register = useCallback(
    async (data: RegisterData) => {
      const result = await dispatch(registerThunk(data));
      return {
        success: registerThunk.fulfilled.match(result),
        error: registerThunk.rejected.match(result) ? result.payload : null,
      };
    },
    [dispatch]
  );

  return {
    register,
    isLoading,
    error,
  };
}

/**
 * Logout function - invalidates session and clears auth state
 */
export function useLogout() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const logout = useCallback(async () => {
    await dispatch(logoutThunk());
  }, [dispatch]);

  return {
    logout,
    isLoading,
  };
}

/**
 * Restore session function - validates existing token and restores user
 */
export function useRestoreSession() {
  const dispatch = useAppDispatch();

  const restoreSession = useCallback(async () => {
    await dispatch(restoreSessionThunk());
  }, [dispatch]);

  return {
    restoreSession,
  };
}

// Export types for use in other modules
export type { User, LoginCredentials, RegisterData };











