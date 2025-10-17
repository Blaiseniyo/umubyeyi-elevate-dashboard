import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Tabs,
    Tab,
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PodcastsIcon from '@mui/icons-material/Podcasts';
import { useToast } from '../../../hooks';
import CourseContentTab from './CourseContentTab';
import VideosTab from './VideosTab';
import PodcastsTab from './PodcastsTab';
import { Section, Video, Podcast } from '../../../types/healthHub';

interface TabsSectionProps {
    subtopicId: string;
    sections: Section[];
    videos: Video[];
    podcasts: Podcast[];
    onOpenSectionDialog: (section?: Section) => void;
    onDeleteSection: (id: number) => void;
    onNavigateToSubsectionForm: (section: Section, subsection?: any) => void;
    onDeleteSubsection: (id: number) => void;
}

const TabsSection: React.FC<TabsSectionProps> = ({
    subtopicId,
    sections,
    videos,
    podcasts,
    onOpenSectionDialog,
    onDeleteSection,
    onNavigateToSubsectionForm,
    onDeleteSubsection
}) => {
    const [activeTab, setActiveTab] = useState<number>(0);
    // const [loadingVideos, setLoadingVideos] = useState<boolean>(false);
    // const [loadingPodcasts, setLoadingPodcasts] = useState<boolean>(false);
    const { showToast } = useToast();

    // Load videos and podcasts when tab changes
    // useEffect(() => {
    //     if (activeTab === 1 && videos.length === 0) {
    //         loadVideos();
    //     } else if (activeTab === 2 && podcasts.length === 0) {
    //         loadPodcasts();
    //     }
    // }, [activeTab, videos.length, podcasts.length, subtopicId]);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleDeleteVideo = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                const healthHubService = await import('../../../services/healthHubService').then(mod => mod.healthHubService);
                const response = await healthHubService.deleteVideo(id);

                if (response.success) {
                    showToast('Video deleted successfully', 'success');
                    // Refresh the videos list
                    // loadVideos();
                } else {
                    showToast('Failed to delete video', 'error');
                }
            } catch (error) {
                console.error('Error deleting video:', error);
                showToast('Error deleting video', 'error');
            }
        }
    };

    const handleDeletePodcast = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this podcast?')) {
            try {
                const healthHubService = await import('../../../services/healthHubService').then(mod => mod.healthHubService);
                const response = await healthHubService.deletePodcast(id);

                if (response.success) {
                    showToast('Podcast deleted successfully', 'success');
                    // Refresh the podcasts list
                    // loadPodcasts();
                } else {
                    showToast('Failed to delete podcast', 'error');
                }
            } catch (error) {
                console.error('Error deleting podcast:', error);
                showToast('Error deleting podcast', 'error');
            }
        }
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="content tabs"
                    variant="fullWidth"
                >
                    <Tab
                        icon={<MenuBookIcon />}
                        iconPosition="start"
                        label="Course Content"
                        id="tab-0"
                        aria-controls="tabpanel-0"
                    />
                    <Tab
                        icon={<VideoLibraryIcon />}
                        iconPosition="start"
                        label="Videos"
                        id="tab-1"
                        aria-controls="tabpanel-1"
                    />
                    <Tab
                        icon={<PodcastsIcon />}
                        iconPosition="start"
                        label="Podcasts"
                        id="tab-2"
                        aria-controls="tabpanel-2"
                    />
                </Tabs>
            </Box>

            {/* Course Content Tab Panel */}
            <div
                role="tabpanel"
                hidden={activeTab !== 0}
                id="tabpanel-0"
                aria-labelledby="tab-0"
            >
                {activeTab === 0 && (
                    <CourseContentTab
                        subtopicId={subtopicId}
                        sections={sections}
                        handleOpenSectionDialog={onOpenSectionDialog}
                        handleDeleteSection={onDeleteSection}
                        handleNavigateToSubsectionForm={onNavigateToSubsectionForm}
                        handleDeleteSubsection={onDeleteSubsection}
                    />
                )}
            </div>

            {/* Videos Tab Panel */}
            <div
                role="tabpanel"
                hidden={activeTab !== 1}
                id="tabpanel-1"
                aria-labelledby="tab-1"
            >
                {activeTab === 1 && (
                    <VideosTab
                        subtopicId={subtopicId}
                        videos={videos}
                        // loadingVideos={loadingVideos}
                        handleDeleteVideo={handleDeleteVideo}
                    />
                )}
            </div>

            {/* Podcasts Tab Panel */}
            <div
                role="tabpanel"
                hidden={activeTab !== 2}
                id="tabpanel-2"
                aria-labelledby="tab-2"
            >
                {activeTab === 2 && (
                    <PodcastsTab
                        subtopicId={subtopicId}
                        podcasts={podcasts}
                        // loadingPodcasts={loadingPodcasts}
                        handleDeletePodcast={handleDeletePodcast}
                    />
                )}
            </div>
        </Paper>
    );
};

export default TabsSection;