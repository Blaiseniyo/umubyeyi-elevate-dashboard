import React from 'react';
import { Box, Typography, Stack, Card, CardHeader, CardContent } from '@mui/material';
import { ChildCare, Image as ImageIcon, MonitorWeight, CameraAlt } from '@mui/icons-material';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import ImageUpload from '../Common/ImageUpload';
import { WeeklyContent } from '../../types';

// Define validation errors interface
interface ValidationErrors {
    baby_size_image_url?: string;
    baby_size_description?: string;
    baby_weight_image_url?: string;
    baby_weight_description?: string;
    ultrasound_image_url?: string;
    ultrasound_description?: string;
}

interface BabyDevelopmentStepProps {
    content: Partial<WeeklyContent>;
    onFormChange: (field: string, value: any) => void;
    isViewMode: boolean;
    validationErrors?: ValidationErrors;
}

const BabyDevelopmentStep: React.FC<BabyDevelopmentStepProps> = ({
    content,
    onFormChange,
    isViewMode,
    validationErrors = {}
}) => {
    const signedUrlMapping: {[key: string]: string} = {
        'baby_size_image_url': 'signed_baby_size_image_url',
        'baby_weight_image_url': 'signed_baby_weight_image_url',
        'ultrasound_image_url': 'signed_ultrasound_image_url',
    };
    
    const handleImageChange = (field: string, url: string | null, signedUrl: string | null) => {
        // Update both the actual field and its signed URL field if available
        onFormChange(field, url || '');
        
        if (signedUrl) {
            const signedField = signedUrlMapping[field];
            if (signedField) {
                onFormChange(signedField, signedUrl);
            }
        }
    };

    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ChildCare color="primary" />
                Baby Development
            </Typography>

            <Stack spacing={4}>
                {/* Baby Size Section */}
                <Card variant="outlined">
                    <CardHeader
                        avatar={<ImageIcon color="primary" />}
                        title="Baby Size"
                    />
                    <CardContent>
                        <Stack spacing={3}>
                            <ImageUpload
                                label="Baby Size Image"
                                value={content.baby_size_image_url || ''}
                                displayUrl={content.signed_baby_size_image_url || null}
                                onChange={(url, signedUrl) => handleImageChange('baby_size_image_url', url, signedUrl)}
                                disabled={isViewMode}
                                filePath={`pregnancy_tracker/week_${content.week}`}
                                fileName={`baby_size_week_${content.week}`}
                                required={true}
                                error={!!validationErrors.baby_size_image_url}
                            />
                            {validationErrors.baby_size_image_url && (
                                <Typography color="error" variant="caption">
                                    {validationErrors.baby_size_image_url}
                                </Typography>
                            )}

                            <RichTextEditor
                                label="Size Description"
                                value={content.baby_size_description || ''}
                                onChange={(value) => onFormChange('baby_size_description', value)}
                                placeholder="Detailed description about the baby's size this week..."
                                error={!!validationErrors.baby_size_description}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Baby Weight Section */}
                <Card variant="outlined">
                    <CardHeader
                        avatar={<MonitorWeight color="primary" />}
                        title="Baby Weight"
                    />
                    <CardContent>
                        <Stack spacing={3}>
                            <ImageUpload
                                label="Baby Weight Image"
                                value={content.baby_weight_image_url || ''}
                                displayUrl={content.signed_baby_weight_image_url || null}
                                onChange={(url, signedUrl) => handleImageChange('baby_weight_image_url', url, signedUrl)}
                                disabled={isViewMode}
                                filePath={`pregnancy_tracker/week_${content.week}`}
                                fileName={`baby_weight_week_${content.week}`}
                                required={true}
                                error={!!validationErrors.baby_weight_image_url}
                            />
                            {validationErrors.baby_weight_image_url && (
                                <Typography color="error" variant="caption">
                                    {validationErrors.baby_weight_image_url}
                                </Typography>
                            )}

                            <RichTextEditor
                                label="Weight Description"
                                value={content.baby_weight_description || ''}
                                onChange={(value) => onFormChange('baby_weight_description', value)}
                                placeholder="Detailed description about the baby's weight this week..."
                                error={!!validationErrors.baby_weight_description}
                            />
                        </Stack>
                    </CardContent>
                </Card>



                {/* Ultrasound Section */}
                <Card variant="outlined">
                    <CardHeader
                        avatar={<CameraAlt color="primary" />}
                        title="Ultrasound Information"
                    />
                    <CardContent>
                        <Stack spacing={3}>
                            <ImageUpload
                                label="Ultrasound Image"
                                value={content.ultrasound_image_url || ''}
                                displayUrl={content.signed_ultrasound_image_url || null}
                                onChange={(url, signedUrl) => handleImageChange('ultrasound_image_url', url, signedUrl)}
                                disabled={isViewMode}
                                filePath={`pregnancy_tracker/week_${content.week}`}
                                fileName={`ultrasound_week_${content.week}`}
                                required={true}
                                error={!!validationErrors.ultrasound_image_url}
                            />
                            {validationErrors.ultrasound_image_url && (
                                <Typography color="error" variant="caption">
                                    {validationErrors.ultrasound_image_url}
                                </Typography>
                            )}

                            <RichTextEditor
                                label="Ultrasound Description"
                                value={content.ultrasound_description || ''}
                                onChange={(value) => onFormChange('ultrasound_description', value)}
                                placeholder="What can be seen on an ultrasound this week..."
                                error={!!validationErrors.ultrasound_description}
                            />
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default BabyDevelopmentStep;
