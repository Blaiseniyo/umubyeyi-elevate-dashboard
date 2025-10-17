import React from 'react';
import {
    Typography,
    Box,
    Button,
    Paper
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface DescriptionSectionProps {
    description: string;
    onOpenDescriptionDialog: () => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
    description,
    onOpenDescriptionDialog
}) => {
    return (
        <Paper sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                    Description
                </Typography>
                <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={onOpenDescriptionDialog}
                >
                    Edit
                </Button>
            </Box>
            <Box sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: description }} />
        </Paper>
    );
};

export default DescriptionSection;