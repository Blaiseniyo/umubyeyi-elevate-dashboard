import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Card,
    CardMedia,
    CardActionArea,
    Pagination,
    Skeleton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { PhotoAlbum as PhotoAlbumIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { fetchGalleryImages } from '../../store/slices/gallerySlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ImageLightbox from './ImageLightbox';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

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

const GalleryPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { images, loading, error, totalItems } = useAppSelector(state => state.gallery);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Lightbox state
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Filter out only published images
    const publishedImages = images.filter(image => image.is_published);

    // Fetch gallery images on component mount and when page changes
    useEffect(() => {
        dispatch(fetchGalleryImages({
            page: currentPage,
            limit: itemsPerPage,
            // Only show published images on the public gallery page
            is_published: true
        }));
    }, [dispatch, currentPage]);

    // Handle page change
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
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

    if (loading && images.length === 0) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ mt: 3, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" component="h1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <PhotoAlbumIcon sx={{ mr: 1 }} /> Gallery
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/gallery')}
                    >
                        Back to Management
                    </Button>
                </Box>

                {error && (
                    <Box sx={{ mt: 2, mb: 2, color: 'error.main' }}>
                        <Typography>{error}</Typography>
                    </Box>
                )}

                {/* Gallery grid */}
                <GridContainer>
                    {loading ? (
                        renderSkeletons()
                    ) : (
                        publishedImages.map((image, index) => (
                            <Card
                                key={image.id}
                                sx={{ height: '100%' }}
                            >
                                <CardActionArea
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setLightboxOpen(true);
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
                                    </Box>
                                </CardActionArea>
                            </Card>
                        ))
                    )}
                </GridContainer>

                {/* Lightbox component */}
                <ImageLightbox
                    open={lightboxOpen}
                    onClose={() => setLightboxOpen(false)}
                    images={publishedImages}
                    currentImageIndex={currentImageIndex}
                    onNavigate={setCurrentImageIndex}
                />

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

                {/* No images message */}
                {!loading && publishedImages.length === 0 && (
                    <Box sx={{ textAlign: 'center', my: 5 }}>
                        <Typography variant="h6" color="text.secondary">
                            No published gallery images available
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default GalleryPage;