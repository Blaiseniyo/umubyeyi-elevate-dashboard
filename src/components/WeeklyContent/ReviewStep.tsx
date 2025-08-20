import React from 'react';
import { Box, Typography, Stack, Card, CardHeader, CardContent, Chip, Divider } from '@mui/material';
import { Preview, ChildCare, Lightbulb, Psychology, Image as ImageIcon, MonitorWeight, Height, CameraAlt } from '@mui/icons-material';
import { WeeklyContent } from '../../types';

interface ReviewStepProps {
    content: Partial<WeeklyContent>;
    isEditMode: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ content }) => {


    console.log("content:", content);

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

    const validSymptoms = (content.symptoms || []).filter(symptom =>
        symptom.name?.trim() && symptom.image_url?.trim()
    );

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
                        {content.tips_and_advice && (
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Lightbulb /> Tips & Advice
                                </Typography>
                                <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <div dangerouslySetInnerHTML={{ __html: content.tips_and_advice }} />
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
                                    <ImageIcon color="primary" /> Baby Size: {content.baby_size}
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
                                    <MonitorWeight color="primary" /> Baby Weight: {content.baby_weight}
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

                            <Divider />

                            <Box>
                                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Height color="primary" /> Baby Length: {content.baby_height}
                                </Typography>
                                {hasImage(content.baby_height_image_url) && (
                                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                                        <img
                                            src={content.signed_baby_height_image_url || content.baby_height_image_url}
                                            alt="Baby Length"
                                            style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                        />
                                    </Box>
                                )}
                                {content.baby_height_description && (
                                    <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <div dangerouslySetInnerHTML={{ __html: content.baby_height_description }} />
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

                {/* Symptoms Preview */}
                {validSymptoms.length > 0 && (
                    <Card variant="outlined">
                        <CardHeader
                            title={`Pregnancy Symptoms (${validSymptoms.length})`}
                            avatar={<Psychology color="primary" sx={{ fontSize: 32 }} />}
                        />
                        <CardContent>
                            <Stack spacing={3}>
                                {validSymptoms.map((symptom, index) => (
                                    <Card key={index} variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                                                {symptom.name}
                                            </Typography>
                                            {symptom.image_url && (
                                                <Box sx={{ mb: 2, textAlign: 'center' }}>
                                                    <img
                                                        src={symptom.signed_image_url || symptom.image_url}
                                                        alt={symptom.name}
                                                        style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                                                    />
                                                </Box>
                                            )}
                                            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                                <div dangerouslySetInnerHTML={{ __html: symptom.description || '' }} />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Box>
    );
};

export default ReviewStep;
