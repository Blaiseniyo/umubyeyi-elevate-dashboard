import { apiService } from './api';
import { ApiResponseWrapper, Trimester, WeeklyContent, Symptom } from '../types';

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

class ContentService {
  // Trimester methods
  async getTrimesters(): Promise<ApiResponseWrapper<Trimester[]>> {
    return apiService.get<ApiResponseWrapper<Trimester[]>>('/pregnancy-tracker/staff/trimester-content/');
  }

  async getTrimesterById(id: string): Promise<ApiResponseWrapper<Trimester>> {
    return apiService.get<ApiResponseWrapper<Trimester>>(`/pregnancy-tracker/staff/trimester-content/${id}/`);
  }

  async createTrimester(data: CreateTrimesterRequest): Promise<ApiResponseWrapper<Trimester>> {
    return apiService.post<ApiResponseWrapper<Trimester>>('/pregnancy-tracker/staff/trimester-content/', data);
  }

  async updateTrimester(id: string, data: UpdateTrimesterRequest): Promise<ApiResponseWrapper<Trimester>> {
    return apiService.put<ApiResponseWrapper<Trimester>>(`/pregnancy-tracker/staff/trimester-content/${id}/`, data);
  }

  async deleteTrimester(id: string): Promise<ApiResponseWrapper<void>> {
    return apiService.delete<ApiResponseWrapper<void>>(`/pregnancy-tracker/staff/trimester-content/${id}/`);
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
  async getSymptoms(weekNumber?: number): Promise<ApiResponseWrapper<Symptom[]>> {
    const url = weekNumber 
      ? `/pregnancy-tracker/staff/symptoms/?week=${weekNumber}` 
      : '/pregnancy-tracker/staff/symptoms/';
    return apiService.get<ApiResponseWrapper<Symptom[]>>(url);
  }

  async deleteSymptom(id: string): Promise<ApiResponseWrapper<void>> {
    return apiService.delete<ApiResponseWrapper<void>>(`/pregnancy-tracker/staff/symptoms/${id}/`);
  }
}

export const contentService = new ContentService();