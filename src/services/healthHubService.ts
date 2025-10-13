import { apiService } from './api';
import {
    Topic, Subtopic, Section, Subsection, Video, Podcast,
    CreateTopicRequest, UpdateTopicRequest,
    CreateSubtopicRequest, UpdateSubtopicRequest,
    CreateSectionRequest, UpdateSectionRequest,
    CreateSubsectionRequest, UpdateSubsectionRequest,
    CreateVideoRequest, UpdateVideoRequest,
    CreatePodcastRequest, UpdatePodcastRequest,
    HealthHubFilters, PaginatedResponse
} from '../types/healthHub';
import { ApiResponseWrapper } from '../types';

// Mock data for development
const mockTopics: Topic[] = [
    {
        id: 1,
        name: 'Maternal Health',
        description: 'Resources related to maternal health and pregnancy',
        subtopics: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Family Health',
        description: 'Resources related to family health and planning',
        subtopics: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

const mockSubtopics: Subtopic[] = [
    {
        id: 1,
        name: 'Preconception Health Education',
        thumbnail: 'https://umubyeyi.org/wp-content/uploads/2025/09/2151055033.png',
        signed_thumbnail: 'https://umubyeyi.org/wp-content/uploads/2025/09/2151055033.png',
        description: '<h3>About Course</h3><p>This course covers the essentials of preconception health—helping individuals and couples prepare for a healthy pregnancy and positive family journey. It covers menstrual cycle basics, preconception care services, lifestyle adjustments, and the vital role of both parents. With practical guidance from health experts, learners will gain knowledge to improve fertility, reduce risks, and support long-term family well-being.</p><h3>What Will I Learn?</h3><ul><li>By the end of this course, you will be able to:</li><li>Understand the preconception period and its importance for future pregnancy.</li><li>Recognize menstrual cycle phases, including ovulation signs, and fertility tracking methods.</li><li>Identify essential preconception health services, screenings, and nutrients.</li><li>Apply lifestyle modifications such as healthy weight, diet, and exercise for fertility.</li><li>Appreciate the roles of both partners, including men\'s contribution to preconception health.</li><li>Manage stress, emotional well-being, and prepare as a couple for conception.</li><li>Know when to seek professional support for fertility or preconception counseling.</li></ul>',
        topic_id: 1,
        topic_name: 'Maternal Health',
        duration: '3h',
        sections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Breastfeeding Essentials',
        thumbnail: 'https://example.com/image2.jpg',
        signed_thumbnail: 'https://example.com/image2.jpg',
        description: '<h3>About Course</h3><p>This course covers everything you need to know about breastfeeding, from proper techniques to common challenges and solutions.</p><h3>What Will I Learn?</h3><ul><li>Proper latching techniques</li><li>Breastfeeding positions</li><li>Common challenges and solutions</li><li>Pumping and storing breast milk</li><li>Nutrition for breastfeeding mothers</li></ul>',
        topic_id: 1,
        topic_name: 'Maternal Health',
        duration: '2h',
        sections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        name: 'Family Planning Methods',
        thumbnail: 'https://example.com/image3.jpg',
        signed_thumbnail: 'https://example.com/image3.jpg',
        description: '<h3>About Course</h3><p>This course explores different family planning methods, their effectiveness, advantages, and considerations.</p><h3>What Will I Learn?</h3><ul><li>Understanding various contraceptive methods</li><li>Choosing the right method for your needs</li><li>Natural family planning techniques</li><li>Long-term vs. short-term methods</li><li>Family planning conversations with your partner</li></ul>',
        topic_id: 2,
        topic_name: 'Family Health',
        duration: '2.5h',
        sections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

const mockSections: Section[] = [
    {
        id: 1,
        name: 'Introduction',
        order: 1,
        subtopic_id: 1,
        subsections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Preconception Health',
        order: 2,
        subtopic_id: 1,
        subsections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        name: 'Planning for a Healthy Pregnancy',
        order: 3,
        subtopic_id: 1,
        subsections: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

const mockSubsections: Subsection[] = [
    {
        id: 1,
        name: 'Introduction',
        content: '<p>Welcome to the Preconception Health Education course. In this section, we will introduce the importance of preconception health and why it matters for a healthy pregnancy.</p>',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        name: 'Preconception Health',
        content: '<p>Preconception health refers to the health of women and men during their reproductive years. It focuses on taking steps to protect the health of a baby they might have sometime in the future, and making healthy choices throughout their lives.</p>',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 3,
        name: 'Menstrual Cycle',
        content: '<p>Understanding your menstrual cycle is crucial for family planning and tracking fertility. This section explains the phases of the menstrual cycle and how to track ovulation.</p>',
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 4,
        name: 'Preconception Care',
        content: '<p>Preconception care is the health care and guidance provided to women and men to reduce risks, promote healthy lifestyles, and increase readiness for pregnancy.</p>',
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 5,
        name: 'Preconception Preparation as a Couple',
        content: '<p>Both partners play a crucial role in preparing for a healthy pregnancy. This section covers how couples can prepare together for conception.</p>',
        order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 6,
        name: 'Role of a Man During Preconception',
        content: "<p>Men's health before conception is just as important as women's health. This section covers the role of men in preconception health.</p>",
        order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 7,
        name: 'Lifestyle Modifications Needed to Optimize Before Conception',
        content: '<p>Making lifestyle changes before trying to conceive can improve fertility and lead to healthier pregnancies. This section covers important modifications to consider.</p>',
        order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 8,
        name: 'Practical Advice from a Health Expert',
        content: '<p>In this section, health experts provide practical advice for couples preparing for conception.</p>',
        order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

// Mock video data
const mockVideos: Video[] = [
    {
        id: 1,
        title: 'Introduction to Preconception Health',
        description: 'An overview of why preconception health matters and how to prepare for a healthy pregnancy.',
        url: 'https://example.com/videos/preconception-intro.mp4',
        thumbnail: 'https://example.com/thumbnails/preconception-intro.jpg',
        duration: '15:30',
        subtopic_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        title: 'Nutrition for Fertility',
        description: 'Learn about the essential nutrients and dietary changes that can boost fertility.',
        url: 'https://example.com/videos/fertility-nutrition.mp4',
        thumbnail: 'https://example.com/thumbnails/fertility-nutrition.jpg',
        duration: '18:45',
        subtopic_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

// Mock podcast data
const mockPodcasts: Podcast[] = [
    {
        id: 1,
        title: 'Preconception Health: Expert Interview',
        description: 'An interview with Dr. Sarah Johnson on preparing your body for pregnancy.',
        url: 'https://example.com/podcasts/expert-interview.mp3',
        thumbnail: 'https://example.com/thumbnails/podcast-expert.jpg',
        duration: '42:15',
        subtopic_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: 2,
        title: 'Couples Journey to Conception',
        description: 'Real stories from couples about their preconception journey.',
        url: 'https://example.com/podcasts/couples-journey.mp3',
        thumbnail: 'https://example.com/thumbnails/podcast-couples.jpg',
        duration: '35:22',
        subtopic_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
];

// Initialize mock data relationships
(() => {
    // Assign subsections to sections
    mockSections[0].subsections = [mockSubsections[0]];
    mockSections[1].subsections = [mockSubsections[1], mockSubsections[2], mockSubsections[3]];
    mockSections[2].subsections = [mockSubsections[4], mockSubsections[5], mockSubsections[6], mockSubsections[7]];

    // Assign sections to subtopics - make a copy of the array, not a reference
    mockSubtopics[0].sections = [...mockSections];

    // Assign videos and podcasts to subtopics
    mockSubtopics[0].videos = mockVideos;
    mockSubtopics[0].podcasts = mockPodcasts;

    // Assign subtopics to topics
    mockTopics[0].subtopics = [mockSubtopics[0], mockSubtopics[1]];
    mockTopics[1].subtopics = [mockSubtopics[2]];
})();

class HealthHubService {
    // Topic methods
    async getTopics(params?: HealthHubFilters): Promise<ApiResponseWrapper<PaginatedResponse<Topic>>> {
        // In a real implementation, this would call the API
        // For now, we'll simulate a successful response with mock data
        const filteredTopics = [...mockTopics];

        // Apply search filter if provided
        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            return {
                success: true,
                message: 'Topics retrieved successfully',
                status_code: 200,
                data: {
                    data: filteredTopics.filter(topic =>
                        topic.name.toLowerCase().includes(searchLower) ||
                        (topic.description && topic.description.toLowerCase().includes(searchLower))
                    ),
                    total: filteredTopics.length,
                    page: params.page || 1,
                    limit: params.limit || 10,
                    totalPages: Math.ceil(filteredTopics.length / (params.limit || 10))
                }
            };
        }

        return {
            success: true,
            message: 'Topics retrieved successfully',
            status_code: 200,
            data: {
                data: filteredTopics,
                total: filteredTopics.length,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: Math.ceil(filteredTopics.length / (params?.limit || 10))
            }
        };
    }

    async getTopicById(id: number): Promise<ApiResponseWrapper<Topic>> {
        const topic = mockTopics.find(t => t.id === id);

        if (!topic) {
            return {
                success: false,
                message: 'Topic not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Topic retrieved successfully',
            status_code: 200,
            data: { ...topic }
        };
    }

    async createTopic(data: CreateTopicRequest): Promise<ApiResponseWrapper<Topic>> {
        // In a real implementation, this would call the API
        const newTopic: Topic = {
            id: Math.max(...mockTopics.map(t => t.id), 0) + 1,
            name: data.name,
            description: data.description,
            subtopics: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockTopics.push(newTopic);

        return {
            success: true,
            message: 'Topic created successfully',
            status_code: 201,
            data: { ...newTopic }
        };
    }

    async updateTopic(id: number, data: UpdateTopicRequest): Promise<ApiResponseWrapper<Topic>> {
        const topicIndex = mockTopics.findIndex(t => t.id === id);

        if (topicIndex === -1) {
            return {
                success: false,
                message: 'Topic not found',
                status_code: 404,
                data: null as any
            };
        }

        const updatedTopic = {
            ...mockTopics[topicIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockTopics[topicIndex] = updatedTopic;

        return {
            success: true,
            message: 'Topic updated successfully',
            status_code: 200,
            data: { ...updatedTopic }
        };
    }

    async deleteTopic(id: number): Promise<ApiResponseWrapper<null>> {
        const topicIndex = mockTopics.findIndex(t => t.id === id);

        if (topicIndex === -1) {
            return {
                success: false,
                message: 'Topic not found',
                status_code: 404,
                data: null
            };
        }

        mockTopics.splice(topicIndex, 1);

        return {
            success: true,
            message: 'Topic deleted successfully',
            status_code: 200,
            data: null
        };
    }

    // Subtopic methods
    async getSubtopics(params?: HealthHubFilters): Promise<ApiResponseWrapper<PaginatedResponse<Subtopic>>> {
        // Filter subtopics based on params
        let filteredSubtopics = [...mockSubtopics];

        if (params?.topic_id) {
            filteredSubtopics = filteredSubtopics.filter(s => s.topic_id === params.topic_id);
        }

        if (params?.search) {
            const searchLower = params.search.toLowerCase();
            filteredSubtopics = filteredSubtopics.filter(subtopic =>
                subtopic.name.toLowerCase().includes(searchLower) ||
                subtopic.description.toLowerCase().includes(searchLower)
            );
        }

        return {
            success: true,
            message: 'Subtopics retrieved successfully',
            status_code: 200,
            data: {
                data: filteredSubtopics,
                total: filteredSubtopics.length,
                page: params?.page || 1,
                limit: params?.limit || 10,
                totalPages: Math.ceil(filteredSubtopics.length / (params?.limit || 10))
            }
        };
    }

    async getSubtopicById(id: number): Promise<ApiResponseWrapper<Subtopic>> {
        const subtopic = mockSubtopics.find(s => s.id === id);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Subtopic retrieved successfully',
            status_code: 200,
            data: { ...subtopic }
        };
    }

    async createSubtopic(data: CreateSubtopicRequest): Promise<ApiResponseWrapper<Subtopic>> {
        // Check if topic exists
        const topic = mockTopics.find(t => t.id === data.topic_id);

        if (!topic) {
            return {
                success: false,
                message: 'Topic not found',
                status_code: 404,
                data: null as any
            };
        }

        const newSubtopic: Subtopic = {
            id: Math.max(...mockSubtopics.map(s => s.id), 0) + 1,
            name: data.name,
            thumbnail: data.thumbnail,
            signed_thumbnail: data.thumbnail,
            description: data.description,
            topic_id: data.topic_id,
            topic_name: topic.name,
            duration: data.duration,
            sections: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockSubtopics.push(newSubtopic);
        topic.subtopics.push(newSubtopic);

        return {
            success: true,
            message: 'Subtopic created successfully',
            status_code: 201,
            data: { ...newSubtopic }
        };
    }

    async updateSubtopic(id: number, data: UpdateSubtopicRequest): Promise<ApiResponseWrapper<Subtopic>> {
        const subtopicIndex = mockSubtopics.findIndex(s => s.id === id);

        if (subtopicIndex === -1) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        // If topic_id is being updated, check if the new topic exists
        if (data.topic_id && data.topic_id !== mockSubtopics[subtopicIndex].topic_id) {
            const newTopic = mockTopics.find(t => t.id === data.topic_id);

            if (!newTopic) {
                return {
                    success: false,
                    message: 'Topic not found',
                    status_code: 404,
                    data: null as any
                };
            }

            // Update topic_name if topic_id is changing
            data.topic_id = newTopic.id;
        }

        const updatedSubtopic = {
            ...mockSubtopics[subtopicIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockSubtopics[subtopicIndex] = updatedSubtopic;

        return {
            success: true,
            message: 'Subtopic updated successfully',
            status_code: 200,
            data: { ...updatedSubtopic }
        };
    }

    async deleteSubtopic(id: number): Promise<ApiResponseWrapper<null>> {
        const subtopicIndex = mockSubtopics.findIndex(s => s.id === id);

        if (subtopicIndex === -1) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null
            };
        }

        const deletedSubtopic = mockSubtopics[subtopicIndex];
        mockSubtopics.splice(subtopicIndex, 1);

        // Also remove from the topic
        const topic = mockTopics.find(t => t.id === deletedSubtopic.topic_id);
        if (topic) {
            topic.subtopics = topic.subtopics.filter(s => s.id !== id);
        }

        return {
            success: true,
            message: 'Subtopic deleted successfully',
            status_code: 200,
            data: null
        };
    }

    // Section methods
    async getSections(subtopicId: number): Promise<ApiResponseWrapper<Section[]>> {
        const subtopic = mockSubtopics.find(s => s.id === subtopicId);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        const sections = mockSections.filter(s => s.subtopic_id === subtopicId);

        return {
            success: true,
            message: 'Sections retrieved successfully',
            status_code: 200,
            data: sections
        };
    }

    async getSectionById(id: number): Promise<ApiResponseWrapper<Section>> {
        const section = mockSections.find(s => s.id === id);

        if (!section) {
            return {
                success: false,
                message: 'Section not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Section retrieved successfully',
            status_code: 200,
            data: { ...section }
        };
    }

    async createSection(data: CreateSectionRequest): Promise<ApiResponseWrapper<Section>> {
        // Check if subtopic exists
        const subtopic = mockSubtopics.find(s => s.id === data.subtopic_id);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        const newSection: Section = {
            id: Math.max(...mockSections.map(s => s.id), 0) + 1,
            name: data.name,
            order: data.order,
            subtopic_id: data.subtopic_id,
            subsections: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockSections.push(newSection);

        // Create a new array for sections to avoid modifying the original frozen array
        subtopic.sections = [...subtopic.sections, newSection];

        return {
            success: true,
            message: 'Section created successfully',
            status_code: 201,
            data: { ...newSection }
        };
    }

    async updateSection(id: number, data: UpdateSectionRequest): Promise<ApiResponseWrapper<Section>> {
        const sectionIndex = mockSections.findIndex(s => s.id === id);

        if (sectionIndex === -1) {
            return {
                success: false,
                message: 'Section not found',
                status_code: 404,
                data: null as any
            };
        }

        const updatedSection = {
            ...mockSections[sectionIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockSections[sectionIndex] = updatedSection;

        // Find and update the section in the subtopic as well
        const subtopic = mockSubtopics.find(s => s.id === updatedSection.subtopic_id);
        if (subtopic) {
            const subtopicSectionIndex = subtopic.sections.findIndex(s => s.id === id);
            if (subtopicSectionIndex !== -1) {
                // Create a new array with the updated section
                subtopic.sections = [
                    ...subtopic.sections.slice(0, subtopicSectionIndex),
                    updatedSection,
                    ...subtopic.sections.slice(subtopicSectionIndex + 1)
                ];
            }
        }

        return {
            success: true,
            message: 'Section updated successfully',
            status_code: 200,
            data: { ...updatedSection }
        };
    }

    async deleteSection(id: number): Promise<ApiResponseWrapper<null>> {
        const sectionIndex = mockSections.findIndex(s => s.id === id);

        if (sectionIndex === -1) {
            return {
                success: false,
                message: 'Section not found',
                status_code: 404,
                data: null
            };
        }

        const deletedSection = mockSections[sectionIndex];
        mockSections.splice(sectionIndex, 1);

        // Also remove from the subtopic
        const subtopic = mockSubtopics.find(s => s.id === deletedSection.subtopic_id);
        if (subtopic) {
            subtopic.sections = subtopic.sections.filter(s => s.id !== id);
        }

        return {
            success: true,
            message: 'Section deleted successfully',
            status_code: 200,
            data: null
        };
    }

    // Subsection methods
    async getSubsections(sectionId: number): Promise<ApiResponseWrapper<Subsection[]>> {
        const section = mockSections.find(s => s.id === sectionId);

        if (!section) {
            return {
                success: false,
                message: 'Section not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Subsections retrieved successfully',
            status_code: 200,
            data: section.subsections
        };
    }

    async getSubsectionById(id: number): Promise<ApiResponseWrapper<Subsection>> {
        const subsection = mockSubsections.find(s => s.id === id);

        if (!subsection) {
            return {
                success: false,
                message: 'Subsection not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Subsection retrieved successfully',
            status_code: 200,
            data: { ...subsection }
        };
    }

    async createSubsection(data: CreateSubsectionRequest): Promise<ApiResponseWrapper<Subsection>> {
        // Find the section
        const section = mockSections.find(s => s.id === data.section_id);

        if (!section) {
            return {
                success: false,
                message: 'Section not found',
                status_code: 404,
                data: null as any
            };
        }

        const newSubsection: Subsection = {
            id: Math.max(...mockSubsections.map(s => s.id), 0) + 1,
            name: data.name,
            content: data.content,
            order: data.order,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockSubsections.push(newSubsection);
        section.subsections.push(newSubsection);

        return {
            success: true,
            message: 'Subsection created successfully',
            status_code: 201,
            data: { ...newSubsection }
        };
    }

    async updateSubsection(id: number, data: UpdateSubsectionRequest): Promise<ApiResponseWrapper<Subsection>> {
        const subsectionIndex = mockSubsections.findIndex(s => s.id === id);

        if (subsectionIndex === -1) {
            return {
                success: false,
                message: 'Subsection not found',
                status_code: 404,
                data: null as any
            };
        }

        const updatedSubsection = {
            ...mockSubsections[subsectionIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockSubsections[subsectionIndex] = updatedSubsection;

        // Also update in the section
        for (const section of mockSections) {
            const subsectionIndex = section.subsections.findIndex(s => s.id === id);
            if (subsectionIndex !== -1) {
                section.subsections[subsectionIndex] = updatedSubsection;
                break;
            }
        }

        return {
            success: true,
            message: 'Subsection updated successfully',
            status_code: 200,
            data: { ...updatedSubsection }
        };
    }

    async deleteSubsection(id: number): Promise<ApiResponseWrapper<null>> {
        const subsectionIndex = mockSubsections.findIndex(s => s.id === id);

        if (subsectionIndex === -1) {
            return {
                success: false,
                message: 'Subsection not found',
                status_code: 404,
                data: null
            };
        }

        mockSubsections.splice(subsectionIndex, 1);

        // Also remove from the section
        for (const section of mockSections) {
            section.subsections = section.subsections.filter(s => s.id !== id);
        }

        return {
            success: true,
            message: 'Subsection deleted successfully',
            status_code: 200,
            data: null
        };
    }

    // Video methods
    async getVideos(subtopicId: number): Promise<ApiResponseWrapper<Video[]>> {
        const subtopic = mockSubtopics.find(s => s.id === subtopicId);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: [] as any
            };
        }

        return {
            success: true,
            message: 'Videos retrieved successfully',
            status_code: 200,
            data: subtopic.videos || []
        };
    }

    async getVideoById(id: number): Promise<ApiResponseWrapper<Video>> {
        const video = mockVideos.find(v => v.id === id);

        if (!video) {
            return {
                success: false,
                message: 'Video not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Video retrieved successfully',
            status_code: 200,
            data: { ...video }
        };
    }

    async createVideo(data: CreateVideoRequest): Promise<ApiResponseWrapper<Video>> {
        // Find the subtopic
        const subtopic = mockSubtopics.find(s => s.id === data.subtopic_id);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        // In a real implementation, we would handle file upload here
        // For mock data, we'll just create a URL
        const newVideo: Video = {
            id: Math.max(...mockVideos.map(v => v.id), 0) + 1,
            title: data.title,
            description: data.description || '',
            url: data.url || `https://example.com/videos/${data.title.toLowerCase().replace(/\s+/g, '-')}.mp4`,
            thumbnail: data.thumbnail || `https://example.com/thumbnails/${data.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            duration: '0:00', // This would be determined from the actual file
            subtopic_id: data.subtopic_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockVideos.push(newVideo);

        // Add to subtopic videos if it exists, otherwise create the array
        if (!subtopic.videos) {
            subtopic.videos = [];
        }
        subtopic.videos.push(newVideo);

        return {
            success: true,
            message: 'Video created successfully',
            status_code: 201,
            data: { ...newVideo }
        };
    }

    async updateVideo(id: number, data: UpdateVideoRequest): Promise<ApiResponseWrapper<Video>> {
        const videoIndex = mockVideos.findIndex(v => v.id === id);

        if (videoIndex === -1) {
            return {
                success: false,
                message: 'Video not found',
                status_code: 404,
                data: null as any
            };
        }

        const updatedVideo = {
            ...mockVideos[videoIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockVideos[videoIndex] = updatedVideo;

        // Also update in the subtopic
        const subtopic = mockSubtopics.find(s => s.id === updatedVideo.subtopic_id);
        if (subtopic && subtopic.videos) {
            const subtopicVideoIndex = subtopic.videos.findIndex(v => v.id === id);
            if (subtopicVideoIndex !== -1) {
                subtopic.videos[subtopicVideoIndex] = updatedVideo;
            }
        }

        return {
            success: true,
            message: 'Video updated successfully',
            status_code: 200,
            data: { ...updatedVideo }
        };
    }

    async deleteVideo(id: number): Promise<ApiResponseWrapper<null>> {
        const videoIndex = mockVideos.findIndex(v => v.id === id);

        if (videoIndex === -1) {
            return {
                success: false,
                message: 'Video not found',
                status_code: 404,
                data: null
            };
        }

        const deletedVideo = mockVideos[videoIndex];
        mockVideos.splice(videoIndex, 1);

        // Also remove from the subtopic
        const subtopic = mockSubtopics.find(s => s.id === deletedVideo.subtopic_id);
        if (subtopic && subtopic.videos) {
            subtopic.videos = subtopic.videos.filter(v => v.id !== id);
        }

        return {
            success: true,
            message: 'Video deleted successfully',
            status_code: 200,
            data: null
        };
    }

    // Podcast methods
    async getPodcasts(subtopicId: number): Promise<ApiResponseWrapper<Podcast[]>> {
        const subtopic = mockSubtopics.find(s => s.id === subtopicId);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: [] as any
            };
        }

        return {
            success: true,
            message: 'Podcasts retrieved successfully',
            status_code: 200,
            data: subtopic.podcasts || []
        };
    }

    async getPodcastById(id: number): Promise<ApiResponseWrapper<Podcast>> {
        const podcast = mockPodcasts.find(p => p.id === id);

        if (!podcast) {
            return {
                success: false,
                message: 'Podcast not found',
                status_code: 404,
                data: null as any
            };
        }

        return {
            success: true,
            message: 'Podcast retrieved successfully',
            status_code: 200,
            data: { ...podcast }
        };
    }

    async createPodcast(data: CreatePodcastRequest): Promise<ApiResponseWrapper<Podcast>> {
        // Find the subtopic
        const subtopic = mockSubtopics.find(s => s.id === data.subtopic_id);

        if (!subtopic) {
            return {
                success: false,
                message: 'Subtopic not found',
                status_code: 404,
                data: null as any
            };
        }

        // In a real implementation, we would handle file upload here
        // For mock data, we'll just create a URL
        const newPodcast: Podcast = {
            id: Math.max(...mockPodcasts.map(p => p.id), 0) + 1,
            title: data.title,
            description: data.description || '',
            url: data.url || `https://example.com/podcasts/${data.title.toLowerCase().replace(/\s+/g, '-')}.mp3`,
            thumbnail: data.thumbnail || `https://example.com/thumbnails/podcast-${data.title.toLowerCase().replace(/\s+/g, '-')}.jpg`,
            duration: '0:00', // This would be determined from the actual file
            subtopic_id: data.subtopic_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        mockPodcasts.push(newPodcast);

        // Add to subtopic podcasts if it exists, otherwise create the array
        if (!subtopic.podcasts) {
            subtopic.podcasts = [];
        }
        subtopic.podcasts.push(newPodcast);

        return {
            success: true,
            message: 'Podcast created successfully',
            status_code: 201,
            data: { ...newPodcast }
        };
    }

    async updatePodcast(id: number, data: UpdatePodcastRequest): Promise<ApiResponseWrapper<Podcast>> {
        const podcastIndex = mockPodcasts.findIndex(p => p.id === id);

        if (podcastIndex === -1) {
            return {
                success: false,
                message: 'Podcast not found',
                status_code: 404,
                data: null as any
            };
        }

        const updatedPodcast = {
            ...mockPodcasts[podcastIndex],
            ...data,
            updated_at: new Date().toISOString()
        };

        mockPodcasts[podcastIndex] = updatedPodcast;

        // Also update in the subtopic
        const subtopic = mockSubtopics.find(s => s.id === updatedPodcast.subtopic_id);
        if (subtopic && subtopic.podcasts) {
            const subtopicPodcastIndex = subtopic.podcasts.findIndex(p => p.id === id);
            if (subtopicPodcastIndex !== -1) {
                subtopic.podcasts[subtopicPodcastIndex] = updatedPodcast;
            }
        }

        return {
            success: true,
            message: 'Podcast updated successfully',
            status_code: 200,
            data: { ...updatedPodcast }
        };
    }

    async deletePodcast(id: number): Promise<ApiResponseWrapper<null>> {
        const podcastIndex = mockPodcasts.findIndex(p => p.id === id);

        if (podcastIndex === -1) {
            return {
                success: false,
                message: 'Podcast not found',
                status_code: 404,
                data: null
            };
        }

        const deletedPodcast = mockPodcasts[podcastIndex];
        mockPodcasts.splice(podcastIndex, 1);

        // Also remove from the subtopic
        const subtopic = mockSubtopics.find(s => s.id === deletedPodcast.subtopic_id);
        if (subtopic && subtopic.podcasts) {
            subtopic.podcasts = subtopic.podcasts.filter(p => p.id !== id);
        }

        return {
            success: true,
            message: 'Podcast deleted successfully',
            status_code: 200,
            data: null
        };
    }
}

export const healthHubService = new HealthHubService();