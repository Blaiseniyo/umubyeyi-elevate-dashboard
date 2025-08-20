import React, { useCallback } from 'react';
import { Box, Typography, TextField, Chip, Stack, Card } from '@mui/material';
import { Info, Lightbulb } from '@mui/icons-material';
import RichTextEditor from '../Common/RichTextEditor';
import { WeeklyContent } from '../../types';

// Define validation errors interface
interface ValidationErrors {
    week?: string;
    title?: string;
}

interface BasicInfoStepProps {
    content: Partial<WeeklyContent>;
    onFormChange: (field: string, value: any) => void;
    isViewMode?: boolean;
    isEditMode?: boolean;
    validationErrors?: ValidationErrors;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
    content,
    onFormChange,
    isViewMode = false,
    isEditMode = false,
    validationErrors = {}
}) => {
    const readOnly = isViewMode;

    // Memoize these functions to prevent recreation on each render
    const getTrimesterName = useCallback((week: number) => {
        if (!week) return 'Select Week';
        if (week <= 12) return 'First Trimester';
        if (week <= 27) return 'Second Trimester';
        return 'Third Trimester';
    }, []);

    const getTrimesterColor = useCallback((week: number) => {
        if (!week) return 'default';
        if (week <= 12) return 'success';
        if (week <= 27) return 'info';
        return 'warning';
    }, []);

    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Info color="primary" />
                Basic Information
            </Typography>

            <Stack spacing={3}>
                <Card variant="outlined" sx={{ p: 3 }}>
                    <Stack spacing={3}>
                        <TextField
                            fullWidth
                            label="Week Number"
                            type="number"
                            value={content?.week || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                // Only update if input is empty or is a valid number
                                if (value === '' || !isNaN(Number(value))) {
                                    onFormChange('week', value === '' ? '' : Number(value));
                                }
                            }}
                            required
                            disabled={readOnly || isEditMode}
                            helperText={validationErrors.week || "Enter the pregnancy week (1-42)"}
                            error={!!validationErrors.week}
                            inputProps={{ min: 1, max: 42 }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Trimester:
                            </Typography>
                            <Chip
                                label={getTrimesterName(content?.week || 0)}
                                color={getTrimesterColor(content?.week || 0) as any}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Stack>
                </Card>

                <Card variant="outlined" sx={{ p: 3 }}>
                    <TextField
                        fullWidth
                        label="Content Title"
                        value={content?.title || ''}
                        onChange={(e) => onFormChange('title', e.target.value)}
                        required
                        disabled={readOnly}
                        placeholder="e.g., Week 5: Tiny Fingers and Toes"
                        helperText={validationErrors.title || "Create an engaging title for this week's content"}
                        error={!!validationErrors.title}
                    />
                </Card>

                <Card variant="outlined" sx={{ p: 3 }}>
                    <RichTextEditor
                        label="Week Description"
                        value={content?.description || ''}
                        onChange={(value) => onFormChange('description', value)}
                        height={140}
                        readOnly={readOnly}
                        placeholder="Describe what's happening during this week of pregnancy..."
                    />
                </Card>

                <Card variant="outlined" sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Lightbulb color="primary" />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Tips & Advice
                        </Typography>
                    </Box>
                    <RichTextEditor
                        label="Helpful Tips and Advice"
                        value={content?.tips_and_advice || ''}
                        onChange={(value) => onFormChange('tips_and_advice', value)}
                        height={120}
                        readOnly={readOnly}
                        placeholder="Provide helpful tips and advice for this week..."
                    />
                </Card>
            </Stack>
        </Box>
    );
};

export default React.memo(BasicInfoStep);