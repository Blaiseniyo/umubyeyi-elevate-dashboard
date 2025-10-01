import React from 'react';
import { Box, Typography } from '@mui/material';
import { WeeklyContent } from '../../types';

// This component has been deprecated as the symptoms feature has been removed

interface SymptomsStepProps {
    content: Partial<WeeklyContent>;
    onContentUpdate: (updatedFields: Partial<WeeklyContent> | ((prevContent: Partial<WeeklyContent>) => Partial<WeeklyContent>)) => void;
    isViewMode: boolean;
    validationErrors?: any;
}

const SymptomsStep: React.FC<SymptomsStepProps> = () => {
    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="body1">
                The Symptoms feature has been removed.
            </Typography>
        </Box>
    );
};

export default SymptomsStep;
