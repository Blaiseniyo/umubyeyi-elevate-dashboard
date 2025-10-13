import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    Topic,
    Subtopic,
    Section,
    CreateTopicRequest,
    UpdateTopicRequest
} from '../../types/healthHub';
import { healthHubService } from '../../services/healthHubService';

interface HealthHubState {
    topics: Topic[];
    currentTopic: Topic | null;
    currentSubtopic: Subtopic | null;
    currentSection: Section | null;
    loading: boolean;
    error: string | null;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}

const initialState: HealthHubState = {
    topics: [],
    currentTopic: null,
    currentSubtopic: null,
    currentSection: null,
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 10
};

// Async thunks
export const fetchTopics = createAsyncThunk(
    'healthHub/fetchTopics',
    async (params: { page?: number; limit?: number; search?: string }, { rejectWithValue }) => {
        try {
            const response = await healthHubService.getTopics(params);
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const fetchTopicById = createAsyncThunk(
    'healthHub/fetchTopicById',
    async (topicId: number, { rejectWithValue }) => {
        try {
            const response = await healthHubService.getTopicById(topicId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const fetchSubtopicById = createAsyncThunk(
    'healthHub/fetchSubtopicById',
    async (subtopicId: number, { rejectWithValue }) => {
        try {
            const response = await healthHubService.getSubtopicById(subtopicId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const createTopic = createAsyncThunk(
    'healthHub/createTopic',
    async (data: CreateTopicRequest, { rejectWithValue }) => {
        try {
            const response = await healthHubService.createTopic(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const updateTopic = createAsyncThunk(
    'healthHub/updateTopic',
    async ({ id, data }: { id: number; data: UpdateTopicRequest }, { rejectWithValue }) => {
        try {
            const response = await healthHubService.updateTopic(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const deleteTopic = createAsyncThunk(
    'healthHub/deleteTopic',
    async (topicId: number, { rejectWithValue }) => {
        try {
            await healthHubService.deleteTopic(topicId);
            return topicId;
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

const healthHubSlice = createSlice({
    name: 'healthHub',
    initialState,
    reducers: {
        clearCurrentTopic: (state) => {
            state.currentTopic = null;
        },
        clearCurrentSubtopic: (state) => {
            state.currentSubtopic = null;
        },
        clearCurrentSection: (state) => {
            state.currentSection = null;
        },
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action: PayloadAction<number>) => {
            state.itemsPerPage = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Topics
            .addCase(fetchTopics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopics.fulfilled, (state, action) => {
                state.loading = false;
                state.topics = action.payload.data;
                state.totalItems = action.payload.total;
            })
            .addCase(fetchTopics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Topic By Id
            .addCase(fetchTopicById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopicById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTopic = action.payload;
            })
            .addCase(fetchTopicById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Subtopic By Id
            .addCase(fetchSubtopicById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubtopicById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubtopic = action.payload;
            })
            .addCase(fetchSubtopicById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Create Topic
            .addCase(createTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.topics.push(action.payload);
            })
            .addCase(createTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Topic
            .addCase(updateTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateTopic.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.topics.findIndex(topic => topic.id === action.payload.id);
                if (index !== -1) {
                    state.topics[index] = action.payload;
                }
                if (state.currentTopic && state.currentTopic.id === action.payload.id) {
                    state.currentTopic = action.payload;
                }
            })
            .addCase(updateTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Delete Topic
            .addCase(deleteTopic.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteTopic.fulfilled, (state, action) => {
                state.loading = false;
                state.topics = state.topics.filter(topic => topic.id !== action.payload);
                if (state.currentTopic && state.currentTopic.id === action.payload) {
                    state.currentTopic = null;
                }
            })
            .addCase(deleteTopic.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const {
    clearCurrentTopic,
    clearCurrentSubtopic,
    clearCurrentSection,
    setCurrentPage,
    setItemsPerPage
} = healthHubSlice.actions;

export default healthHubSlice.reducer;