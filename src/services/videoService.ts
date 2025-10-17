// In a real implementation, we would import and use apiService
// import { apiService } from './api';

export interface ChunkUploadRequest {
    chunk: Blob;
    chunk_index: number;
    total_chunks: number;
    file_name: string;
    file_path: string;
    file_id?: string;
}

export interface ChunkUploadResponse {
    success: boolean;
    chunk_index: number;
    total_chunks: number;
    file_id: string;
}

export interface CompleteUploadRequest {
    file_id: string;
    file_path: string;
    file_name: string;
}

export interface CompleteUploadResponse {
    success: boolean;
    file_url: string;
    s3_key: string;
    file_name: string;
    signed_file_url: string;
}

export interface DeleteFileRequest {
    file_url: string;
}

export interface ApiResponseWrapper<T> {
    success: boolean;
    message: string;
    status_code: number;
    data: T;
}

class VideoService {
    async uploadChunk(data: ChunkUploadRequest, _signal?: AbortSignal): Promise<ApiResponseWrapper<ChunkUploadResponse>> {
        const formData = new FormData();
        formData.append('chunk', data.chunk);
        formData.append('chunk_index', data.chunk_index.toString());
        formData.append('total_chunks', data.total_chunks.toString());
        formData.append('file_name', data.file_name);
        formData.append('file_path', data.file_path);

        if (data.file_id) {
            formData.append('file_id', data.file_id);
        }

        // For now, we'll simulate the API call and return a mock response
        // In a real implementation, this would be:
        // return apiService.post<ApiResponseWrapper<ChunkUploadResponse>>('/upload/chunk/', formData, {
        //   headers: {
        //     'Content-Type': 'multipart/form-data',
        //   },
        //   signal,
        // });

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock response
        return new Promise(resolve => {
            resolve({
                success: true,
                message: 'Chunk uploaded successfully',
                status_code: 200,
                data: {
                    success: true,
                    chunk_index: data.chunk_index,
                    total_chunks: data.total_chunks,
                    file_id: data.file_id || `mock_file_id_${Date.now()}`
                }
            });
        });
    }

    async completeUpload(data: CompleteUploadRequest): Promise<ApiResponseWrapper<CompleteUploadResponse>> {
        // For now, we'll simulate the API call and return a mock response
        // In a real implementation, this would be:
        // return apiService.post<ApiResponseWrapper<CompleteUploadResponse>>('/upload/complete/', data);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate a mock file URL
        const fileName = data.file_name.replace(/\s+/g, '_').toLowerCase();
        const fileUrl = `https://example-bucket.s3.amazonaws.com/${data.file_path}/${fileName}`;

        // Mock response
        return {
            success: true,
            message: 'Upload completed successfully',
            status_code: 200,
            data: {
                success: true,
                file_url: fileUrl,
                s3_key: `${data.file_path}/${fileName}`,
                file_name: fileName,
                signed_file_url: fileUrl
            }
        };
    }

    async deleteFile(_data: DeleteFileRequest): Promise<ApiResponseWrapper<void>> {
        // For now, we'll simulate the API call and return a mock response
        // In a real implementation, this would be:
        // return apiService.post<ApiResponseWrapper<void>>('/delete_upload/', data);

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Mock response
        return {
            success: true,
            message: 'File deleted successfully',
            status_code: 200,
            data: undefined
        };
    }
}

export const videoService = new VideoService();