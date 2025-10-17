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
import { CreatePodcastRequest, UpdatePodcastRequest } from '../../types/healthHub';

const PodcastFormPage: React.FC = () => {
    const { subtopicId, podcastId } = useParams<{ subtopicId: string; podcastId: string }>();
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
    const [loadingPodcast, setLoadingPodcast] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const isEditMode = Boolean(podcastId);

    useEffect(() => {
        if (isEditMode) {
            loadPodcast();
        }
    }, [podcastId]);

    const loadPodcast = async () => {
        if (!podcastId) return;

        try {
            setLoadingPodcast(true);
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.getPodcastById(Number(podcastId));

            if (response.success) {
                const podcast = response.data;
                setTitle(podcast.title);
                setDescription(podcast.description || '');
                setUrl(podcast.url);
                setThumbnail(podcast.thumbnail || '');
            } else {
                showToast('Failed to load podcast', 'error');
                navigate(`/health-hub/subtopics/${subtopicId}`);
            }
        } catch (error) {
            console.error('Error loading podcast:', error);
            showToast('Error loading podcast', 'error');
            navigate(`/health-hub/subtopics/${subtopicId}`);
        } finally {
            setLoadingPodcast(false);
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
            let data: CreatePodcastRequest | UpdatePodcastRequest = {
                title,
                description,
                url: url || undefined,
                file: file || undefined,
                thumbnail: thumbnail || undefined,
            };

            // If creating, add subtopic_id
            if (!isEditMode) {
                (data as CreatePodcastRequest).subtopic_id = Number(subtopicId);
            }

            // Send request
            let response;
            if (isEditMode) {
                response = await healthHubService.updatePodcast(Number(podcastId), data as UpdatePodcastRequest);
            } else {
                response = await healthHubService.createPodcast(data as CreatePodcastRequest);
            }

            if (response.success) {
                showToast(`Podcast ${isEditMode ? 'updated' : 'created'} successfully`, 'success');
                navigate(`/health-hub/subtopics/${subtopicId}`);
            } else {
                showToast(`Failed to ${isEditMode ? 'update' : 'create'} podcast`, 'error');
            }
        } catch (error) {
            console.error(`Error ${isEditMode ? 'updating' : 'creating'} podcast:`, error);
            showToast(`Error ${isEditMode ? 'updating' : 'creating'} podcast`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (loadingPodcast) {
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
                            {currentSubtopic.parent_topic}
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
                        {isEditMode ? 'Edit Podcast' : 'Add Podcast'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        {isEditMode ? 'Edit Podcast' : 'Add New Podcast'}
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
                                label="Podcast Title"
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

                            {/* Use VideoUpload component with audio accept type */}
                            <VideoUpload
                                label="Audio"
                                value={url}
                                displayUrl={url}
                                onChange={(url: string | null, _signedUrl: string | null) => {
                                    setUrl(url || '');
                                    setFile(null); // Clear file reference since URL is set
                                }}
                                accept="audio/*"
                                filePath="health_hub/podcasts"
                                fileName={`podcast_${Date.now()}`}
                                required={!url}
                                error={!!errors.url}
                            />

                            {errors.url && <FormHelperText>{errors.url}</FormHelperText>}

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                Alternatively, you can provide a direct URL to a hosted audio file:
                            </Typography>

                            <TextField
                                label="Or enter Audio URL"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                fullWidth
                                placeholder="Add audio URL"
                                sx={{ mt: 1 }}
                                error={!!errors.url}
                            />
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 3 }}>

                            {/* Use ImageUpload component for the thumbnail */}
                            <ImageUpload
                                label="Cover Image"
                                value={thumbnail}
                                displayUrl={thumbnail}
                                onChange={(url: string | null, _signedUrl: string | null) => {
                                    setThumbnail(url || '');
                                }}
                                accept="image/*"
                                filePath="health_hub/covers"
                                fileName={`cover_${Date.now()}`}
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
                                {isEditMode ? 'Update Podcast' : 'Add Podcast'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default PodcastFormPage;