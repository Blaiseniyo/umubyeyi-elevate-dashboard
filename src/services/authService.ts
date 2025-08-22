import { apiService } from './api';
import { ApiResponse, User } from '../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  tokens: {
    access: string;
    refresh: string;
  };
}

export interface ApiResponseWrapper<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<ApiResponseWrapper<LoginResponse>> {
    return apiService.post<ApiResponseWrapper<LoginResponse>>('/auth/staff/signin/', credentials);
  }

  async refreshToken(refreshToken: string): Promise<ApiResponseWrapper<RefreshTokenResponse>> {
    return apiService.post<ApiResponseWrapper<RefreshTokenResponse>>('/auth/refresh-token/', {
      refresh: refreshToken,
    });
  }

  // async logout(): Promise<ApiResponse<void>> {
  //   return apiService.post<ApiResponse<void>>('/auth/logout');
  // }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>('/auth/me/');
  }
}

export const authService = new AuthService();