import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../types';
import { userService, GetUsersParams, UpdateUserRequest } from '../../services/userService';
import toastService from '../../services/toastService';

interface UserState {
  users: User[];
  currentUser: User | null;
  total: number;
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  filters: GetUsersParams;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  total: 0,
  page: 1,
  totalPages: 0,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
};

// Async thunks
export const getUsersAsync = createAsyncThunk(
  'users/getUsers',
  async (params: GetUsersParams = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getUsers(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const getUserByIdAsync = createAsyncThunk(
  'users/getUserById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.getUserById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }: { id: string; data: UpdateUserRequest }, { rejectWithValue }) => {
    try {
      const response = await userService.updateUser(id, data);
      toastService.success('User updated successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

export const deleteUserAsync = createAsyncThunk(
  'users/deleteUser',
  async (id: string, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      toastService.success('User deleted successfully');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

export const promoteToStaffAsync = createAsyncThunk(
  'users/promoteToStaff',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.promoteToStaff(id);
      toastService.success('User promoted to staff successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to promote user');
    }
  }
);

export const demoteFromStaffAsync = createAsyncThunk(
  'users/demoteFromStaff',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await userService.demoteFromStaff(id);
      toastService.success('User demoted from staff successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to demote user');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get user by ID
      .addCase(getUserByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getUserByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update user
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.currentUser?.id === action.payload.id) {
          state.currentUser = action.payload;
        }
      })
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete user
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== Number(action.payload));
      })
      .addCase(deleteUserAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Promote to staff
      .addCase(promoteToStaffAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(promoteToStaffAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Demote from staff
      .addCase(demoteFromStaffAsync.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(demoteFromStaffAsync.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;