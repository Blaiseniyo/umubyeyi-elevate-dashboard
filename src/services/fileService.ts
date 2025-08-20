import { apiService } from './api';

export interface UploadFileRequest {
  file: File;
  file_path: string;
  file_name: string;
}

export interface UploadFileResponse {
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

class FileService {
  async uploadFile(data: UploadFileRequest): Promise<ApiResponseWrapper<UploadFileResponse>> {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('file_path', data.file_path);
    formData.append('file_name', data.file_name);

    return apiService.post<ApiResponseWrapper<UploadFileResponse>>('/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async deleteFile(data: DeleteFileRequest): Promise<ApiResponseWrapper<void>> {
    return apiService.post<ApiResponseWrapper<void>>('/delete_upload/', data);
  }
}

export const fileService = new FileService();
