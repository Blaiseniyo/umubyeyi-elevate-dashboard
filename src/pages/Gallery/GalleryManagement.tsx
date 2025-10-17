import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardActions,
    Button,
    Pagination,
    Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Visibility as VisibilityIcon,
    VisibilityOff as VisibilityOffIcon,
    PhotoAlbum as PhotoAlbumIcon
} from '@mui/icons-material';

// Create a grid layout using styled components
const GridContainer = styled(Box)(({ theme }) => ({
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateColumns: 'repeat(1, 1fr)',
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)',
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)',
    },
    [theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(4, 1fr)',
    },
}));
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useToast } from '../../hooks/useToast';
import { fetchGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from '../../store/slices/gallerySlice';
import ImageDialog from './ImageDialog';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

const GalleryManagement: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { images, loading, error, totalItems, currentPage, itemsPerPage } = useAppSelector(state => state.gallery);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState<number | null>(null);

    useEffect(() => {
        loadImages();
    }, [currentPage]);

    // Function to load images
    const loadImages = () => {
        const filters = {
            page: currentPage,
            limit: itemsPerPage
        };

        dispatch(fetchGalleryImages(filters));
    };

    // Handle page change
    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        dispatch({
            type: 'gallery/setCurrentPage',
            payload: value
        });
    };

    // Toggle publish status
    const handleTogglePublish = async (image: any) => {
        try {
            await dispatch(updateGalleryImage({
                id: image.id,
                data: {
                    is_published: !image.is_published
                }
            })).unwrap();

            showToast('Image status updated successfully', 'success');
        } catch (error) {
            showToast('Failed to update image status', 'error');
        }
    };

    // Save new image
    const handleSaveImage = async (data: { image_url: string }) => {
        try {
            // Create new image
            await dispatch(createGalleryImage({ image_url: data.image_url })).unwrap();
            showToast('Image added successfully', 'success');
            setDialogOpen(false);
        } catch (error) {
            showToast('Failed to save image', 'error');
        }
    };

    // Delete image
    const handleDeleteConfirm = async () => {
        if (imageToDelete !== null) {
            try {
                await dispatch(deleteGalleryImage(imageToDelete)).unwrap();
                showToast('Image deleted successfully', 'success');
            } catch (error) {
                showToast('Failed to delete image', 'error');
            } finally {
                setConfirmDialogOpen(false);
                setImageToDelete(null);
            }
        }
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Render loading skeletons
    const renderSkeletons = () => {
        return Array(itemsPerPage).fill(0).map((_, index) => (
            <Card key={`skeleton-${index}`}>
                <Box sx={{ position: 'relative', paddingTop: '75%' /* 4:3 aspect ratio */ }}>
                    <Skeleton
                        variant="rectangular"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </Box>
            </Card>
        ));
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1">
                        Gallery Management
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            startIcon={<VisibilityIcon />}
                            onClick={() => navigate('/gallery/view')}
                        >
                            View Public Gallery
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                        >
                            Add Image
                        </Button>
                    </Box>
                </Box>

                {error && (
                    <Box sx={{ mt: 2, mb: 2, color: 'error.main' }}>
                        <Typography>{error}</Typography>
                    </Box>
                )}

                {/* Empty state */}
                {!loading && images.length === 0 && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '50vh',
                            textAlign: 'center'
                        }}
                    >
                        <PhotoAlbumIcon fontSize="large" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            No images found
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Add your first image to the gallery using the "Add Image" button above
                        </Typography>
                    </Box>
                )}

                {/* Gallery grid */}
                <GridContainer>
                    {loading ? (
                        renderSkeletons()
                    ) : (
                        images.map(image => (
                            <Card
                                key={image.id}
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: image.is_published ? 'none' : '1px solid #e0e0e0',
                                    backgroundColor: image.is_published ? 'inherit' : 'rgba(245, 245, 245, 0.5)'
                                }}
                            >
                                <Box sx={{ position: 'relative', paddingTop: '75%' /* 4:3 aspect ratio */ }}>
                                    <CardMedia
                                        component="img"
                                        image={image.image_url}
                                        alt="Gallery image"
                                        sx={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    {!image.is_published && (
                                        <Box sx={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'medium'
                                        }}>
                                            Unpublished
                                        </Box>
                                    )}
                                </Box>

                                <Box sx={{ p: 2, pb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Added by: {image.created_by}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Added: {new Date(image.created_at).toLocaleDateString()}
                                    </Typography>
                                </Box>

                                <CardActions sx={{ mt: 'auto', p: 1, pt: 0 }}>
                                    <Button
                                        size="small"
                                        startIcon={image.is_published ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        onClick={() => handleTogglePublish(image)}
                                    >
                                        {image.is_published ? 'Unpublish' : 'Publish'}
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            setImageToDelete(image.id);
                                            setConfirmDialogOpen(true);
                                        }}
                                        sx={{ ml: 'auto' }}
                                    >
                                        Delete
                                    </Button>
                                </CardActions>
                            </Card>
                        ))
                    )}
                </GridContainer>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                )}
            </Box>

            {/* Add Image Dialog */}
            <ImageDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSave={handleSaveImage}
            />

            {/* Confirmation Dialog */}
            <ConfirmDialog
                open={confirmDialogOpen}
                title="Delete Image"
                message="Are you sure you want to delete this image? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setConfirmDialogOpen(false);
                    setImageToDelete(null);
                }}
            />
        </Container>
    );
};

export default GalleryManagement;