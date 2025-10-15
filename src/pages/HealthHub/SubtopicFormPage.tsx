import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    TextField,
    FormHelperText,
    Breadcrumbs,
    Link as MuiLink,
    CircularProgress
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTopicById } from '../../store/slices/healthHubSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import ImageUpload from '../../components/Common/ImageUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const SubtopicFormPage: React.FC = () => {
    const { topicId, subtopicId } = useParams<{ topicId: string; subtopicId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentTopic, loading } = useAppSelector(state => state.healthHub);

    const { showToast } = useToast();

    // Add a counter to track subtopic changes for key generation
    const [subtopicChangeCounter, setSubtopicChangeCounter] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        thumbnail: '',
        description: '',
        duration: ''
    });

    // Error state
    const [errors, setErrors] = useState({
        name: '',
        thumbnail: '',
        description: '',
        duration: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Effect to increment subtopic counter when subtopicId changes
    useEffect(() => {
        // Increment the counter to force rich text editor to re-render
        console.log('SubtopicId changed, incrementing counter');
        setSubtopicChangeCounter(prev => prev + 1);

        // Don't clear form data here - let the data fetching handle that
        // This prevents the form from being cleared before new data is fetched
    }, [subtopicId]);

    // Separate useEffect for data fetching
    useEffect(() => {
        // Track if the component is still mounted
        let isMounted = true;

        // Clear form data at the beginning of data fetching
        // This ensures we don't show stale data while loading
        setFormData({
            name: '',
            thumbnail: '',
            description: '',
            duration: ''
        });

        const fetchData = async () => {
            try {
                // Always fetch the topic for breadcrumb navigation
                if (topicId) {
                    await dispatch(fetchTopicById(Number(topicId)));
                }

                // If editing, fetch the subtopic directly from the API
                if (subtopicId && isMounted) {
                    console.log(`Fetching data for subtopic ${subtopicId}...`);
                    const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
                    const response = await healthHubService.getSubtopicById(Number(subtopicId));

                    // Only update state if component is still mounted
                    if (response.success && response.data && isMounted) {
                        const subtopicData = response.data;

                        // Extract content properly and validate
                        const contentValue = subtopicData.content || '';

                        if (isMounted) {
                            // Explicitly set form data with the API response
                            const newFormData = {
                                name: subtopicData.name || '',
                                thumbnail: subtopicData.cover_image_url || '',
                                description: contentValue,
                                duration: subtopicData.course_duration_minutes
                                    ? subtopicData.course_duration_minutes.toString()
                                    : '',
                            };

                            // First update with a small delay to ensure the component has time to remount
                            setTimeout(() => {
                                if (isMounted) {
                                    setFormData(newFormData);

                                    // Verify the form data was set correctly
                                    console.log('Form data set to:', {
                                        name: subtopicData.name,
                                        description: contentValue,
                                        duration: subtopicData.course_duration_minutes,
                                        thumbnail: subtopicData.cover_image_url
                                    });

                                    // Force a re-render of the rich text editor
                                    setSubtopicChangeCounter(prev => prev + 1);
                                }
                            }, 50);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                if (isMounted) {
                    showToast('Failed to load data. Please try again.', 'error');
                }
            }
        };

        fetchData();

        // Cleanup function to prevent updates on unmounted component
        return () => {
            isMounted = false;
        };
    }, [dispatch, topicId, subtopicId, showToast]);

    // Handle form field changes
    const handleChange = (field: string, value: string) => {

        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            return newData;
        });

        setErrors(prev => ({
            ...prev,
            [field]: ''
        }));
    };

    // Handle image upload
    const handleImageUpload = (url: string) => {
        handleChange('thumbnail', url);
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = {
            name: '',
            thumbnail: '',
            description: '',
            duration: ''
        };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!formData.thumbnail) {
            newErrors.thumbnail = 'Thumbnail image is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (!formData.duration.trim()) {
            newErrors.duration = 'Duration is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);

            // Ensure numeric duration is valid
            const durationValue = parseInt(formData.duration, 10);
            if (isNaN(durationValue) || durationValue <= 0) {
                setErrors(prev => ({ ...prev, duration: 'Please enter a valid duration' }));
                return;
            }

            const subtopicData = {
                name: formData.name.trim(),
                cover_image_url: formData.thumbnail,
                content: formData.description.trim(),
                course_duration_minutes: durationValue
            };

            console.log('Submitting subtopic data:', subtopicData);

            let response;
            if (subtopicId) {
                // Update existing subtopic
                response = await healthHubService.updateSubtopic(Number(subtopicId), subtopicData);
            } else {
                // Create new subtopic
                response = await healthHubService.createSubtopic(Number(topicId), subtopicData);
            }

            if (response.success) {
                showToast(`Subtopic ${subtopicId ? 'updated' : 'created'} successfully`, 'success');
                navigate(`/health-hub/topics/${topicId}`);
            } else {
                showToast(`Failed to ${subtopicId ? 'update' : 'create'} subtopic: ${response.message || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error(`Error ${subtopicId ? 'updating' : 'creating'} subtopic:`, error);
            showToast(`Error ${subtopicId ? 'updating' : 'creating'} subtopic`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Only show loading spinner when initially loading data, not during submission
    if (loading && !isSubmitting) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                {/* Breadcrumbs */}
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={Link} to="/health-hub" underline="hover" color="inherit">
                        Health Hub
                    </MuiLink>
                    {currentTopic && (
                        <MuiLink
                            component={Link}
                            to={`/health-hub/topics/${topicId}`}
                            underline="hover"
                            color="inherit"
                        >
                            {currentTopic.name}
                        </MuiLink>
                    )}
                    <Typography color="text.primary">
                        {subtopicId ? 'Edit Subtopic' : 'New Subtopic'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        {subtopicId ? 'Edit Subtopic' : 'Create New Subtopic'}
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate(`/health-hub/topics/${topicId}`)}
                    >
                        Back to Topic
                    </Button>
                </Box>

                <Paper sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Subtopic Name<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Duration (minutes)<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                value={formData.duration}
                                onChange={(e) => {
                                    // Only allow numeric input
                                    const value = e.target.value;
                                    if (value === '' || /^[0-9]+$/.test(value)) {
                                        handleChange('duration', value);
                                    }
                                }}
                                error={Boolean(errors.duration)}
                                helperText={errors.duration || "Enter duration in minutes (e.g. 30 for 30 minutes)"}
                                required
                                placeholder="30"
                                type="number"
                                inputProps={{ min: 1 }}
                            />
                        </Box>

                        <Box>
                            <Box sx={{ mb: 2 }}>
                                {/* Using key to force component re-render when thumbnail changes */}
                                <ImageUpload
                                    key={formData.thumbnail || 'empty-image'}
                                    label="Cover Image"
                                    value={formData.thumbnail}
                                    displayUrl={formData.thumbnail}
                                    onChange={(url, _signedUrl) => {
                                        handleImageUpload(url || '');
                                    }}
                                    filePath="HealthHub/sub-topics"
                                    fileName={`${formData.name.replace(/\s+/g, '-') || `subtopic_${Date.now()}`}`}
                                    required={true}
                                    error={Boolean(errors.thumbnail)}
                                />
                                {errors.thumbnail && (
                                    <FormHelperText error>{errors.thumbnail}</FormHelperText>
                                )}
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Description<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <Box>
                                {/* Use conditional rendering to ensure the editor is created after we have content */}

                                {/* Use separate key strategies for new vs edit mode */}
                                {subtopicId ? (
                                    <RichTextEditor
                                        label=""
                                        key={`edit-${subtopicId}-${subtopicChangeCounter}`}
                                        value={formData.description || ''}
                                        onChange={(content) => {
                                            handleChange('description', content);
                                        }}
                                        error={Boolean(errors.description)}
                                        placeholder="Enter description here..."
                                    />
                                ) : (
                                    <RichTextEditor
                                        label=""
                                        key="new-subtopic"
                                        value={formData.description || ''}
                                        onChange={(content) => {
                                            handleChange('description', content);
                                        }}
                                        error={Boolean(errors.description)}
                                        placeholder="Enter description here..."
                                    />
                                )}
                                {errors.description && (
                                    <FormHelperText error>{errors.description}</FormHelperText>
                                )}
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button
                                variant="outlined"
                                sx={{ mr: 2 }}
                                onClick={() => navigate(`/health-hub/topics/${topicId}`)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <CircularProgress size={24} />
                                ) : subtopicId ? (
                                    'Update Subtopic'
                                ) : (
                                    'Create Subtopic'
                                )}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default SubtopicFormPage;