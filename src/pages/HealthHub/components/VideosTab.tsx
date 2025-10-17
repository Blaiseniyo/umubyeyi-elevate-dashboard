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
import { Video } from '../../../types/healthHub';

interface VideosTabProps {
    subtopicId: string;
    videos: Video[];
    loadingVideos?: boolean;
    handleDeleteVideo: (id: number) => void;
}

const VideosTab: React.FC<VideosTabProps> = ({
    subtopicId,
    videos,
    loadingVideos,
    handleDeleteVideo
}) => {
    const navigate = useNavigate();

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">Videos</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/videos/create`)}
                >
                    Add New Video
                </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* {loadingVideos ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <LoadingSpinner />
                </Box>
            ) :  */}
            {videos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6">No videos found</Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Get started by uploading a new video
                    </Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2 }}
                        startIcon={<AddIcon />}
                        onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/videos/create`)}
                    >
                        Add New Video
                    </Button>
                </Box>
            ) : (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {videos.map((video) => (
                        <Paper
                            key={video.id}
                            sx={{
                                width: '100%',
                                maxWidth: '350px',
                                overflow: 'hidden',
                                position: 'relative',
                                '&:hover .video-actions': { opacity: 1 }
                            }}
                        >
                            <Box
                                sx={{
                                    position: 'relative',
                                    paddingTop: '56.25%', // 16:9 aspect ratio
                                    backgroundImage: `url(${video.thumbnail || 'https://via.placeholder.com/350x200'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}
                            >
                                <Box
                                    className="video-actions"
                                    sx={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 0,
                                        padding: 1,
                                        display: 'flex',
                                        gap: 0.5,
                                        opacity: 0,
                                        transition: 'opacity 0.3s',
                                        background: 'rgba(0,0,0,0.5)',
                                        borderRadius: '0 0 0 8px'
                                    }}
                                >
                                    <IconButton
                                        size="small"
                                        sx={{ color: 'white' }}
                                        onClick={() => navigate(`/health-hub/subtopics/${subtopicId}/videos/${video.id}/edit`)}
                                    >
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        sx={{ color: 'white' }}
                                        onClick={() => handleDeleteVideo(video.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{ p: 2 }}>
                                <Typography variant="subtitle1" gutterBottom noWrap>
                                    {video.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Duration: {video.duration || '00:00'}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            )}
        </>
    );
};

export default VideosTab;