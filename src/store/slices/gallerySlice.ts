import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GalleryImage, GalleryFilters } from '../../types/gallery';
import { galleryService } from '../../services/galleryService';

interface GalleryState {
    images: GalleryImage[];
    currentImage: GalleryImage | null;
    loading: boolean;
    error: string | null;
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}

const initialState: GalleryState = {
    images: [],
    currentImage: null,
    loading: false,
    error: null,
    totalItems: 0,
    currentPage: 1,
    itemsPerPage: 12 // Show 12 images per page for a good grid layout
};

// Async thunks
export const fetchGalleryImages = createAsyncThunk(
    'gallery/fetchImages',
    async (params: GalleryFilters, { rejectWithValue }) => {
        try {
            const response = await galleryService.getImages(params);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch gallery images');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const fetchGalleryImageById = createAsyncThunk(
    'gallery/fetchImageById',
    async (imageId: number, { rejectWithValue }) => {
        try {
            const response = await galleryService.getImageById(imageId);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch gallery image');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const createGalleryImage = createAsyncThunk(
    'gallery/createImage',
    async (data: { image_url: string }, { rejectWithValue }) => {
        try {
            const response = await galleryService.createImage(data);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to create gallery image');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const updateGalleryImage = createAsyncThunk(
    'gallery/updateImage',
    async ({ id, data }: { id: number; data: { is_published?: boolean } }, { rejectWithValue }) => {
        try {
            const response = await galleryService.updateImage(id, data);
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to update gallery image');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

export const deleteGalleryImage = createAsyncThunk(
    'gallery/deleteImage',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await galleryService.deleteImage(id);
            if (response.success) {
                return id; // Return the ID for removing from state
            } else {
                return rejectWithValue(response.message || 'Failed to delete gallery image');
            }
        } catch (error) {
            return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
        }
    }
);

const gallerySlice = createSlice({
    name: 'gallery',
    initialState,
    reducers: {
        setCurrentPage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload;
        },
        clearCurrentImage: (state) => {
            state.currentImage = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchGalleryImages
            .addCase(fetchGalleryImages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGalleryImages.fulfilled, (state, action) => {
                state.loading = false;
                state.images = action.payload.data;
                state.totalItems = action.payload.total;
                state.currentPage = action.payload.page;
                state.itemsPerPage = action.payload.limit;
            })
            .addCase(fetchGalleryImages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle fetchGalleryImageById
            .addCase(fetchGalleryImageById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGalleryImageById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentImage = action.payload;
            })
            .addCase(fetchGalleryImageById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle createGalleryImage
            .addCase(createGalleryImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGalleryImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images = [action.payload, ...state.images];
            })
            .addCase(createGalleryImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle updateGalleryImage
            .addCase(updateGalleryImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGalleryImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images = state.images.map(image =>
                    image.id === action.payload.id ? action.payload : image
                );
                state.currentImage = action.payload;
            })
            .addCase(updateGalleryImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Handle deleteGalleryImage
            .addCase(deleteGalleryImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteGalleryImage.fulfilled, (state, action) => {
                state.loading = false;
                state.images = state.images.filter(image => image.id !== action.payload);
                if (state.currentImage && state.currentImage.id === action.payload) {
                    state.currentImage = null;
                }
            })
            .addCase(deleteGalleryImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setCurrentPage, clearCurrentImage } = gallerySlice.actions;
export default gallerySlice.reducer;