import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../api';
import api from '@/lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initialize state from localStorage if token exists
const getInitialState = (): AuthState => {
  const token = api.getAuthToken();
  return {
    user: null,
    token: token,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
      // Store token in localStorage
      api.setAuthToken(action.payload.token);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear token from localStorage
      api.clearAuthToken();
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
  },
});

export const { setCredentials, clearAuth, setLoading, setError, setUser } =
  authSlice.actions;

export default authSlice.reducer;











