import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as api from '../../services/api';

const AUTH_STORAGE_KEY = 'user';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const storedUser = getStoredUser();

const initialState = {
  isAuthenticated: Boolean(storedUser),
  user: storedUser,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const accounts = await api.getUsers();

      const user = accounts.find(
        (account) =>
          (account.username === usernameOrEmail || account.email === usernameOrEmail) &&
          account.password === password
      );

      if (!user) {
        return rejectWithValue('Invalid username/email or password!');
      }

      if (user.status !== 'active') {
        return rejectWithValue('Tài khoản bị khóa, bạn không có quyền truy cập.');
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed due to a network error.');
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload || 'Login failed due to a network error.';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export const selectAuthState = (state) => state.auth;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;

