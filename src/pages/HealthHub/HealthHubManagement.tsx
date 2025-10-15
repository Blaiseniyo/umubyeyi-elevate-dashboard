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
    CardActions,
    TextField,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { Topic } from '../../types/healthHub';
import { useToast } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchTopics, createTopic, updateTopic, deleteTopic } from '../../store/slices/healthHubSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import TopicDialog from '../../pages/HealthHub/TopicDialog';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

const HealthHubManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { topics, loading } = useAppSelector(state => state.healthHub);
    const [search, setSearch] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

    // Confirmation dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [topicToDelete, setTopicToDelete] = useState<{ id: number, name: string } | null>(null);

    // Load topics directly with useEffect below

    useEffect(() => {
        dispatch(fetchTopics({
            search: search.trim() !== '' ? search : undefined
        })).unwrap()
            .catch(err => {
                console.error('Error fetching topics:', err);
                showToast('Failed to load topics', 'error');
            });
    }, [dispatch, search, showToast]);

    const handleOpenDialog = (topic?: Topic) => {
        setSelectedTopic(topic || null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTopic(null);
    };

    const handleSaveTopic = async (topicData: { name: string }) => {
        try {
            if (selectedTopic) {
                await dispatch(updateTopic({
                    id: selectedTopic.id,
                    data: topicData
                }));
                showToast('Topic updated successfully', 'success');
            } else {
                await dispatch(createTopic(topicData));
                showToast('Topic created successfully', 'success');
            }
            handleCloseDialog();
        } catch (error) {
            console.error(`Error ${selectedTopic ? 'updating' : 'creating'} topic:`, error);
            showToast(`Error ${selectedTopic ? 'updating' : 'creating'} topic`, 'error');
        }
    };

    const openDeleteConfirmation = (id: number, name: string) => {
        setTopicToDelete({ id, name });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!topicToDelete) return;

        try {
            await dispatch(deleteTopic(topicToDelete.id));
            showToast('Topic deleted successfully', 'success');

            // Reload the topics list with fresh data after deletion
            await dispatch(fetchTopics({
                search: search.trim() !== '' ? search : undefined
            }));

            // Force a refresh of the UI by updating the search term slightly and then reverting
            if (search.trim() === '') {
                setSearch(' ');
                setTimeout(() => setSearch(''), 10);
            } else {
                setSearch(prev => prev + ' ');
                setTimeout(() => setSearch(prev => prev.trim()), 10);
            }
        } catch (error) {
            console.error('Error deleting topic:', error);
            showToast('Error deleting topic', 'error');
        } finally {
            setDeleteDialogOpen(false);
            setTopicToDelete(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setTopicToDelete(null);
    };

    const handleDeleteTopic = (id: number, name: string) => {
        openDeleteConfirmation(id, name);
    };

    const navigateToTopic = (id: number) => {
        navigate(`/health-hub/topics/${id}`);
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Health Hub Management
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" paragraph>
                    Create and manage health hub topics and courses
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <TextField
                        placeholder="Search topics..."
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
                        onClick={() => handleOpenDialog()}
                    >
                        Add New Topic
                    </Button>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <LoadingSpinner />
                    </Box>
                ) : topics.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="h6">No topics found</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {search ? 'Try a different search term or' : 'Get started by'} creating a new topic
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenDialog()}
                        >
                            Add New Topic
                        </Button>
                    </Paper>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                        {topics.map((topic) => (
                            <Card
                                key={topic.id}
                                elevation={2}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 6
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        height: 12,
                                        bgcolor: 'primary.main',
                                        width: '100%'
                                    }}
                                />
                                <CardActionArea
                                    onClick={() => navigateToTopic(topic.id)}
                                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                                >
                                    <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                                        <Typography
                                            variant="h6"
                                            component="div"
                                            gutterBottom
                                            sx={{ fontWeight: 500 }}
                                        >
                                            {topic.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                mb: 1,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '3em'
                                            }}
                                        >
                                            Created by {topic.created_by || 'Anonymous'}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ display: 'block', mb: 2 }}
                                        >
                                            Created: {new Date(topic.created_at).toLocaleDateString()}
                                        </Typography>

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1.5,
                                            bgcolor: 'background.default',
                                            borderRadius: 1,
                                            mt: 'auto'
                                        }}>
                                            <FolderIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                                            <Typography variant="body2" fontWeight="medium">
                                                {topic.sub_topics?.length || topic.subtopics?.length || 0} {(topic.sub_topics?.length || topic.subtopics?.length || 0) === 1 ? 'Subtopic' : 'Subtopics'}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                <Divider />
                                <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                                    <Button
                                        size="small"
                                        onClick={() => navigateToTopic(topic.id)}
                                        endIcon={<ArrowForwardIcon />}
                                        sx={{ fontWeight: 'medium' }}
                                    >
                                        Explore
                                    </Button>
                                    <Box>
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenDialog(topic);
                                            }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteTopic(topic.id, topic.name);
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
            </Box>

            <TopicDialog
                open={openDialog}
                onClose={handleCloseDialog}
                onSave={handleSaveTopic}
                topic={selectedTopic}
            />

            {/* Confirmation Dialog for Delete Actions */}
            <ConfirmDialog
                open={deleteDialogOpen}
                title="Delete Topic"
                message={topicToDelete ? `Are you sure you want to delete "${topicToDelete.name}"? This will also delete all subtopics and content within.` : "Are you sure you want to delete this topic?"}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
            />
        </Container>
    );
};

export default HealthHubManagement;