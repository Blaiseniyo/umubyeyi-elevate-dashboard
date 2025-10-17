import React, { useCallback } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Stack,
    IconButton,
    TextField,
    Divider
} from '@mui/material';
import { Psychology, Add, Delete } from '@mui/icons-material';
import { TrimesterSymptom } from '../../types';
import ImageUpload from '../Common/ImageUpload';
import RichTextEditor from '../Common/richTextEditor/RichTextEditor';

// Validation errors interface
interface SymptomValidationErrors {
    [index: number]: {
        name?: string;
        image_url?: string;
    }
}

interface TrimesterSymptomsStepProps {
    symptoms: TrimesterSymptom[];
    onSymptomUpdate: (symptoms: TrimesterSymptom[]) => void;
    isViewMode: boolean;
    validationErrors?: SymptomValidationErrors;
}

const TrimesterSymptomsStep: React.FC<TrimesterSymptomsStepProps> = ({
    symptoms = [],
    onSymptomUpdate,
    isViewMode,
    validationErrors = {}
}) => {
    // Add a new symptom
    const handleAddSymptom = useCallback(() => {
        onSymptomUpdate([
            ...symptoms,
            {
                name: '',
                description: '',
                image_url: '',
            }
        ]);
    }, [symptoms, onSymptomUpdate]);

    // Remove a symptom
    const handleRemoveSymptom = useCallback((index: number) => {
        const updatedSymptoms = [...symptoms];
        updatedSymptoms.splice(index, 1);
        onSymptomUpdate(updatedSymptoms);
    }, [symptoms, onSymptomUpdate]);

    // Update a symptom field
    const handleSymptomChange = useCallback((index: number, field: keyof TrimesterSymptom, value: string) => {
        const updatedSymptoms = [...symptoms];
        if (updatedSymptoms[index]) {
            updatedSymptoms[index] = {
                ...updatedSymptoms[index],
                [field]: value
            };
        }
        onSymptomUpdate(updatedSymptoms);
    }, [symptoms, onSymptomUpdate]);

    // Handle symptom image updates
    const handleSymptomImageChange = useCallback((index: number, imageUrl: string | null, signedImageUrl: string | null) => {
        const updatedSymptoms = [...symptoms];
        if (updatedSymptoms[index]) {
            updatedSymptoms[index] = {
                ...updatedSymptoms[index],
                image_url: imageUrl !== null ? imageUrl : '',
                signed_image_url: signedImageUrl !== null ? signedImageUrl : ''
            };
        }
        onSymptomUpdate(updatedSymptoms);
    }, [symptoms, onSymptomUpdate]);

    return (
        <Box sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Psychology color="primary" />
                    Trimester Symptoms
                </Typography>
                {!isViewMode && (
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleAddSymptom}
                    >
                        Add Symptom
                    </Button>
                )}
            </Box>

            <Stack spacing={3}>
                {symptoms.length === 0 ? (
                    <Card variant="outlined">
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                            <Psychology sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No Symptoms Added
                            </Typography>
                            <Typography variant="body2" color="text.disabled" align="center" sx={{ maxWidth: 400, mt: 1 }}>
                                {isViewMode
                                    ? 'There are no symptoms recorded for this trimester.'
                                    : 'Add symptoms that are commonly experienced during this trimester.'}
                            </Typography>
                            {!isViewMode && (
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={handleAddSymptom}
                                    sx={{ mt: 2 }}
                                >
                                    Add First Symptom
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    symptoms.map((symptom, index) => (
                        <Card key={index} variant="outlined">
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        {symptom.name || `Symptom ${index + 1}`}
                                    </Typography>
                                    {!isViewMode && (
                                        <IconButton
                                            color="error"
                                            onClick={() => handleRemoveSymptom(index)}
                                            aria-label="delete symptom"
                                        >
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {!isViewMode ? (
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Symptom Name"
                                            value={symptom.name || ''}
                                            onChange={(e) => handleSymptomChange(index, 'name', e.target.value)}
                                            required
                                            error={!!validationErrors[index]?.name}
                                            helperText={validationErrors[index]?.name}
                                            placeholder="e.g., Morning Sickness"
                                        />

                                        <RichTextEditor
                                            label="Symptom Description"
                                            value={symptom.description || ''}
                                            onChange={(value) => handleSymptomChange(index, 'description', value)}
                                            placeholder="Describe the symptom and provide helpful information..."
                                        />

                                        <Box>
                                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                                Symptom Image
                                            </Typography>
                                            <ImageUpload
                                                label="Symptom Image"
                                                value={symptom.image_url || ''}
                                                displayUrl={symptom.signed_image_url || symptom.image_url || ''}
                                                onChange={(url: string | null, signedUrl: string | null) => handleSymptomImageChange(index, url, signedUrl)}
                                                required={true}
                                                error={!!validationErrors[index]?.image_url}
                                            />
                                        </Box>
                                    </Stack>
                                ) : (
                                    <Box>
                                        <Stack spacing={3}>
                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Symptom Name:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {symptom.name || 'Not provided'}
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Description:
                                                </Typography>
                                                {symptom.description ? (
                                                    <Box
                                                        sx={{ mt: 1 }}
                                                        dangerouslySetInnerHTML={{ __html: symptom.description }}
                                                    />
                                                ) : (
                                                    <Typography variant="body1" color="text.disabled">
                                                        No description provided
                                                    </Typography>
                                                )}
                                            </Box>

                                            <Box>
                                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                                                    Image:
                                                </Typography>
                                                {symptom.image_url ? (
                                                    <Box
                                                        component="img"
                                                        src={symptom.signed_image_url || symptom.image_url}
                                                        alt={symptom.name || 'Symptom image'}
                                                        sx={{
                                                            maxWidth: '100%',
                                                            maxHeight: 200,
                                                            objectFit: 'contain',
                                                            border: '1px solid',
                                                            borderColor: 'divider',
                                                            borderRadius: 1
                                                        }}
                                                    />
                                                ) : (
                                                    <Typography variant="body1" color="text.disabled">
                                                        No image provided
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </Stack>
        </Box>
    );
};

export default React.memo(TrimesterSymptomsStep);