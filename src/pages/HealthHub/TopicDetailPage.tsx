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
    Link as MuiLink
} from '@mui/material';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import VideocamIcon from '@mui/icons-material/Videocam';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
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

    // Confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteItemType, setDeleteItemType] = useState<'subtopic' | 'topic'>('subtopic');
    const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
    const [deleteItemName, setDeleteItemName] = useState('');

    // Use location to detect when we need to reload data
    const location = useLocation();

    useEffect(() => {
        if (topicId) {
            console.log('Fetching topic data for ID:', topicId);
            dispatch(fetchTopicById(Number(topicId)));
        }
    }, [dispatch, topicId, location.key]); // location.key changes on navigation

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
                    (subtopic.content && subtopic.content.toLowerCase().includes(searchLower))
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

    const openDeleteConfirmation = (id: number, name: string, type: 'subtopic' | 'topic') => {
        setDeleteItemId(id);
        setDeleteItemName(name);
        setDeleteItemType(type);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!deleteItemId) return;

        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            let response;

            if (deleteItemType === 'subtopic') {
                response = await healthHubService.deleteSubtopic(deleteItemId);
                if (response.success) {
                    showToast('Subtopic deleted successfully', 'success');
                    // Refresh the topic data to show updated subtopics
                    await dispatch(fetchTopicById(Number(topicId)));
                    // Force a re-render by updating the search term slightly
                    setSearch(search => search + " ");
                    setTimeout(() => setSearch(search => search.trim()), 10);
                } else {
                    showToast('Failed to delete subtopic', 'error');
                }
            } else if (deleteItemType === 'topic' && topicId) {
                response = await healthHubService.deleteTopic(deleteItemId);
                if (response.success) {
                    showToast('Topic deleted successfully', 'success');
                    // Navigate back to the topics list with a refresh parameter to force data reload
                    navigate('/health-hub?refresh=' + Date.now());
                } else {
                    showToast('Failed to delete topic', 'error');
                }
            }
        } catch (error) {
            console.error(`Error deleting ${deleteItemType}:`, error);
            showToast(`Error deleting ${deleteItemType}`, 'error');
        } finally {
            setDeleteDialogOpen(false);
            setDeleteItemId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setDeleteItemId(null);
    };

    const handleDeleteSubtopic = (id: number, name: string = '') => {
        openDeleteConfirmation(id, name || `Subtopic #${id}`, 'subtopic');
    };

    const handleDeleteTopic = (id: number, name: string = '') => {
        openDeleteConfirmation(id, name || `Topic #${id}`, 'topic');
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
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleDeleteTopic(Number(topicId), currentTopic.name)}
                            startIcon={<DeleteIcon />}
                        >
                            Delete Topic
                        </Button>
                        <Button
                            variant="outlined"
                            component={Link}
                            to="/health-hub"
                            startIcon={<ArrowBackIcon />}
                        >
                            Back to Topics
                        </Button>
                    </Box>
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
                                        {subtopic.cover_image_url && (
                                            <CardMedia
                                                component="img"
                                                sx={{ height: 180, objectFit: 'cover' }}
                                                image={subtopic.cover_image_url}
                                                alt={subtopic.name}
                                            />
                                        )}
                                        <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Typography variant="h6" component="div" fontWeight="500">
                                                    {subtopic.name}
                                                </Typography>
                                                {subtopic.course_duration && (
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
                                                        {subtopic.course_duration}
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                                                {/* Sections count */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    bgcolor: 'success.light',
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    py: 0.5
                                                }}>
                                                    <LibraryBooksIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'success.dark',
                                                            mr: 0.5
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="success.dark" fontWeight="medium">
                                                        {subtopic.sections?.length || 0} {subtopic.sections?.length === 1 ? 'Section' : 'Sections'}
                                                    </Typography>
                                                </Box>

                                                {/* Videos count */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    bgcolor: 'info.light',
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    py: 0.5
                                                }}>
                                                    <VideocamIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'info.dark',
                                                            mr: 0.5
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="info.dark" fontWeight="medium">
                                                        {subtopic.videos?.length || 0} {subtopic.videos?.length === 1 ? 'Video' : 'Videos'}
                                                    </Typography>
                                                </Box>

                                                {/* Podcasts count */}
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    bgcolor: 'warning.light',
                                                    borderRadius: 1,
                                                    px: 1.5,
                                                    py: 0.5
                                                }}>
                                                    <HeadphonesIcon
                                                        fontSize="small"
                                                        sx={{
                                                            color: 'warning.dark',
                                                            mr: 0.5
                                                        }}
                                                    />
                                                    <Typography variant="body2" color="warning.dark" fontWeight="medium">
                                                        {subtopic.podcasts?.length || 0} {subtopic.podcasts?.length === 1 ? 'Podcast' : 'Podcasts'}
                                                    </Typography>
                                                </Box>
                                            </Box>
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
                                                    handleDeleteSubtopic(subtopic.id, subtopic.name);
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

            {/* Confirmation Dialog for Delete Actions */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title={`Delete ${deleteItemType === 'topic' ? 'Topic' : 'Subtopic'}`}
                message={`Are you sure you want to delete ${deleteItemName}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
            />
        </Container>
    );
};

export default TopicDetailPage;