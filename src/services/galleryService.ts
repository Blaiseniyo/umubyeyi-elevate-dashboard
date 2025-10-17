import { apiService } from './api';
import {
    GalleryImage,
    CreateGalleryImageRequest,
    UpdateGalleryImageRequest,
    GalleryFilters
} from '../types/gallery';
import { ApiResponseWrapper, ApiResponse, PaginatedResponse, ApiListResponse } from '../types';

class GalleryService {
    async getImages(params?: GalleryFilters): Promise<ApiResponseWrapper<PaginatedResponse<GalleryImage>>> {
        try {
            // Build URL with query parameters
            let url = '/umubyeyi-gallery/admin-gallery/';
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());

            const queryString = queryParams.toString();
            if (queryString) url += `?${queryString}`;

            const response = await apiService.get<ApiListResponse<GalleryImage>>(url);

            return {
                success: true,
                message: response.message,
                status_code: response.status_code,
                data: {
                    data: response.data,
                    total: response.count,
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    totalPages: Math.ceil(response.count / (params?.limit || 10))
                }
            };
        } catch (error) {
            console.error('Error fetching gallery images:', error);
            throw error;
        }
    }

    async createImage(data: CreateGalleryImageRequest): Promise<ApiResponseWrapper<GalleryImage>> {
        try {
            const url = '/umubyeyi-gallery/admin-gallery/';
            const response = await apiService.post<ApiResponse<GalleryImage>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating gallery image:', error);
            throw error;
        }
    }

    async updateImage(id: number, data: UpdateGalleryImageRequest): Promise<ApiResponseWrapper<GalleryImage>> {
        try {
            const url = `/umubyeyi-gallery/images/${id}/`;
            const response = await apiService.put<ApiResponse<GalleryImage>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating gallery image:', error);
            throw error;
        }
    }

    async getImageById(id: number): Promise<ApiResponseWrapper<GalleryImage>> {
        try {
            const url = `/umubyeyi-gallery/images/${id}/`;
            const response = await apiService.get<ApiResponse<GalleryImage>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching gallery image by ID:', error);
            throw error;
        }
    }

    async deleteImage(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/umubyeyi-gallery/images/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting gallery image:', error);
            throw error;
        }
    }
}

export const galleryService = new GalleryService();