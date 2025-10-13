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
  fetal_development?: string;
  baby_size?: string;
  symptoms?: TrimesterSymptom[];
  created_at: string;
  updated_at: string;
}

export interface TrimesterSymptom {
  id?: number;
  name: string;
  description: string;
  image_url: string;
  signed_image_url?: string;
  trimester_number?: number;
  trimester_name?: string;
}

export interface WeeklyContent {
  id: number;
  week: number;
  title: string;
  description: string;
  baby_size_image_url?: string;
  signed_baby_size_image_url?: string;
  baby_size_description?: string;
  baby_weight_image_url?: string;
  signed_baby_weight_image_url?: string;
  baby_weight_description?: string;
  ultrasound_image_url?: string;
  signed_ultrasound_image_url?: string;
  ultrasound_description?: string;
  what_you_might_feel?: string;
  what_you_might_feel_image_url?: string;
  signed_what_you_might_feel_image_url?: string;
  body_changes?: string;
  body_changes_image_url?: string;
  signed_body_changes_image_url?: string;
  trimester?: Trimester;
  trimester_name: string; // This field exists directly on the response
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

// Export Health Hub types
export * from './healthHub';