import React, { useCallback } from 'react';
import { Box, Typography, Button, Stack, Card, CardHeader, CardContent, IconButton, TextField } from '@mui/material';
import { Psychology, Add, Delete } from '@mui/icons-material';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import ImageUpload from '../Common/ImageUpload';
import { WeeklyContent } from '../../types';

// Validation errors interface
interface SymptomValidationErrors {
    [index: number]: {
        name?: string;
        image_url?: string;
    }
}

interface SymptomsStepProps {
    content: Partial<WeeklyContent>;
    onContentUpdate: (updatedFields: Partial<WeeklyContent> | ((prevContent: Partial<WeeklyContent>) => Partial<WeeklyContent>)) => void;
    isViewMode: boolean;
    validationErrors?: SymptomValidationErrors;
}

const SymptomsStep: React.FC<SymptomsStepProps> = ({
    content,
    onContentUpdate,
    isViewMode,
    validationErrors = {}
}) => {
    const symptoms = content.symptoms || [];

    // Add a new symptom
    const handleAddSymptom = useCallback(() => {
        onContentUpdate((prevContent: any) => ({
            ...prevContent,
            symptoms: [
                ...(prevContent.symptoms || []),
                {
                    name: '',
                    description: '',
                    image_url: '',
                    signed_image_url: '',
                }
            ]
        }));
    }, [onContentUpdate]);

    // Remove a symptom
    const handleRemoveSymptom = useCallback((index: number) => {
        onContentUpdate(prevContent => {
            const updatedSymptoms = [...(prevContent.symptoms || [])];
            updatedSymptoms.splice(index, 1);
            return {
                ...prevContent,
                symptoms: updatedSymptoms
            };
        });
    }, [onContentUpdate]);

    // Update a symptom field
    const handleSymptomChange = useCallback((index: number, field: string, value: any) => {
        onContentUpdate(prevContent => {
            const updatedSymptoms = [...(prevContent.symptoms || [])];
            if (updatedSymptoms[index]) {
                updatedSymptoms[index] = {
                    ...updatedSymptoms[index],
                    [field]: value
                };
            }
            return {
                ...prevContent,
                symptoms: updatedSymptoms
            };
        });
    }, [onContentUpdate]);

    // Handle symptom image updates
    const handleSymptomImageChange = useCallback((index: number, imageUrl: string | null, signedImageUrl: string | null) => {
        onContentUpdate(prevContent => {
            const updatedSymptoms = [...(prevContent.symptoms || [])];
            if (updatedSymptoms[index]) {
                updatedSymptoms[index] = {
                    ...updatedSymptoms[index],
                    image_url: imageUrl !== null ? imageUrl : '',
                    signed_image_url: signedImageUrl !== null ? signedImageUrl : ''
                };
            }
            return {
                ...prevContent,
                symptoms: updatedSymptoms
            };
        });
    }, [onContentUpdate]);

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Psychology color="primary" />
                    Pregnancy Symptoms
                </Typography>
                {!isViewMode && (
                    <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={handleAddSymptom}
                        size="medium"
                    >
                        Add Symptom
                    </Button>
                )}
            </Box>

            <Stack spacing={3}>
                {symptoms.map((symptom, index) => {
                    // Check for validation errors for this specific symptom
                    const hasNameError = validationErrors[index]?.name !== undefined;
                    const hasImageError = validationErrors[index]?.image_url !== undefined;

                    return (
                        <Card
                            key={index}
                            variant="outlined"
                            sx={{
                                borderColor: (hasNameError || hasImageError) ? 'error.main' : 'divider',
                                bgcolor: (hasNameError || hasImageError) ? 'error.50' : 'background.paper'
                            }}
                        >
                            <CardHeader
                                title={`Symptom ${index + 1}`}
                                action={
                                    !isViewMode && (
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveSymptom(index)}
                                            size="small"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )
                                }
                            />
                            <CardContent>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Symptom Name"
                                        value={symptom.name || ''}
                                        onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                                        required
                                        disabled={isViewMode}
                                        placeholder="e.g., Morning Sickness"
                                        helperText={validationErrors[index]?.name || "Enter the name of the symptom"}
                                        error={hasNameError}
                                    />

                                    <ImageUpload
                                        label="Symptom Image"
                                        value={symptom.image_url || ''}
                                        displayUrl={symptom.signed_image_url || null}
                                        onChange={(url, signedUrl) => handleSymptomImageChange(index, url, signedUrl)}
                                        disabled={isViewMode}
                                        filePath={`pregnancy_tracker/week_${content.week}/symptoms`}
                                        fileName={`symptom_${index + 1}_week_${content.week}`}
                                        required={true}
                                        error={hasImageError}
                                    />
                                    {validationErrors[index]?.image_url && (
                                        <Typography color="error" variant="caption">
                                            {validationErrors[index]?.image_url}
                                        </Typography>
                                    )}

                                    <RichTextEditor
                                        label="Symptom Description"
                                        value={symptom.description || ''}
                                        onChange={(value) => handleSymptomChange(index, 'description', value)}
                                        placeholder="Describe what the mother might experience..."
                                    />
                                </Stack>

                                {/* Remove the warning message about incomplete symptoms */}
                            </CardContent>
                        </Card>
                    );
                })}

                {symptoms.length === 0 && (
                    <Card variant="outlined" sx={{ p: 6, textAlign: 'center', bgcolor: 'grey.50' }}>
                        <Psychology sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                            No symptoms added yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            Add common symptoms that mothers might experience during this week
                        </Typography>
                        {!isViewMode && (
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddSymptom}
                            >
                                Add First Symptom
                            </Button>
                        )}
                    </Card>
                )}
            </Stack>
        </Box>
    );
};

export default React.memo(SymptomsStep);
