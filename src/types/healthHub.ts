// Health Hub Types

export interface Subsection {
    id: number;
    name: string;
    content: string; // Rich text content
    order: number;
    created_at: string;
    updated_at: string;
}

export interface Section {
    id: number;
    name: string;
    order: number;
    subtopic_id: number;
    subsections: Subsection[];
    created_at: string;
    updated_at: string;
}

export interface Subtopic {
    id: number;
    name: string;
    thumbnail: string;
    signed_thumbnail?: string; // URL for displaying the image
    description: string; // Rich text description including "About Course" and "What You Will Learn"
    topic_id: number;
    topic_name?: string;
    duration: string; // e.g., "3h"
    sections: Section[];
    created_at: string;
    updated_at: string;
}

export interface Topic {
    id: number;
    name: string;
    description?: string;
    subtopics: Subtopic[];
    created_at: string;
    updated_at: string;
}

// Request Interfaces
export interface CreateTopicRequest {
    name: string;
    description?: string;
}

export interface UpdateTopicRequest {
    name?: string;
    description?: string;
}

export interface CreateSubtopicRequest {
    name: string;
    thumbnail: string;
    description: string;
    topic_id: number;
    duration: string;
}

export interface UpdateSubtopicRequest {
    name?: string;
    thumbnail?: string;
    description?: string;
    topic_id?: number;
    duration?: string;
}

export interface CreateSectionRequest {
    name: string;
    order: number;
    subtopic_id: number;
}

export interface UpdateSectionRequest {
    name?: string;
    order?: number;
}

export interface CreateSubsectionRequest {
    name: string;
    content: string;
    order: number;
    section_id: number;
}

export interface UpdateSubsectionRequest {
    name?: string;
    content?: string;
    order?: number;
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