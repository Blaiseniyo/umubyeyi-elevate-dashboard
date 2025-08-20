import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Close as CloseIcon, CheckCircle, Error, Info, Warning } from '@mui/icons-material';

interface CustomToastProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    closeToast?: () => void;
}

const iconMap = {
    success: <CheckCircle color="success" />,
    error: <Error color="error" />,
    info: <Info color="info" />,
    warning: <Warning color="warning" />
};

const CustomToast: React.FC<CustomToastProps> = ({ type, message, closeToast }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                maxWidth: '100%'
            }}
        >
            <Box sx={{ mt: 0.25 }}>{iconMap[type]}</Box>
            <Typography
                variant="body2"
                sx={{ flex: 1, wordBreak: 'break-word' }}
            >
                {message}
            </Typography>
            {closeToast && (
                <IconButton
                    size="small"
                    onClick={closeToast}
                    sx={{ mt: -0.5, mr: -0.5 }}
                >
                    <CloseIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    );
};

export default CustomToast;
