export interface GalleryImage {
    id: number;
    image_url: string;
    is_published: boolean;
    created_by: string;
    updated_by: string;
    created_at: string;
    updated_at: string;
}

export interface CreateGalleryImageRequest {
    image_url: string;
}

export interface UpdateGalleryImageRequest {
    is_published?: boolean;
}

export interface GalleryFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_published?: boolean;
}