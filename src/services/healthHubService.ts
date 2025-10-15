import { apiService } from './api';
import {
    Topic, Subtopic, Section, Subsection, Video, Podcast,
    CreateTopicRequest, UpdateTopicRequest,
    CreateSubtopicRequest, UpdateSubtopicRequest,
    CreateSectionRequest, UpdateSectionRequest,
    CreateSubsectionRequest, UpdateSubsectionRequest,
    CreateVideoRequest, UpdateVideoRequest,
    CreatePodcastRequest, UpdatePodcastRequest,
    HealthHubFilters, PaginatedResponse, ApiResponse, ApiListResponse, SubTopicSummary
} from '../types/healthHub';
import { ApiResponseWrapper } from '../types';

class HealthHubService {
    // Topic methods
    async getTopics(params?: HealthHubFilters): Promise<ApiResponseWrapper<PaginatedResponse<Topic>>> {
        try {
            // Build URL with query parameters
            let url = '/health-hub/topics/';
            const queryParams = new URLSearchParams();

            if (params?.page) queryParams.append('page', params.page.toString());
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.search) queryParams.append('search', params.search);

            const queryString = queryParams.toString();
            if (queryString) url += `?${queryString}`;

            const response = await apiService.get<ApiListResponse<Topic>>(url);

            // Transform response to match our application's expected structure
            return {
                success: true,
                message: response.message,
                status_code: response.status_code,
                data: {
                    data: response.data.map((topic: Topic) => ({
                        ...topic,
                        // Map sub_topics to subtopics for backward compatibility
                        subtopics: topic.sub_topics?.map((st: SubTopicSummary) => ({
                            id: st.id,
                            name: st.name,
                            cover_image_url: st.cover_image_url,
                            signed_thumbnail: st.cover_image_url,
                            parent_topic_id: st.parent_topic_id,
                            content: '',
                            course_duration_minutes: st.course_duration_minutes || 0,
                            course_duration: st.course_duration || '',
                            sections: st.sections || [],
                            videos: st.videos || [],
                            podcasts: st.podcasts || [],
                            created_at: '',
                            updated_at: ''
                        })) || []
                    })),
                    total: response.count,
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    totalPages: Math.ceil(response.count / (params?.limit || 10))
                }
            };
        } catch (error) {
            console.error('Error fetching topics:', error);
            throw error;
        }
    }

    async getTopicById(id: number): Promise<ApiResponseWrapper<Topic>> {
        try {
            const url = `/health-hub/topics/${id}/`;
            const response = await apiService.get<ApiResponse<Topic>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: {
                    ...response.data,
                    // Map sub_topics to subtopics for backward compatibility if they exist
                    subtopics: response.data.sub_topics?.map((st: SubTopicSummary) => ({
                        id: st.id,
                        name: st.name,
                        cover_image_url: st.cover_image_url,
                        signed_thumbnail: st.cover_image_url,
                        parent_topic_id: st.parent_topic_id,
                        content: '',
                        course_duration_minutes: st.course_duration_minutes || 0,
                        course_duration: st.course_duration || '',
                        // Map the sections from the new API response format
                        sections: st.sections?.map(section => ({
                            id: section.id,
                            name: section.name,
                            content: section.content,
                            cover_image_url: section.cover_image_url,
                            order: 0, // Default order since it's not in the API response
                            subtopic_id: st.parent_topic_id,
                            parent_sub_topic_id: st.id,
                            subsections: [], // No subsections in this view
                            created_at: '',
                            updated_at: ''
                        })) || [],
                        created_at: '',
                        updated_at: ''
                    })) || []
                }
            };
        } catch (error) {
            console.error('Error fetching topic by ID:', error);
            throw error;
        }
    }

    async createTopic(data: CreateTopicRequest): Promise<ApiResponseWrapper<Topic>> {
        try {
            const url = '/health-hub/topics/';
            const response = await apiService.post<ApiResponse<Topic>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating topic:', error);
            throw error;
        }
    }

    async updateTopic(id: number, data: UpdateTopicRequest): Promise<ApiResponseWrapper<Topic>> {
        try {
            const url = `/health-hub/topics/${id}/`;
            const response = await apiService.put<ApiResponse<Topic>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating topic:', error);
            throw error;
        }
    }

    async deleteTopic(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/topics/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting topic:', error);
            throw error;
        }
    }

    // Subtopic methods
    async getSubtopicById(id: number): Promise<ApiResponseWrapper<Subtopic>> {
        try {
            const url = `/health-hub/sub-topics/${id}/`;
            const response = await apiService.get<ApiResponse<Subtopic>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching subtopic by ID:', error);
            throw error;
        }
    }

    async createSubtopic(topicId: number, data: CreateSubtopicRequest): Promise<ApiResponseWrapper<Subtopic>> {
        try {
            const url = `/health-hub/topics/${topicId}/add-sub-topic/`;
            const response = await apiService.post<ApiResponse<Subtopic>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating subtopic:', error);
            throw error;
        }
    }

    async updateSubtopic(id: number, data: UpdateSubtopicRequest): Promise<ApiResponseWrapper<Subtopic>> {
        try {
            const url = `/health-hub/sub-topics/${id}/`;
            const response = await apiService.put<ApiResponse<Subtopic>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating subtopic:', error);
            throw error;
        }
    }

    async deleteSubtopic(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/sub-topics/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting subtopic:', error);
            throw error;
        }
    }

    // Section methods
    async getSectionById(id: number): Promise<ApiResponseWrapper<Section>> {
        try {
            const url = `/health-hub/sections/${id}/`;
            const response = await apiService.get<ApiResponse<Section>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching section by ID:', error);
            throw error;
        }
    }

    async createSection(data: CreateSectionRequest): Promise<ApiResponseWrapper<Section>> {
        try {
            const url = '/health-hub/sections/';
            const response = await apiService.post<ApiResponse<Section>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating section:', error);
            throw error;
        }
    }

    async updateSection(id: number, data: UpdateSectionRequest): Promise<ApiResponseWrapper<Section>> {
        try {
            const url = `/health-hub/sections/${id}/`;
            const response = await apiService.put<ApiResponse<Section>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating section:', error);
            throw error;
        }
    }

    async deleteSection(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/sections/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting section:', error);
            throw error;
        }
    }

    // Subsection methods
    async getSubsectionById(id: number): Promise<ApiResponseWrapper<Subsection>> {
        try {
            const url = `/health-hub/subsections/${id}/`;
            const response = await apiService.get<ApiResponse<Subsection>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching subsection by ID:', error);
            throw error;
        }
    }

    async createSubsection(data: CreateSubsectionRequest): Promise<ApiResponseWrapper<Subsection>> {
        try {
            const url = '/health-hub/subsections/';
            const response = await apiService.post<ApiResponse<Subsection>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating subsection:', error);
            throw error;
        }
    }

    async updateSubsection(id: number, data: UpdateSubsectionRequest): Promise<ApiResponseWrapper<Subsection>> {
        try {
            const url = `/health-hub/subsections/${id}/`;
            const response = await apiService.put<ApiResponse<Subsection>>(url, data);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating subsection:', error);
            throw error;
        }
    }

    async deleteSubsection(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/subsections/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting subsection:', error);
            throw error;
        }
    }

    // Video methods
    async getVideos(subtopicId: number): Promise<ApiResponseWrapper<Video[]>> {
        try {
            const url = `/health-hub/videos/?subtopic_id=${subtopicId}`;
            const response = await apiService.get<ApiListResponse<Video>>(url);

            return {
                success: true,
                message: response.message || 'Success',
                status_code: response.status_code || 200,
                data: response.data || []
            };
        } catch (error) {
            console.error('Error fetching videos:', error);
            throw error;
        }
    }

    async getVideoById(id: number): Promise<ApiResponseWrapper<Video>> {
        try {
            const url = `/health-hub/videos/${id}/`;
            const response = await apiService.get<ApiResponse<Video>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching video by ID:', error);
            throw error;
        }
    }

    async createVideo(data: CreateVideoRequest): Promise<ApiResponseWrapper<Video>> {
        try {
            const url = '/health-hub/videos/';

            // Handle file upload if present
            let formData: FormData | null = null;
            if (data.file) {
                formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'file') {
                        formData?.append('file', value as File);
                    } else if (value !== undefined) {
                        formData?.append(key, value as string);
                    }
                });
            }

            const response = await apiService.post<ApiResponse<Video>>(
                url,
                formData || data,
                formData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
            );

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating video:', error);
            throw error;
        }
    }

    async updateVideo(id: number, data: UpdateVideoRequest): Promise<ApiResponseWrapper<Video>> {
        try {
            const url = `/health-hub/videos/${id}/`;

            // Handle file upload if present
            let formData: FormData | null = null;
            if (data.file) {
                formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'file') {
                        formData?.append('file', value as File);
                    } else if (value !== undefined) {
                        formData?.append(key, value as string);
                    }
                });
            }

            const response = await apiService.put<ApiResponse<Video>>(
                url,
                formData || data,
                formData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
            );

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating video:', error);
            throw error;
        }
    }

    async deleteVideo(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/videos/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting video:', error);
            throw error;
        }
    }

    // Podcast methods
    async getPodcasts(subtopicId: number): Promise<ApiResponseWrapper<Podcast[]>> {
        try {
            const url = `/health-hub/podcasts/?subtopic_id=${subtopicId}`;
            const response = await apiService.get<ApiListResponse<Podcast>>(url);

            return {
                success: true,
                message: response.message || 'Success',
                status_code: response.status_code || 200,
                data: response.data || []
            };
        } catch (error) {
            console.error('Error fetching podcasts:', error);
            throw error;
        }
    }

    async getPodcastById(id: number): Promise<ApiResponseWrapper<Podcast>> {
        try {
            const url = `/health-hub/podcasts/${id}/`;
            const response = await apiService.get<ApiResponse<Podcast>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error fetching podcast by ID:', error);
            throw error;
        }
    }

    async createPodcast(data: CreatePodcastRequest): Promise<ApiResponseWrapper<Podcast>> {
        try {
            const url = '/health-hub/podcasts/';

            // Handle file upload if present
            let formData: FormData | null = null;
            if (data.file) {
                formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'file') {
                        formData?.append('file', value as File);
                    } else if (value !== undefined) {
                        formData?.append(key, value as string);
                    }
                });
            }

            const response = await apiService.post<ApiResponse<Podcast>>(
                url,
                formData || data,
                formData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
            );

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error creating podcast:', error);
            throw error;
        }
    }

    async updatePodcast(id: number, data: UpdatePodcastRequest): Promise<ApiResponseWrapper<Podcast>> {
        try {
            const url = `/health-hub/podcasts/${id}/`;

            // Handle file upload if present
            let formData: FormData | null = null;
            if (data.file) {
                formData = new FormData();
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'file') {
                        formData?.append('file', value as File);
                    } else if (value !== undefined) {
                        formData?.append(key, value as string);
                    }
                });
            }

            const response = await apiService.put<ApiResponse<Podcast>>(
                url,
                formData || data,
                formData ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined
            );

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: response.data
            };
        } catch (error) {
            console.error('Error updating podcast:', error);
            throw error;
        }
    }

    async deletePodcast(id: number): Promise<ApiResponseWrapper<null>> {
        try {
            const url = `/health-hub/podcasts/${id}/`;
            const response = await apiService.delete<ApiResponse<null>>(url);

            return {
                success: response.success,
                message: response.message,
                status_code: response.status_code,
                data: null
            };
        } catch (error) {
            console.error('Error deleting podcast:', error);
            throw error;
        }
    }
}

export const healthHubService = new HealthHubService();
