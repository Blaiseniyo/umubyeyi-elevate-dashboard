import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { contentService } from '../../services/contentService';
import { WeeklyContent, Trimester } from '../../types';
import toastService from '../../services/toastService';
import type { 
  GetContentParams, 
  CreateWeeklyContentRequest, 
  UpdateWeeklyContentRequest,
  CreateTrimesterRequest,
  UpdateTrimesterRequest
} from '../../services/contentService';

interface ContentState {
  weeklyContent: WeeklyContent[];
  trimesters: Trimester[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  filters: {
    page?: number;
    limit?: number;
    week?: number;
    trimester?: number;
    search?: string;
  };
}

const initialState: ContentState = {
  weeklyContent: [],
  trimesters: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  filters: {
    page: 1,
    limit: 10,
  },
};

// Weekly content async actions
export const getWeeklyContentAsync = createAsyncThunk(
  'content/getWeeklyContent',
  async (params: GetContentParams | undefined, { rejectWithValue }) => {
    try {
      const response = await contentService.getWeeklyContent(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly content');
    }
  }
);

export const getWeeklyContentByIdAsync = createAsyncThunk(
  'content/getWeeklyContentById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await contentService.getWeeklyContentById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly content details');
    }
  }
);

export const createWeeklyContentAsync = createAsyncThunk(
  'content/createWeeklyContent',
  async (data: CreateWeeklyContentRequest, { rejectWithValue }) => {
    try {
      const response = await contentService.createWeeklyContent(data);
      toastService.success('Weekly content created successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create weekly content');
    }
  }
);

export const updateWeeklyContentAsync = createAsyncThunk(
  'content/updateWeeklyContent',
  async ({ id, data }: { id: number; data: UpdateWeeklyContentRequest }, { rejectWithValue }) => {
    try {
      const response = await contentService.updateWeeklyContent(id, data);
      toastService.success('Weekly content updated successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update weekly content');
    }
  }
);

export const deleteWeeklyContentAsync = createAsyncThunk(
  'content/deleteWeeklyContent',
  async (id: number, { rejectWithValue }) => {
    try {
      await contentService.deleteWeeklyContent(id);
      toastService.success('Weekly content deleted successfully');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete weekly content');
    }
  }
);

// Trimester async actions
export const getTrimestersAsync = createAsyncThunk(
  'content/getTrimesters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contentService.getTrimesters();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch trimesters');
    }
  }
);

export const createTrimesterAsync = createAsyncThunk(
  'content/createTrimester',
  async (data: CreateTrimesterRequest, { rejectWithValue }) => {
    try {
      const response = await contentService.createTrimester(data);
      toastService.success('Trimester created successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create trimester');
    }
  }
);

export const updateTrimesterAsync = createAsyncThunk(
  'content/updateTrimester',
  async ({ id, data }: { id: string; data: UpdateTrimesterRequest }, { rejectWithValue }) => {
    try {
      const response = await contentService.updateTrimester(id, data);
      toastService.success('Trimester updated successfully');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update trimester');
    }
  }
);

export const deleteTrimesterAsync = createAsyncThunk(
  'content/deleteTrimester',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentService.deleteTrimester(id);
      toastService.success('Trimester deleted successfully');
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete trimester');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ContentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get weekly content list
    builder
      .addCase(getWeeklyContentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeeklyContentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyContent = Array.isArray(action.payload) ? action.payload : [];
        state.total = action.payload.length || 0;
      })
      .addCase(getWeeklyContentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Get weekly content by ID
    builder
      .addCase(getWeeklyContentByIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWeeklyContentByIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Cache the content item to avoid unnecessary API calls
        const existingIndex = state.weeklyContent.findIndex(content => content.id === action.payload.id);
        if (existingIndex !== -1) {
          state.weeklyContent[existingIndex] = action.payload;
        } else if (!state.weeklyContent.some(content => content.id === action.payload.id)) {
          state.weeklyContent.push(action.payload);
        }
      })
      .addCase(getWeeklyContentByIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create weekly content
    builder
      .addCase(createWeeklyContentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWeeklyContentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyContent.push(action.payload);
      })
      .addCase(createWeeklyContentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update weekly content
    builder
      .addCase(updateWeeklyContentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWeeklyContentAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.weeklyContent.findIndex(content => content.id === action.payload.id);
        if (index !== -1) {
          state.weeklyContent[index] = action.payload;
        }
      })
      .addCase(updateWeeklyContentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete weekly content
    builder
      .addCase(deleteWeeklyContentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWeeklyContentAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.weeklyContent = state.weeklyContent.filter(content => content.id !== action.payload);
      })
      .addCase(deleteWeeklyContentAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Trimester actions
    builder
      .addCase(getTrimestersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTrimestersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trimesters = action.payload;
      })
      .addCase(getTrimestersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createTrimesterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrimesterAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trimesters.push(action.payload);
      })
      .addCase(createTrimesterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(updateTrimesterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrimesterAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trimesters.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.trimesters[index] = action.payload;
        }
      })
      .addCase(updateTrimesterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteTrimesterAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrimesterAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.trimesters = state.trimesters.filter(t => t.id.toString() !== action.payload);
      })
      .addCase(deleteTrimesterAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearError } = contentSlice.actions;
export default contentSlice.reducer;