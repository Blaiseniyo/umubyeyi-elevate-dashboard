import { apiService } from './api';
import { ApiResponse, PaginatedResponse, Trimester, WeeklyContent, Symptom } from '../types';

export interface CreateTrimesterRequest {
  trimester: 1 | 2 | 3;
  trimester_name: string;
  title: string;
  description?: string;
  start_week: number;
  end_week: number;
  medical_checks?: string;
  tips_and_advice?: string;
}

export interface UpdateTrimesterRequest {
  trimester_name?: string;
  title?: string;
  description?: string;
  start_week?: number;
  end_week?: number;
  medical_checks?: string;
  tips_and_advice?: string;
}

export interface CreateWeeklyContentRequest {
  week: number;
  title: string;
  description: string;
  baby_size: string;
  baby_size_image_url: string;
  baby_size_description: string;
  baby_weight: string;
  baby_weight_image_url: string;
  baby_weight_description: string;
  baby_length: string;
  baby_height_image_url: string;
  baby_height_description: string;
  ultrasound_image_url: string;
  ultrasound_description: string;
  family_image_url?: string;
  family_description?: string;
  tips_and_advice: string;
  symptoms: Array<{
    name: string;
    description: string;
    image_url: string;
  }>;
}

export interface UpdateWeeklyContentRequest {
  week?: number;
  title?: string;
  description?: string;
  baby_size?: string;
  baby_size_image_url?: string;
  baby_size_description?: string;
  baby_weight?: string;
  baby_weight_image_url?: string;
  baby_weight_description?: string;
  baby_length?: string;
  baby_height_image_url?: string;
  baby_height_description?: string;
  ultrasound_image_url?: string;
  ultrasound_description?: string;
  family_image_url?: string;
  family_description?: string;
  tips_and_advice?: string;
  symptoms?: Array<{
    id?: number;
    name: string;
    description: string;
    image_url: string;
  }>;
}

export interface GetContentParams {
  page?: number;
  limit?: number;
  week?: number;
  trimester?: number;
  search?: string;
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

class ContentService {
  // Trimester methods
  async getTrimesters(): Promise<ApiResponse<Trimester[]>> {
    return apiService.get<ApiResponse<Trimester[]>>('/content/trimesters');
  }

  async getTrimesterById(id: string): Promise<ApiResponse<Trimester>> {
    return apiService.get<ApiResponse<Trimester>>(`/content/trimesters/${id}`);
  }

  async createTrimester(data: CreateTrimesterRequest): Promise<ApiResponse<Trimester>> {
    return apiService.post<ApiResponse<Trimester>>('/content/trimesters', data);
  }

  async updateTrimester(id: string, data: UpdateTrimesterRequest): Promise<ApiResponse<Trimester>> {
    return apiService.put<ApiResponse<Trimester>>(`/content/trimesters/${id}`, data);
  }

  async deleteTrimester(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/content/trimesters/${id}`);
  }

  // Weekly content methods
  async getWeeklyContent(params?: GetContentParams): Promise<ApiResponseWrapper<WeeklyContent[]>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/pregnancy-tracker/staff/weekly-content/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<ApiResponseWrapper<WeeklyContent[]>>(url);
  }

  async getWeeklyContentById(id: number): Promise<ApiResponseWrapper<WeeklyContent>> {
    return apiService.get<ApiResponseWrapper<WeeklyContent>>(`/pregnancy-tracker/staff/weekly-content/${id}/`);
  }

  async getWeeklyContentByWeek(weekNumber: number): Promise<ApiResponseWrapper<WeeklyContent>> {
    return apiService.get<ApiResponseWrapper<WeeklyContent>>(`/pregnancy-tracker/staff/weekly-content/?week=${weekNumber}`);
  }

  async createWeeklyContent(data: CreateWeeklyContentRequest): Promise<ApiResponseWrapper<WeeklyContent>> {
    return apiService.post<ApiResponseWrapper<WeeklyContent>>('/pregnancy-tracker/staff/weekly-content/', data);
  }

  async updateWeeklyContent(id: number, data: UpdateWeeklyContentRequest): Promise<ApiResponseWrapper<WeeklyContent>> {
    return apiService.put<ApiResponseWrapper<WeeklyContent>>(`/pregnancy-tracker/staff/weekly-content/${id}/`, data);
  }

  async deleteWeeklyContent(id: number): Promise<ApiResponseWrapper<void>> {
    return apiService.delete<ApiResponseWrapper<void>>(`/pregnancy-tracker/staff/weekly-content/${id}/`);
  }

  // Symptom methods
  async getSymptoms(weekNumber?: number): Promise<ApiResponse<Symptom[]>> {
    const url = weekNumber ? `/content/symptoms?week=${weekNumber}` : '/content/symptoms';
    return apiService.get<ApiResponse<Symptom[]>>(url);
  }

  async deleteSymptom(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/content/symptoms/${id}`);
  }
}

export const contentService = new ContentService();