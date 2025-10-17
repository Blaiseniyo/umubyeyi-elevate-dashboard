import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Breadcrumbs,
    Link as MuiLink,
    FormControl,
    FormHelperText,
    CircularProgress,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks';
import { useAppSelector } from '../../hooks';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import VideoUpload from '../../components/Common/VideoUpload';
import ImageUpload from '../../components/Common/ImageUpload';
import { CreateVideoRequest, UpdateVideoRequest } from '../../types/healthHub';

const VideoFormPage: React.FC = () => {
    const { subtopicId, videoId } = useParams<{ subtopicId: string; videoId: string }>();
    const navigate = useNavigate();
    const { currentSubtopic } = useAppSelector(state => state.healthHub);
    const { showToast } = useToast();

    // Form state
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [url, setUrl] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string>('');

    // Component state
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const isEditMode = Boolean(videoId);

    useEffect(() => {
        if (isEditMode) {
            loadVideo();
        }
    }, [videoId]);

    const loadVideo = async () => {
        if (!videoId) return;

        try {
            setLoadingVideo(true);
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.getVideoById(Number(videoId));

            if (response.success) {
                const video = response.data;
                setTitle(video.title);
                setDescription(video.description || '');
                setUrl(video.url);
                setThumbnail(video.thumbnail || '');
            } else {
                showToast('Failed to load video', 'error');
                navigate(`/health-hub/subtopics/${subtopicId}`);
            }
        } catch (error) {
            console.error('Error loading video:', error);
            showToast('Error loading video', 'error');
            navigate(`/health-hub/subtopics/${subtopicId}`);
        } finally {
            setLoadingVideo(false);
        }
    };

    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!url.trim() && !file) {
            newErrors.url = 'Either URL or file upload is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // File handling is now done by the VideoUpload and ImageUpload components

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);

            // Prepare data
            let data: CreateVideoRequest | UpdateVideoRequest = {
                title,
                description,
                url: url || undefined,
                file: file || undefined,
                thumbnail: thumbnail || undefined,
            };

            // If creating, add subtopic_id
            if (!isEditMode) {
                (data as CreateVideoRequest).subtopic_id = Number(subtopicId);
            }

            // Send request
            let response;
            if (isEditMode) {
                response = await healthHubService.updateVideo(Number(videoId), data as UpdateVideoRequest);
            } else {
                response = await healthHubService.createVideo(data as CreateVideoRequest);
            }

            if (response.success) {
                showToast(`Video ${isEditMode ? 'updated' : 'created'} successfully`, 'success');
                navigate(`/health-hub/subtopics/${subtopicId}`);
            } else {
                showToast(`Failed to ${isEditMode ? 'update' : 'create'} video`, 'error');
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} video:`, error);
            showToast(`Error ${isEditMode ? 'updating' : 'creating'} video`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loadingVideo) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <LoadingSpinner />
            </Box>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <MuiLink component={Link} to="/health-hub" underline="hover" color="inherit">
                        Health Hub
                    </MuiLink>
                    {currentSubtopic && (
                        <MuiLink
                            component={Link}
                            to={`/health-hub/topics/${currentSubtopic.parent_topic_id}`}
                            underline="hover"
                            color="inherit"
                        >
                            {currentSubtopic.topic_name}
                        </MuiLink>
                    )}
                    <MuiLink
                        component={Link}
                        to={`/health-hub/subtopics/${subtopicId}`}
                        underline="hover"
                        color="inherit"
                    >
                        {currentSubtopic?.name || 'Subtopic'}
                    </MuiLink>
                    <Typography color="text.primary">
                        {isEditMode ? 'Edit Video' : 'Add Video'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {isEditMode ? 'Edit Video' : 'Add New Video'}
                    </Typography>

                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/health-hub/subtopics/${subtopicId}`}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to Subtopic
                    </Button>
                </Box>

                <Paper sx={{ p: 3 }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.title}>
                            <TextField
                                label="Video Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                fullWidth
                                required
                                error={!!errors.title}
                            />
                            {errors.title && <FormHelperText>{errors.title}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.url}>

                            {/* Use VideoUpload component */}
                            <VideoUpload
                                label="Video"
                                value={url}
                                displayUrl={url}
                                onChange={(url: string | null, _signedUrl: string | null) => {
                                    setUrl(url || '');
                                    setFile(null); // Clear file reference since URL is set
                                }}
                                accept="video/*"
                                filePath="health_hub/videos"
                                fileName={`video_${Date.now()}`}
                                required={!url}
                                error={!!errors.url}
                            />

                            {errors.url && <FormHelperText>{errors.url}</FormHelperText>}

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                Alternatively, you can provide a direct URL to a hosted video:
                            </Typography>

                            <TextField
                                label="Or enter Video URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                fullWidth
                                placeholder="https://youtube.com/video.mp4"
                                sx={{ mt: 1 }}
                                error={!!errors.url}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>

                            {/* Use ImageUpload component for the thumbnail */}
                            <ImageUpload
                                label="Video Thumbnail Image"
                                value={thumbnail}
                                displayUrl={thumbnail}
                                onChange={(url: string | null, _signedUrl: string | null) => {
                                    setThumbnail(url || '');
                                }}
                                accept="image/*"
                                filePath="health_hub/thumbnails"
                                fileName={`thumbnail_${Date.now()}`}
                            />
                        </FormControl>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                            <Button
                                variant="outlined"
                                component={Link}
                                to={`/health-hub/subtopics/${subtopicId}`}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isEditMode ? 'Update Video' : 'Add Video'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default VideoFormPage;