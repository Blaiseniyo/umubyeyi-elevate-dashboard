import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Card,
    CardContent,
    CardActionArea,
    CardMedia,
    CardActions,
    TextField,
    InputAdornment,
    IconButton,
    Divider,
    Breadcrumbs,
    Link as MuiLink,
    Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTopicById } from '../../store/slices/healthHubSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Subtopic } from '../../types/healthHub';
// SubtopicDialog no longer used

const TopicDetailPage: React.FC = () => {
    const { topicId } = useParams<{ topicId: string }>();
    const dispatch = useAppDispatch();
    const { currentTopic, loading, error } = useAppSelector(state => state.healthHub);
    const [filteredSubtopics, setFilteredSubtopics] = useState<Subtopic[]>([]);
    const [search, setSearch] = useState<string>('');
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        if (topicId) {
            dispatch(fetchTopicById(Number(topicId)));
        }
    }, [dispatch, topicId]);

    useEffect(() => {
        if (error) {
            showToast('Error fetching topic', 'error');
        }
    }, [error, showToast]);

    // Filter subtopics based on search
    useEffect(() => {
        if (currentTopic?.subtopics && currentTopic.subtopics.length > 0) {
            if (search.trim() !== '') {
                const searchLower = search.toLowerCase();
                const filtered = currentTopic.subtopics.filter(subtopic =>
                    subtopic.name.toLowerCase().includes(searchLower) ||
                    subtopic.description.toLowerCase().includes(searchLower)
                );
                setFilteredSubtopics(filtered);
            } else {
                setFilteredSubtopics(currentTopic.subtopics);
            }
        } else {
            setFilteredSubtopics([]);
        }
    }, [currentTopic, search]);

    const navigateToSubtopicForm = (subtopic?: Subtopic) => {
        if (subtopic) {
            navigate(`/health-hub/topics/${topicId}/subtopics/${subtopic.id}/edit`);
        } else {
            navigate(`/health-hub/topics/${topicId}/subtopics/create`);
        }
    };

    // We no longer need these functions since we're using page navigation
    // instead of a dialog for subtopic creation/editing

    const handleDeleteSubtopic = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this subtopic? This will also delete all sections and subsections within.')) {
            try {
                // Use the healthHubService directly since we haven't implemented
                // subtopic delete action in the Redux slice yet
                const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
                const response = await healthHubService.deleteSubtopic(id);

                if (response.success) {
                    showToast('Subtopic deleted successfully', 'success');
                    // Refresh the topic data
                    dispatch(fetchTopicById(Number(topicId)));
                } else {
                    showToast('Failed to delete subtopic', 'error');
                }
            } catch (error) {
                console.error('Error deleting subtopic:', error);
                showToast('Error deleting subtopic', 'error');
            }
        }
    };

    const navigateToSubtopic = (id: number) => {
        navigate(`/health-hub/subtopics/${id}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <LoadingSpinner />
            </Box>
        );
    }

    if (!currentTopic) {
        return (
            <Container>
                <Typography variant="h6">Topic not found</Typography>
                <Button component={Link} to="/health-hub" startIcon={<ArrowBackIcon />}>
                    Back to Topics
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <MuiLink component={Link} to="/health-hub" underline="hover" color="inherit">
                        Health Hub
                    </MuiLink>
                    <Typography color="text.primary">{currentTopic.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {currentTopic.name}
                        </Typography>
                        {currentTopic.description && (
                            <Typography variant="body1" color="text.secondary" paragraph>
                                {currentTopic.description}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        variant="outlined"
                        component={Link}
                        to="/health-hub"
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to Topics
                    </Button>
                </Box>

                <Paper sx={{ p: 3, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Subtopics
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                        <TextField
                            placeholder="Search subtopics..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            sx={{ width: '60%' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            size="small"
                        />

                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigateToSubtopicForm()}
                        >
                            Add New Subtopic
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {filteredSubtopics.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">No subtopics found</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                {search ? 'Try a different search term or' : 'Get started by'} creating a new subtopic
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                startIcon={<AddIcon />}
                                onClick={() => navigateToSubtopicForm()}
                            >
                                Add New Subtopic
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 3 }}>
                            {filteredSubtopics.map((subtopic: Subtopic) => (
                                <Card
                                    key={subtopic.id}
                                    elevation={2}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100%',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6
                                        }
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => navigateToSubtopic(subtopic.id)}
                                        sx={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'stretch' }}
                                    >
                                        {subtopic.thumbnail && (
                                            <CardMedia
                                                component="img"
                                                sx={{ height: 180, objectFit: 'cover' }}
                                                image={subtopic.signed_thumbnail || subtopic.thumbnail}
                                                alt={subtopic.name}
                                            />
                                        )}
                                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h6" component="div" fontWeight="500">
                                                    {subtopic.name}
                                                </Typography>
                                                {subtopic.duration && (
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            bgcolor: 'primary.light',
                                                            color: 'primary.contrastText',
                                                            px: 1,
                                                            py: 0.5,
                                                            borderRadius: 1,
                                                            fontWeight: 'medium'
                                                        }}
                                                    >
                                                        {subtopic.duration}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                                <Box
                                                    sx={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: '50%',
                                                        bgcolor: 'success.main',
                                                        mr: 1
                                                    }}
                                                />
                                                <Typography variant="body2" color="text.secondary">
                                                    {subtopic.sections?.length || 0} {subtopic.sections?.length === 1 ? 'Section' : 'Sections'}
                                                </Typography>
                                            </Box>

                                            {subtopic.sections && subtopic.sections.length > 0 && (
                                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                    {subtopic.sections.slice(0, 2).map((section) => (
                                                        <Chip
                                                            key={section.id}
                                                            label={section.name}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                bgcolor: 'background.paper',
                                                                borderColor: 'divider'
                                                            }}
                                                        />
                                                    ))}
                                                    {subtopic.sections.length > 2 && (
                                                        <Chip
                                                            label={`+${subtopic.sections.length - 2} more`}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{
                                                                bgcolor: 'background.paper',
                                                                borderColor: 'divider'
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                        </CardContent>
                                    </CardActionArea>
                                    <Divider />
                                    <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                        <Button
                                            size="small"
                                            onClick={() => navigateToSubtopic(subtopic.id)}
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            View Content
                                        </Button>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigateToSubtopicForm(subtopic);
                                                }}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteSubtopic(subtopic.id);
                                                }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>

            {/* SubtopicDialog removed - using page navigation instead */}
        </Container>
    );
};

export default TopicDetailPage;