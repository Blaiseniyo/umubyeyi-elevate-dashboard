import { apiService } from './api';
import { ApiResponse, PaginatedResponse, User } from '../types';

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'user' | 'staff' | 'admin';
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UserService {
  async getUsers(params?: GetUsersParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return apiService.get<ApiResponse<PaginatedResponse<User>>>(url);
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiService.get<ApiResponse<User>>(`/users/${id}`);
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<ApiResponse<User>> {
    return apiService.put<ApiResponse<User>>(`/users/${id}`, data);
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return apiService.delete<ApiResponse<void>>(`/users/${id}`);
  }

  async promoteToStaff(id: string): Promise<ApiResponse<User>> {
    return apiService.patch<ApiResponse<User>>(`/users/${id}/promote-staff`);
  }

  async demoteFromStaff(id: string): Promise<ApiResponse<User>> {
    return apiService.patch<ApiResponse<User>>(`/users/${id}/demote-staff`);
  }
}

export const userService = new UserService();