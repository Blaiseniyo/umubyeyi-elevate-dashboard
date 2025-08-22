export interface User {
  id: number;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  profile_picture?: string | null;
  profile_completed: boolean;
  // Keep existing fields for backward compatibility
  firstName?: string;
  lastName?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'user' | 'staff' | 'admin';
  createdAt?: string;
  lastLogin?: string;
  pregnancyInfo?: {
    dueDate: string;
    currentWeek: number;
    currentTrimester: number;
  };
}

export interface Trimester {
  id: number;
  trimester_name: string;
  trimester: 1 | 2 | 3;
  title: string;
  description?: string;
  start_week: number;
  end_week: number;
  medical_checks?: string;
  tips_and_advice?: string;
  created_at: string;
  updated_at: string;
}

export interface WeeklyContent {
  id: number;
  week: number;
  title: string;
  description: string;
  baby_size?: string;
  baby_size_image_url?: string;
  signed_baby_size_image_url?: string;
  baby_size_description?: string;
  baby_weight?: string;
  baby_weight_image_url?: string;
  signed_baby_weight_image_url?: string;
  baby_weight_description?: string;
  baby_height?: string;
  baby_height_image_url?: string;
  signed_baby_height_image_url?: string;
  baby_height_description?: string;
  ultrasound_image_url?: string;
  signed_ultrasound_image_url?: string;
  ultrasound_description?: string;
  tips_and_advice?: string;
  family_image_url?: string;
  family_description?: string;
  trimester?: Trimester;
  trimester_name: string; // This field exists directly on the response
  symptoms?: Symptom[];
  created_at: string;
  updated_at: string;
}

export interface Symptom {
  id: number;
  name: string;
  description: string;
  image_url: string;
  signed_image_url: string;
  week_number: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  status_code: number;
  data: T;
}

// Alias for API response consistency
export type ApiResponseWrapper<T> = ApiResponse<T>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}