import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  Card,
  CardMedia,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Image as ImageIcon,
} from '@mui/icons-material';
import { fileService } from '../../services/fileService';

interface ImageUploadProps {
  label: string;
  value: string | null;
  displayUrl: string | null;
  onChange: (url: string | null, signedUrl: string | null) => void;
  disabled?: boolean;
  accept?: string;
  filePath?: string;
  fileName?: string;
  required?: boolean;
  error?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  displayUrl,
  onChange,
  disabled = false,
  accept = 'image/*',
  filePath = 'pregnancy_tracker/images',
  fileName,
  required = false,
  error = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(displayUrl);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploadFileName = fileName || `${Date.now()}_${file.name.split('.')[0]}`;

      const response = await fileService.uploadFile({
        file,
        file_path: filePath,
        file_name: uploadFileName,
      });

      // Use the regular URL for backend operations
      onChange(response.data.file_url, response.data.signed_file_url);
      // Use the signed URL for immediate preview
      setPreviewUrl(response.data.signed_file_url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      setError(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    setUploading(true);
    setError(null);

    try {
      await fileService.deleteFile({ file_url: value });
      onChange(null, null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error('Delete failed:', error);
      setError(error.response?.data?.message || 'Failed to delete file');
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = (event?: React.MouseEvent) => {
    // If this is triggered by an event, stop propagation to prevent double triggers
    if (event) {
      event.stopPropagation();
    }

    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const showError = error && required && !previewUrl;

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        disabled={disabled || uploading}
      />

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {errorMessage}
        </Alert>
      )}

      {previewUrl ? (
        <Card
          variant="outlined"
          sx={{
            position: 'relative',
            borderColor: showError ? 'error.main' : 'divider',
            height: '390px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
          }}
        >
          <CardMedia
            component="img"
            image={previewUrl}
            alt={label}
            sx={{
              objectFit: 'contain',
              maxHeight: '390px',
              maxWidth: '100%',
              width: 'auto'
            }}
          />
          {!disabled && (
            <IconButton
              onClick={handleRemove}
              disabled={uploading}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              size="small"
            >
              {uploading ? (
                <CircularProgress size={16} />
              ) : (
                <Delete />
              )}
            </IconButton>
          )}
        </Card>
      ) : (
        <Box
          sx={{
            border: '2px dashed',
            borderColor: showError ? 'error.main' : '#ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: disabled || uploading ? 'default' : 'pointer',
            bgcolor: showError ? 'error.50' : 'background.paper',
            '&:hover': disabled || uploading ? {} : {
              borderColor: showError ? 'error.dark' : 'primary.main',
              bgcolor: showError ? 'error.100' : 'grey.50',
            },
          }}
          onClick={handleButtonClick}
        >
          {uploading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CircularProgress size={48} sx={{ mb: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Uploading...
              </Typography>
            </Box>
          ) : (
            <>
              <ImageIcon sx={{
                fontSize: 48,
                color: showError ? 'error.main' : 'grey.400',
                mb: 1
              }} />
              <Typography
                variant="body2"
                color={showError ? 'error.main' : 'text.secondary'}
                sx={{ mb: 2 }}
              >
                {disabled ? 'No image selected' : 'Click to upload an image'}
                {required && !disabled && ' (Required)'}
              </Typography>
              {!disabled && (
                <Button
                  variant="outlined"
                  startIcon={<CloudUpload />}
                  onClick={handleButtonClick} // Pass the event to stop propagation
                  color={showError ? 'error' : 'primary'}
                >
                  Upload Image
                </Button>
              )}
            </>
          )}
        </Box>
      )}

      {showError && (
        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
          This field is required
        </Typography>
      )}
    </Box>
  );
};

export default ImageUpload;