import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit';
import * as api from '../../services/api';

const initialState = {
  list: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const users = await api.getUsers();
      return users;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load users');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    toggleAdminStatus(state, action) {
      const user = state.list.find((u) => u.id === action.payload);
      if (user) {
        user.role = user.role === 'admin' ? 'student' : 'admin';
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to load users';
      });
  },
});

export const { toggleAdminStatus } = usersSlice.actions;

export const selectUsersState = (state) => state.users;
export const selectUsers = (state) => state.users.list;
export const selectUsersLoading = (state) => state.users.isLoading;
export const selectUsersError = (state) => state.users.error;

export const makeSelectUsersByRoleAndStatus = () =>
  createSelector(
    [selectUsers, (_, filters) => filters],
    (users, filters) => {
      let filtered = [...users];
      if (filters?.searchTerm) {
        const lower = filters.searchTerm.toLowerCase();
        filtered = filtered.filter(
          (user) =>
            user.username?.toLowerCase().includes(lower) ||
            user.fullName?.toLowerCase().includes(lower)
        );
      }
      if (filters?.roleFilter && filters.roleFilter !== 'all') {
        filtered = filtered.filter((user) => user.role === filters.roleFilter);
      }
      if (filters?.statusFilter && filters.statusFilter !== 'all') {
        filtered = filtered.filter((user) => user.status === filters.statusFilter);
      }
      switch (filters?.sortBy) {
        case 'username':
          return filtered.sort((a, b) => a.username.localeCompare(b.username));
        case 'fullName':
          return filtered.sort((a, b) => a.fullName.localeCompare(b.fullName));
        case 'id':
        default:
          return filtered.sort((a, b) => Number(a.id) - Number(b.id));
      }
    }
  );

export default usersSlice.reducer;

