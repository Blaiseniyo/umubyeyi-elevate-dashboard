import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CircularProgress,
    Alert,
    LinearProgress,
} from '@mui/material';
import {
    CloudUpload,
    Delete,
    Videocam as VideoIcon,
    Pause,
    PlayArrow,
} from '@mui/icons-material';
import { videoService } from '../../services/videoService';// Import types from videoService
import {
    ChunkUploadResponse,
    CompleteUploadResponse,
    ApiResponseWrapper
} from '../../services/videoService';

interface VideoUploadProps {
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
    chunkSize?: number; // Size of each chunk in bytes
    onProgress?: (progress: number) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
    label,
    value,
    displayUrl,
    onChange,
    disabled = false,
    accept = 'video/*',
    filePath = 'health_hub/videos',
    fileName,
    required = false,
    error = false,
    chunkSize = 5 * 1024 * 1024, // Default 5MB chunks
    onProgress,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [errorMessage, setError] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(displayUrl);
    const [progress, setProgress] = useState(0);
    const [currentFile, setCurrentFile] = useState<File | null>(null);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);

    // Refs for upload state
    const uploadControllerRef = useRef<AbortController | null>(null);
    const fileIdRef = useRef<string | null>(null);
    const chunksUploadedRef = useRef<number>(0);
    const totalChunksRef = useRef<number>(0);

    // Effect to handle cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (uploadControllerRef.current) {
                uploadControllerRef.current.abort();
            }
            // Cleanup any file URLs
            if (videoSrc && videoSrc.startsWith('blob:')) {
                URL.revokeObjectURL(videoSrc);
            }
        };
    }, []);

    // Create a preview when a file is selected
    useEffect(() => {
        if (currentFile) {
            const objectUrl = URL.createObjectURL(currentFile);
            setVideoSrc(objectUrl);
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [currentFile]);

    // Uploading a chunk of the file
    const uploadChunk = async (
        file: File,
        chunkIndex: number,
        start: number,
        end: number,
        fileId?: string
    ): Promise<ApiResponseWrapper<ChunkUploadResponse>> => {
        const chunk = file.slice(start, end);
        const signal = uploadControllerRef.current?.signal;

        try {
            const response = await videoService.uploadChunk(
                {
                    chunk,
                    chunk_index: chunkIndex,
                    total_chunks: totalChunksRef.current,
                    file_name: fileName || file.name,
                    file_path: filePath,
                    file_id: fileId
                },
                signal
            );
            return response;
        } catch (error) {
            if ((error as any).name === 'AbortError') {
                throw new Error('Upload canceled');
            }
            throw error;
        }
    };    // Completing the upload process
    const completeUpload = async (fileId: string): Promise<ApiResponseWrapper<CompleteUploadResponse>> => {
        try {
            const response = await videoService.completeUpload({
                file_id: fileId,
                file_path: filePath,
                file_name: fileName || (currentFile?.name || 'video')
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // Main upload process
    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        setError(null);
        setProgress(0);
        chunksUploadedRef.current = 0;

        // Create a new AbortController for this upload
        uploadControllerRef.current = new AbortController();

        // Calculate total chunks
        const fileSize = file.size;
        const chunks = Math.ceil(fileSize / chunkSize);
        totalChunksRef.current = chunks;

        try {
            for (let chunkIndex = 0; chunkIndex < chunks; chunkIndex++) {
                // If paused, wait until resumed
                while (isPaused) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    // If the upload was aborted while paused
                    if (uploadControllerRef.current?.signal.aborted) {
                        throw new Error('Upload canceled');
                    }
                }

                const start = chunkIndex * chunkSize;
                const end = Math.min(fileSize, start + chunkSize);

                const response = await uploadChunk(
                    file,
                    chunkIndex,
                    start,
                    end,
                    fileIdRef.current || undefined
                );

                // Store the file_id for subsequent chunks
                if (response.data.file_id) {
                    fileIdRef.current = response.data.file_id;
                }

                // Update progress
                chunksUploadedRef.current++;
                const newProgress = Math.floor((chunksUploadedRef.current / chunks) * 100);
                setProgress(newProgress);
                if (onProgress) onProgress(newProgress);

                // If upload was aborted during this chunk
                if (uploadControllerRef.current?.signal.aborted) {
                    throw new Error('Upload canceled');
                }
            }

            // All chunks uploaded, complete the upload
            if (fileIdRef.current) {
                const completeResponse = await completeUpload(fileIdRef.current);

                // Update with the final URL
                onChange(
                    completeResponse.data.file_url,
                    completeResponse.data.signed_file_url
                );
                setPreviewUrl(completeResponse.data.signed_file_url);

                // Reset upload state
                fileIdRef.current = null;
                setProgress(100);
                if (onProgress) onProgress(100);

                return completeResponse;
            } else {
                throw new Error('Failed to get file ID during upload');
            }
        } catch (error: any) {
            if (error.message === 'Upload canceled') {
                setError('Upload was canceled');
            } else {
                console.error('Upload failed:', error);
                setError(error.response?.data?.message || 'Failed to upload file');
            }
            throw error;
        } finally {
            setUploading(false);
            uploadControllerRef.current = null;
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [chunkSize, isPaused, onChange, filePath, fileName, onProgress]);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setCurrentFile(file);

        // Create a preview URL for the video
        const objectUrl = URL.createObjectURL(file);
        setVideoSrc(objectUrl);

        try {
            await uploadFile(file);
        } catch (error) {
            // Error is already handled in uploadFile
            console.error('Error in handleFileSelect:', error);
        }
    };

    const handleRemove = async () => {
        if (!value) return;

        setUploading(true);
        setError(null);

        try {
            await videoService.deleteFile({ file_url: value });
            onChange(null, null);
            setPreviewUrl(null);
            setVideoSrc(null);
            setCurrentFile(null);

            // Cleanup any object URLs
            if (videoSrc && videoSrc.startsWith('blob:')) {
                URL.revokeObjectURL(videoSrc);
            }
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

    const togglePause = () => {
        setIsPaused(prev => !prev);
    };

    const cancelUpload = () => {
        if (uploadControllerRef.current) {
            uploadControllerRef.current.abort();
            uploadControllerRef.current = null;
        }
        setUploading(false);
        setProgress(0);
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

            {(previewUrl || videoSrc) ? (
                <Card
                    variant="outlined"
                    sx={{
                        position: 'relative',
                        borderColor: showError ? 'error.main' : 'divider',
                        height: '390px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f5f5f5'
                    }}
                >
                    <CardMedia
                        component="video"
                        controls
                        src={videoSrc || previewUrl || undefined}
                        sx={{
                            maxHeight: '350px',
                            maxWidth: '100%',
                            width: 'auto'
                        }}
                    />

                    {!disabled && (
                        <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex' }}>
                            {uploading && (
                                <IconButton
                                    onClick={togglePause}
                                    sx={{
                                        mr: 1,
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        '&:hover': {
                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                        },
                                    }}
                                    size="small"
                                >
                                    {isPaused ? <PlayArrow /> : <Pause />}
                                </IconButton>
                            )}

                            <IconButton
                                onClick={uploading ? cancelUpload : handleRemove}
                                sx={{
                                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    },
                                }}
                                size="small"
                            >
                                <Delete />
                            </IconButton>
                        </Box>
                    )}

                    {uploading && (
                        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, px: 2, py: 1, bgcolor: 'rgba(0,0,0,0.5)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: 'white', mr: 1 }}>
                                    {isPaused ? 'Paused' : 'Uploading'}: {progress}%
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'white', ml: 'auto' }}>
                                    {chunksUploadedRef.current}/{totalChunksRef.current} chunks
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{
                                    height: 8,
                                    borderRadius: 1,
                                    bgcolor: 'rgba(255,255,255,0.2)',
                                    '& .MuiLinearProgress-bar': {
                                        bgcolor: 'primary.main',
                                    }
                                }}
                            />
                        </Box>
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
                                Uploading... {progress}%
                            </Typography>
                            <Box sx={{ width: '100%', mt: 2, px: 4 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={progress}
                                    sx={{
                                        height: 8,
                                        borderRadius: 1
                                    }}
                                />
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={togglePause}
                                    startIcon={isPaused ? <PlayArrow /> : <Pause />}
                                >
                                    {isPaused ? 'Resume' : 'Pause'}
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={cancelUpload}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <VideoIcon sx={{
                                fontSize: 48,
                                color: showError ? 'error.main' : 'grey.400',
                                mb: 1
                            }} />
                            <Typography
                                variant="body2"
                                color={showError ? 'error.main' : 'text.secondary'}
                                sx={{ mb: 2 }}
                            >
                                {disabled ? 'No video selected' : 'Click to upload a video'}
                                {required && !disabled && ' (Required)'}
                            </Typography>
                            {!disabled && (
                                <Button
                                    variant="outlined"
                                    startIcon={<CloudUpload />}
                                    onClick={handleButtonClick} // Pass the event to stop propagation
                                    color={showError ? 'error' : 'primary'}
                                >
                                    Upload Video
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

export default VideoUpload;