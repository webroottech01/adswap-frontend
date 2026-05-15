import { RootState } from '@/lib/store';

/**
 * Selectors for auth state.
 * These provide typed access to auth state throughout the app.
 */

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectIsLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectUserRoles = (state: RootState) => state.auth.user?.roles || [];

export const selectToken = (state: RootState) => state.auth.token;











