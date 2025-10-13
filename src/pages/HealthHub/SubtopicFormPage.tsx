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
    const { currentTopic, currentSubtopic, loading } = useAppSelector(state => state.healthHub);
    const { showToast } = useToast();

    // Form state
    const [name, setName] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Error state
    const [errors, setErrors] = useState({
        name: '',
        thumbnail: '',
        description: '',
        duration: ''
    });

    // Fetch topic data if needed
    useEffect(() => {
        if (topicId) {
            dispatch(fetchTopicById(Number(topicId)));
        }
    }, [dispatch, topicId]);

    // If editing existing subtopic, load its data
    useEffect(() => {
        if (subtopicId && currentSubtopic) {
            setName(currentSubtopic.name || '');
            setThumbnail(currentSubtopic.thumbnail || '');
            setDescription(currentSubtopic.description || '');
            setDuration(currentSubtopic.duration || '');
        } else {
            // Reset form for new subtopic
            setName('');
            setThumbnail('');
            setDescription('');
            setDuration('');
        }
    }, [subtopicId, currentSubtopic]);

    // Handle image upload/remove
    const handleImageUpload = (url: string) => {
        setThumbnail(url);
        setErrors({ ...errors, thumbnail: '' });
    };

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = {
            name: '',
            thumbnail: '',
            description: '',
            duration: ''
        };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!thumbnail) {
            newErrors.thumbnail = 'Thumbnail image is required';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (!duration.trim()) {
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
            let response;

            const subtopicData = {
                name,
                thumbnail,
                description,
                duration,
                topic_id: Number(topicId)
            };

            if (subtopicId) {
                // Update existing subtopic
                response = await healthHubService.updateSubtopic(Number(subtopicId), subtopicData);
            } else {
                // Create new subtopic
                response = await healthHubService.createSubtopic(subtopicData);
            }

            if (response.success) {
                showToast(`Subtopic ${subtopicId ? 'updated' : 'created'} successfully`, 'success');
                navigate(`/health-hub/topics/${topicId}`);
            } else {
                showToast(`Failed to ${subtopicId ? 'update' : 'create'} subtopic`, 'error');
            }
        } catch (error) {
            console.error(`Error ${subtopicId ? 'updating' : 'creating'} subtopic:`, error);
            showToast(`Error ${subtopicId ? 'updating' : 'creating'} subtopic`, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
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
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors({ ...errors, name: '' });
                                }}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Duration<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                fullWidth
                                value={duration}
                                onChange={(e) => {
                                    setDuration(e.target.value);
                                    setErrors({ ...errors, duration: '' });
                                }}
                                error={Boolean(errors.duration)}
                                helperText={errors.duration || "e.g. '30min', '2h'"}
                                required
                                placeholder="15min"
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle1" gutterBottom>
                                Thumbnail Image<span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                <ImageUpload
                                    label="" /* Using Typography label instead */
                                    value={thumbnail}
                                    displayUrl={thumbnail}
                                    onChange={(url, _signedUrl) => {
                                        // Using underscore prefix to indicate intentionally unused parameter
                                        handleImageUpload(url || '');
                                    }}
                                    filePath="health_hub/thumbnails"
                                    fileName={`subtopic_${subtopicId ? subtopicId : Date.now()}`}
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
                                <RichTextEditor
                                    label="" /* Remove duplicate label */
                                    value={description}
                                    onChange={(content) => {
                                        setDescription(content);
                                        setErrors({ ...errors, description: '' });
                                    }}
                                    error={Boolean(errors.description)}
                                />
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