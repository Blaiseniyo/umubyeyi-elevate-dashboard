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

const HealthHubManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const { topics, loading } = useAppSelector(state => state.healthHub);
    const [search, setSearch] = useState<string>('');
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const { showToast } = useToast();
    const navigate = useNavigate();

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

    const handleSaveTopic = async (topicData: { name: string; description: string }) => {
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

    const handleDeleteTopic = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this topic? This will also delete all subtopics and content within.')) {
            try {
                await dispatch(deleteTopic(id));
                showToast('Topic deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting topic:', error);
                showToast('Error deleting topic', 'error');
            }
        }
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
                                                mb: 2,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                minHeight: '4.5em'
                                            }}
                                        >
                                            {topic.description || 'No description provided'}
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
                                                {topic.subtopics?.length || 0} {topic.subtopics?.length === 1 ? 'Subtopic' : 'Subtopics'}
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
                                                handleDeleteTopic(topic.id);
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
        </Container>
    );
};

export default HealthHubManagement;