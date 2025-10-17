import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Box,
    Typography
} from '@mui/material';
import ImageUpload from '../../components/Common/ImageUpload';

interface ImageDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { image_url: string }) => void;
}

interface ValidationErrors {
    image_url?: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({
    open,
    onClose,
    onSave
}) => {
    const [imageUrl, setImageUrl] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Reset form when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setImageUrl('');
            setErrors({});
        }
    }, [open]);

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        if (!imageUrl) {
            newErrors.image_url = 'Image is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                image_url: imageUrl
            });
            // Reset form after submission
            setImageUrl('');
        }
    };

    const handleImageChange = (url: string | null, signed: string | null) => {
        setImageUrl(url || '');

        // Clear error when an image is selected
        if (url) {
            setErrors(prev => ({ ...prev, image_url: undefined }));
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Gallery Image</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <Box>
                        <Typography variant="subtitle2" gutterBottom>
                            Upload Image
                        </Typography>
                        <ImageUpload
                            label="Gallery Image"
                            displayUrl={""}
                            value={imageUrl}
                            onChange={handleImageChange}
                            filePath="gallery"
                            fileName={`gallery-${Date.now()}`}
                            required={true}
                            error={!!errors.image_url}
                        />
                        {errors.image_url && (
                            <Typography color="error" variant="caption">
                                {errors.image_url}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={!imageUrl}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ImageDialog;