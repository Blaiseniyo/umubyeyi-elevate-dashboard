import React from 'react';
import { Box, Stepper, Step, StepLabel, Divider } from '@mui/material';
import BasicInfoStep from './BasicInfoStep';
import BabyDevelopmentStep from './BabyDevelopmentStep';
import SymptomsStep from './SymptomsStep';
import ReviewStep from './ReviewStep';
import { WeeklyContent } from '../../types';

// Define validation error interface
interface ValidationErrors {
    week?: string;
    title?: string;
    // Baby development validation fields
    baby_size_image_url?: string;
    baby_size_description?: string;
    baby_weight_image_url?: string;
    baby_weight_description?: string;
    baby_height_image_url?: string;
    baby_height_description?: string;
    ultrasound_image_url?: string;
    ultrasound_description?: string;
    // Symptoms validation fields
    symptoms?: {
        [index: number]: {
            name?: string;
            image_url?: string;
        }
    }
}

interface WeeklyContentFormProps {
    content: Partial<WeeklyContent>;
    mode: 'create' | 'edit' | 'view';
    onContentUpdate: (updatedFields: Partial<WeeklyContent> | ((prevContent: Partial<WeeklyContent>) => Partial<WeeklyContent>)) => void;
    activeStep: number;
    validationErrors?: ValidationErrors;
}

const WeeklyContentForm: React.FC<WeeklyContentFormProps> = ({
    content,
    mode,
    onContentUpdate,
    activeStep,
    validationErrors = {}
}) => {
    const steps = ['Basic Information', 'Baby Development', 'Pregnancy Symptoms', 'Review & Submit'];
    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    // Simple wrapper to update content fields directly
    const handleFormChange = (field: string, value: any) => {
        onContentUpdate({ [field]: value });
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <BasicInfoStep
                        content={content}
                        onFormChange={handleFormChange}
                        isViewMode={isViewMode}
                        isEditMode={isEditMode}
                        validationErrors={validationErrors}
                    />
                );
            case 1:
                return (
                    <BabyDevelopmentStep
                        content={content}
                        onFormChange={handleFormChange}
                        isViewMode={isViewMode}
                        validationErrors={validationErrors}
                    />
                );
            case 2:
                return (
                    <SymptomsStep
                        content={content}
                        onContentUpdate={onContentUpdate}
                        isViewMode={isViewMode}
                        validationErrors={validationErrors.symptoms}
                    />
                );
            case 3:
                return (
                    <ReviewStep
                        content={content}
                        isEditMode={isEditMode}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            {!isViewMode && (
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            )}

            <Box sx={{ p: 3, maxHeight: '65vh', overflowY: 'auto' }}>
                {isViewMode ? (
                    <Box>
                        <BasicInfoStep
                            content={content}
                            onFormChange={handleFormChange}
                            isViewMode={isViewMode}
                            isEditMode={isEditMode}
                        />
                        <Divider sx={{ my: 4 }} />
                        <BabyDevelopmentStep
                            content={content}
                            onFormChange={handleFormChange}
                            isViewMode={isViewMode}
                        />
                        <Divider sx={{ my: 4 }} />
                        <SymptomsStep
                            content={content}
                            onContentUpdate={onContentUpdate}
                            isViewMode={isViewMode}
                        />
                    </Box>
                ) : (
                    renderStepContent(activeStep)
                )}
            </Box>
        </Box>
    );
};

export default WeeklyContentForm;
