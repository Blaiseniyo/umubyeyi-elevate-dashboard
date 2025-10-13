import React from 'react';
import {
    Typography,
    Box,
    Button,
    Divider,
    IconButton,
    Paper
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/Common/LoadingSpinner';
import { Podcast } from '../../../types/healthHub';

interface PodcastsTabProps {
    subtopicId: string;
    podcasts: Podcast[];
    loadingPodcasts: boolean;
    handleDeletePodcast: (id: number) => void;
}

const PodcastsTab: React.FC<PodcastsTabProps> = ({
    subtopicId,
    podcasts,
    loadingPodcasts,
    handleDeletePodcast
}) => {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Podcasts</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/podcasts/create`)}
                >
                    Add New Podcast
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {loadingPodcasts ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <LoadingSpinner />
                </Box>
            ) : podcasts.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6">No podcasts found</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Get started by uploading a new podcast
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/podcasts/create`)}
                    >
                        Add New Podcast
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {podcasts.map((podcast) => (
                        <Paper
                            key={podcast.id}
                            sx={{
                                p: 2,
                                display: 'flex',
                                '&:hover .podcast-actions': { opacity: 1 }
                            }}
                        >
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 1,
                                    backgroundImage: `url(${podcast.thumbnail || 'https://via.placeholder.com/100x100'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    mr: 2
                                }}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" gutterBottom>
                                        {podcast.title}
                                    </Typography>
                                    <Box
                                        className="podcast-actions"
                                        sx={{
                                            display: 'flex',
                                            opacity: 0,
                                            transition: 'opacity 0.3s'
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/podcasts/${podcast.id}/edit`)}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => handleDeletePodcast(podcast.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {podcast.description}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Duration: {podcast.duration || '00:00'}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </>
    );
};

export default PodcastsTab;