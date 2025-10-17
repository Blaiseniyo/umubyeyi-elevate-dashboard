import React from 'react';
import {
    Dialog,
    DialogContent,
    IconButton,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import {
    Close as CloseIcon,
    ArrowBack as PrevIcon,
    ArrowForward as NextIcon
} from '@mui/icons-material';

interface ImageLightboxProps {
    open: boolean;
    onClose: () => void;
    images: { id: number; image_url: string }[];
    currentImageIndex: number;
    onNavigate: (index: number) => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
    open,
    onClose,
    images,
    currentImageIndex,
    onNavigate
}) => {
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    // Safety check for index boundaries
    const safeIndex = Math.max(0, Math.min(currentImageIndex, images.length - 1));
    const currentImage = images[safeIndex];

    const handlePrevImage = () => {
        const prevIndex = (safeIndex - 1 + images.length) % images.length;
        onNavigate(prevIndex);
    };

    const handleNextImage = () => {
        const nextIndex = (safeIndex + 1) % images.length;
        onNavigate(nextIndex);
    };

    if (!currentImage) {
        return null;
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            fullScreen={fullScreen}
            disableEscapeKeyDown={false} // Allow ESC key to close dialog
            sx={{
                '& .MuiDialog-paper': {
                    bgcolor: 'black',
                    m: { xs: 0, sm: 1 },
                    width: '100%',
                    height: fullScreen ? '100%' : 'auto',
                },
                '& .MuiBackdrop-root': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)' // Darker backdrop for better contrast
                }
            }}
        >
            <IconButton
                onClick={(e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    onClose();
                }}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                    zIndex: 9999 // Ensure button is above all other elements
                }}
                aria-label="close"
            >
                <CloseIcon />
            </IconButton>

            <DialogContent 
                onClick={(e) => e.stopPropagation()} // Prevent dialog content clicks from closing the dialog
                sx={{
                p: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                position: 'relative'
            }}>
                {images.length > 1 && (
                    <>
                        <IconButton
                            onClick={handlePrevImage}
                            sx={{
                                position: 'absolute',
                                left: 8,
                                color: 'white',
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <PrevIcon />
                        </IconButton>

                        <IconButton
                            onClick={handleNextImage}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                color: 'white',
                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                '&:hover': {
                                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                                }
                            }}
                        >
                            <NextIcon />
                        </IconButton>
                    </>
                )}

                <Box
                    component="img"
                    src={currentImage.image_url}
                    alt="Gallery image"
                    sx={{
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        objectFit: 'contain',
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default ImageLightbox;