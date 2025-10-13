import React from 'react';
import { Box, Typography, Stack, Card, CardHeader, CardContent, Chip, Divider } from '@mui/material';
import { Preview, ChildCare, Image as ImageIcon, MonitorWeight, CameraAlt, Mood, AccessibilityNew } from '@mui/icons-material';
import { WeeklyContent } from '../../types';

interface ReviewStepProps {
    content: Partial<WeeklyContent>;
    isEditMode: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ content }) => {

    const getTrimesterName = (week: number) => {
        if (week <= 12) return 'First Trimester';
        if (week <= 27) return 'Second Trimester';
        return 'Third Trimester';
    };

    const getTrimesterColor = (week: number) => {
        if (week <= 12) return 'success';
        if (week <= 27) return 'info';
        return 'warning';
    };

    const hasImage = (imageUrl: string | undefined): boolean => {
        return !!imageUrl && imageUrl.trim().length > 0;
    };

    return (
        <Box sx={{ py: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Preview color="primary" />
                Complete Content Preview
            </Typography>

            <Stack spacing={4}>
                {/* Main Content Preview */}
                <Card variant="outlined" sx={{ bgcolor: 'primary.50' }}>
                    <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Typography variant="h4" sx={{ fontWeight: 600 }}>
                                Week {content.week}: {content.title}
                            </Typography>
                            <Chip
                                label={getTrimesterName(content.week || 0)}
                                color={getTrimesterColor(content.week || 0) as any}
                                size="medium"
                            />
                        </Box>
                        {content.description && (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Description</Typography>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <div dangerouslySetInnerHTML={{ __html: content.description }} />
                                </Box>
                            </Box>
                        )}
                        {content.what_you_might_feel && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Mood /> What You Might Feel
                                </Typography>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <div dangerouslySetInnerHTML={{ __html: content.what_you_might_feel }} />
                                </Box>
                            </Box>
                        )}
                        {content.body_changes && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccessibilityNew /> Body Changes
                                </Typography>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <div dangerouslySetInnerHTML={{ __html: content.body_changes }} />
                                </Box>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Baby Development Preview */}
                <Card variant="outlined">
                    <CardHeader
                        title="Baby Development"
                        avatar={<ChildCare color="primary" sx={{ fontSize: 32 }} />}
                    />
                    <CardContent>
                        <Stack spacing={4}>
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ImageIcon color="primary" /> Baby Size
                                </Typography>
                                {hasImage(content.baby_size_image_url) && (
                                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                                        <img
                                            src={content.signed_baby_size_image_url || content.baby_size_image_url}
                                            alt="Baby Size"
                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        />
                                    </Box>
                                )}
                                {content.baby_size_description && (
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <div dangerouslySetInnerHTML={{ __html: content.baby_size_description }} />
                                    </Box>
                                )}
                            </Box>

                            <Divider />

                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MonitorWeight color="primary" /> Baby Weight
                                </Typography>
                                {hasImage(content.baby_weight_image_url) && (
                                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                                        <img
                                            src={content.signed_baby_weight_image_url || content.baby_weight_image_url}
                                            alt="Baby Weight"
                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        />
                                    </Box>
                                )}
                                {content.baby_weight_description && (
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <div dangerouslySetInnerHTML={{ __html: content.baby_weight_description }} />
                                    </Box>
                                )}
                            </Box>

                            {(content.ultrasound_image_url || content.ultrasound_description) && (
                                <>
                                    <Divider />
                                    <Box>
                                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <CameraAlt color="primary" /> Ultrasound Information
                                        </Typography>
                                        {hasImage(content.ultrasound_image_url) && (
                                            <Box sx={{ mb: 2, textAlign: 'center' }}>
                                                <img
                                                    src={content.signed_ultrasound_image_url || content.ultrasound_image_url}
                                                    alt="Ultrasound"
                                                    style={{ maxWidth: '300px', maxHeight: '250px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                                />
                                            </Box>
                                        )}
                                        {content.ultrasound_description && (
                                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                                <div dangerouslySetInnerHTML={{ __html: content.ultrasound_description }} />
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
};

export default ReviewStep;
