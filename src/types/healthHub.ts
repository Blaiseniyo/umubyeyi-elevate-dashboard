// Health Hub Types

export interface Subsection {
    id: number;
    name: string;
    content: string; // Rich text content
    created_at: string;
    updated_at: string;
}

export interface Section {
    id: number;
    name: string;
    content: string;
    cover_image_url?: string;
    subtopic_id?: number;
    parent_sub_topic_id?: number;
    created_at: string;
    updated_at: string;
    sub_sections?: Subsection[];
}

export interface Video {
    id: number;
    title: string;
    description?: string;
    url: string;
    thumbnail?: string;
    duration?: string;
    subtopic_id: number;
    created_at: string;
    updated_at: string;
}

export interface Podcast {
    id: number;
    title: string;
    description?: string;
    url: string;
    thumbnail?: string;
    duration?: string;
    subtopic_id: number;
    created_at: string;
    updated_at: string;
}

export interface Subtopic {
    id: number;
    name: string;
    cover_image_url: string;
    signed_thumbnail?: string; // URL for displaying the image
    content: string; // Rich text description including "About Course" and "What You Will Learn"
    parent_topic_id: number;
    topic_name?: string;
    course_duration_minutes: number;
    course_duration: string; // e.g., "2 Hrs 30 Min"
    sections: Section[];
    videos?: Video[];
    podcasts?: Podcast[];
    created_at: string;
    updated_at: string;
}

export interface Topic {
    id: number;
    name: string;
    created_by?: string;
    updated_by?: string;
    videos?: Video[];
    podcasts?: Podcast[];
    sub_topics?: SubTopicSummary[]; // For the summary view in the topic list
    subtopics?: Subtopic[]; // For compatibility with existing code
    created_at: string;
    updated_at: string | null;
}

export interface SubTopicSummary {
    id: number;
    parent_topic_id: number;
    name: string;
    cover_image_url: string;
    course_duration_minutes?: number;
    course_duration?: string;
    sections?: Section[];
    videos?: Video[];
    podcasts?: Podcast[];
}

// Request Interfaces
export interface CreateTopicRequest {
    name: string;
}

export interface UpdateTopicRequest {
    name?: string;
}

export interface CreateSubtopicRequest {
    name: string;
    cover_image_url: string;
    content: string;
    course_duration_minutes: number;
}

export interface UpdateSubtopicRequest {
    name?: string;
    cover_image_url?: string;
    content?: string;
    course_duration_minutes?: number;
}

export interface CreateSectionRequest {
    name: string;
    content: string;
    subtopic_id: number;
}

export interface UpdateSectionRequest {
    name?: string;
    content?: string;
}

export interface CreateSubsectionRequest {
    name: string;
    content: string;
    section_id: number;
}

export interface UpdateSubsectionRequest {
    name?: string;
    content?: string;
}

export interface CreateVideoRequest {
    title: string;
    description?: string;
    file?: File;
    url?: string;
    thumbnail?: string;
    subtopic_id: number;
}

export interface UpdateVideoRequest {
    title?: string;
    description?: string;
    file?: File;
    url?: string;
    thumbnail?: string;
}

export interface CreatePodcastRequest {
    title: string;
    description?: string;
    file?: File;
    url?: string;
    thumbnail?: string;
    subtopic_id: number;
}

export interface UpdatePodcastRequest {
    title?: string;
    description?: string;
    file?: File;
    url?: string;
    thumbnail?: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    status_code: number;
    message: string;
    data: T;
}

export interface ApiListResponse<T> {
    message: string;
    count: number;
    next: string | null;
    previous: string | null;
    status_code: number;
    data: T[];
}

// Filters and Params
export interface HealthHubFilters {
    page?: number;
    limit?: number;
    topic_id?: number;
    subtopic_id?: number;
    search?: string;
}

// Pagination
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}