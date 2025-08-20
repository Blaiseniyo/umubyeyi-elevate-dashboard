import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Button, Typography, IconButton, Container, Paper, Stack, Alert } from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { createWeeklyContentAsync, updateWeeklyContentAsync, getWeeklyContentByIdAsync } from '../../store/slices/contentSlice';
import { WeeklyContent } from '../../types';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import WeeklyContentForm from '../../components/WeeklyContent/WeeklyContentForm';

const defaultContent: Partial<WeeklyContent> = {
    week: 0,
    title: '',
    description: '',
    baby_size: '',
    baby_size_image_url: '',
    baby_size_description: '',
    baby_weight: '',
    baby_weight_image_url: '',
    baby_weight_description: '',
    baby_height: '',
    baby_height_image_url: '',
    baby_height_description: '',
    ultrasound_image_url: '',
    ultrasound_description: '',
    tips_and_advice: '',
    symptoms: []
};

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

const WeeklyContentPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const rawMode = searchParams.get('mode');
    const mode: 'create' | 'edit' | 'view' =
        (rawMode === 'create' || rawMode === 'edit' || rawMode === 'view')
            ? rawMode
            : (id ? 'edit' : 'create');
    const dispatch = useAppDispatch();

    const { loading: storeLoading } = useAppSelector((state) => state.content);
    const [pageLoading, setPageLoading] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    // Single source of truth for all content data
    const [content, setContent] = useState<Partial<WeeklyContent>>(defaultContent);
    // Separate fetch errors (initial loading) from submission errors
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    // Track validation errors
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    // Fetch content details when editing or viewing
    useEffect(() => {
        const fetchContentDetails = async () => {
            if (id && (isEditMode || isViewMode)) {
                const contentId = parseInt(id);
                if (isNaN(contentId)) {
                    setFetchError('Invalid content ID');
                    return;
                }

                setPageLoading(true);
                setFetchError(null);

                try {
                    const response = await dispatch(getWeeklyContentByIdAsync(contentId)).unwrap();

                    // Ensure the content has all required fields, even if the API response didn't include them
                    const completeContent = {
                        ...defaultContent,
                        ...response,
                        // Ensure symptoms is always an array
                        symptoms: response.symptoms || []
                    };

                    setContent(completeContent);
                } catch (error: any) {
                    console.error('Failed to fetch content details:', error);
                    setFetchError(error.message || error || 'Failed to load content details');
                } finally {
                    setPageLoading(false);
                }
            } else {
                // For create mode, initialize with default empty content
                setContent(defaultContent);
            }
        };

        fetchContentDetails();
    }, [id, mode, dispatch, isEditMode, isViewMode]);

    // Universal content update handler for ALL content updates, including symptoms
    const handleContentUpdate = useCallback((updatedFields: Partial<WeeklyContent> | ((prevContent: Partial<WeeklyContent>) => Partial<WeeklyContent>)) => {
        setContent(prevContent => {
            // If updatedFields is a function, call it with prevContent
            if (typeof updatedFields === 'function') {
                return {
                    ...prevContent,
                    ...updatedFields(prevContent)
                };
            }
            // Otherwise, just merge the updated fields
            return {
                ...prevContent,
                ...updatedFields
            };
        });

        // Clear validation errors when fields are updated
        setValidationErrors({});
    }, []);

    // Validate content before proceeding to the next step
    const validateContent = (step: number): boolean => {
        const errors: ValidationErrors = {};

        // Helper function to check if a rich text field has content
        const hasContent = (html: string | undefined): boolean => {
            if (!html) return false;
            // Remove HTML tags and check if there's actual text
            const text = html.replace(/<[^>]*>/g, '').trim();
            return text.length > 0;
        };

        // Only validate fields relevant to the current step
        if (step === 0) {
            // Basic Information step validation
            if (!content.week || content.week < 1 || content.week > 42) {
                errors.week = 'Week number must be between 1 and 42';
            }

            if (!content.title || content.title.trim() === '') {
                errors.title = 'Title is required';
            }
        } 
        else if (step === 1) {
            // Baby Development step validation
            if (!content.baby_size_image_url) {
                errors.baby_size_image_url = 'Baby size image is required';
            }
            
            if (!hasContent(content.baby_size_description)) {
                errors.baby_size_description = 'Baby size description is required';
            }
            
            if (!content.baby_weight_image_url) {
                errors.baby_weight_image_url = 'Baby weight image is required';
            }
            
            if (!hasContent(content.baby_weight_description)) {
                errors.baby_weight_description = 'Baby weight description is required';
            }
            
            if (!content.baby_height_image_url) {
                errors.baby_height_image_url = 'Baby length image is required';
            }
            
            if (!hasContent(content.baby_height_description)) {
                errors.baby_height_description = 'Baby length description is required';
            }
            
            if (!content.ultrasound_image_url) {
                errors.ultrasound_image_url = 'Ultrasound image is required';
            }
            
            if (!hasContent(content.ultrasound_description)) {
                errors.ultrasound_description = 'Ultrasound description is required';
            }
        }
        else if (step === 2) {
            // Symptoms step validation
            const symptomErrors: {[index: number]: {name?: string; image_url?: string}} = {};
            let hasErrors = false;
            
            // Only validate if there are symptoms
            if (content.symptoms && content.symptoms.length > 0) {
                content.symptoms.forEach((symptom, index) => {
                    const symptomError: {name?: string; image_url?: string} = {};
                    
                    // Validate name
                    if (!symptom.name || !symptom.name.trim()) {
                        symptomError.name = 'Symptom name is required';
                        hasErrors = true;
                    }
                    
                    // Validate image
                    if (!symptom.image_url && !symptom.signed_image_url) {
                        symptomError.image_url = 'Symptom image is required';
                        hasErrors = true;
                    }
                    
                    // Only add symptom errors if there are any
                    if (Object.keys(symptomError).length > 0) {
                        symptomErrors[index] = symptomError;
                    }
                });
            }
            
            if (hasErrors) {
                errors.symptoms = symptomErrors;
            }
        }

        // Store validation errors
        setValidationErrors(errors);

        // Return true if there are no errors
        return Object.keys(errors).length === 0;
    };

    // Handle next step button click with validation
    const handleNextStep = () => {
        if (validateContent(activeStep)) {
            setActiveStep(prev => prev + 1);
        }
    };

    const handleSubmit = async () => {
        if (isViewMode || !content) return;

        // Final validation before submission - validate all steps
        if (!validateContent(0) || !validateContent(1) || !validateContent(2)) {
            setSubmissionError('Please correct the validation errors before submitting');
            
            // Set active step to the first one with errors
            if (!validateContent(0)) {
                setActiveStep(0);
            } else if (!validateContent(1)) {
                setActiveStep(1);
            } else if (!validateContent(2)) {
                setActiveStep(2);
            }
            return;
        }

        // Clear any previous submission errors
        setSubmissionError(null);
        setPageLoading(true);

        try {
            // Helper function to check if a rich text field has content
            const hasContent = (html: string) => {
                if (!html) return false;
                // Remove HTML tags and check if there's actual text
                const text = html.replace(/<[^>]*>/g, '').trim();
                return text.length > 0;
            };

            // Validate that week is a valid number
            if (content.week === undefined || content.week <= 0) {
                setSubmissionError('A valid week number is required (must be greater than 0)');
                setPageLoading(false);
                return;
            }

            // Filter valid symptoms before submitting
            const validSymptoms = (content.symptoms || [])
                .filter(symptom =>
                    symptom.name?.trim() &&
                    (symptom.image_url && symptom.image_url.trim().length > 0)
                )
                .map(symptom => ({
                    id: symptom.id,
                    name: symptom.name,
                    description: symptom.description,
                    image_url: symptom.image_url || '',
                    signed_image_url: undefined
                }));

            const submitData = {
                ...content,
                week: content.week,
                baby_length: content.baby_height,
                symptoms: validSymptoms,
            };

            if (isEditMode && content.id) {
                await dispatch(updateWeeklyContentAsync({
                    id: content.id,
                    data: submitData,
                })).unwrap();
            } else {
                // Type assertion to ensure TypeScript knows week is a number
                await dispatch(createWeeklyContentAsync(submitData as any)).unwrap();
            }

            // Use the replace option to avoid re-rendering issues when going back
            navigate('/content', { replace: true });
        } catch (error: any) {
            console.error('Failed to save weekly content:', error);
            // Show submission error but stay on the current step
            setSubmissionError(error.message || error || 'Failed to save content');
        } finally {
            setPageLoading(false);
        }
    };

    const handleGoBack = () => {
        // Use the replace option to avoid re-rendering issues
        navigate('/content', { replace: true });
    };

    // Show loading spinner while fetching data
    if (pageLoading && !submissionError) {
        // Only show loading spinner during initial page load, not during submission
        return (
            <Container maxWidth="lg">
                <Paper sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <LoadingSpinner />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {isViewMode ? 'Loading content...' : isEditMode ? 'Loading content for editing...' : 'Loading...'}
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        );
    }

    // Show error if failed to fetch initial content
    if (fetchError) {
        return (
            <Container maxWidth="lg">
                <Paper sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                            Error Loading Content
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {fetchError}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={() => navigate('/content')}>
                                Back to Content List
                            </Button>
                            <Button variant="contained" onClick={() => window.location.reload()}>
                                Try Again
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Paper sx={{ minHeight: '90vh' }}>
                {/* Header */}
                <Box sx={{
                    p: 3,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2
                }}>
                    <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
                        <ArrowBack />
                    </IconButton>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {isViewMode
                                ? `Week ${content?.week} Content`
                                : isEditMode
                                    ? `Edit Week ${content?.week} Content`
                                    : 'Create New Weekly Content'
                            }
                        </Typography>
                        {!isViewMode && (
                            <Typography variant="body2" color="text.secondary">
                                {activeStep === 3
                                    ? 'Review your complete content before submitting'
                                    : 'Fill in the information for this week\'s pregnancy content'
                                }
                            </Typography>
                        )}
                    </Box>
                </Box>

                {/* Show submission error as an alert */}
                {submissionError && (
                    <Box sx={{ p: 2, bgcolor: 'error.50' }}>
                        <Alert
                            severity="error"
                            sx={{ mb: 0 }}
                            onClose={() => setSubmissionError(null)}
                        >
                            {submissionError}
                        </Alert>
                    </Box>
                )}

                <WeeklyContentForm
                    content={content}
                    mode={mode}
                    onContentUpdate={handleContentUpdate}
                    activeStep={activeStep}
                    validationErrors={validationErrors}
                />

                {/* Footer */}
                <Box sx={{
                    p: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {!isViewMode && activeStep > 0 ? (
                        <Button
                            onClick={() => setActiveStep(prev => prev - 1)}
                            size="large"
                            disabled={pageLoading}
                        >
                            Back
                        </Button>
                    ) : (
                        <Box />
                    )}

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            onClick={handleGoBack}
                            disabled={pageLoading}
                            size="large"
                        >
                            {isViewMode ? 'Close' : 'Cancel'}
                        </Button>

                        {!isViewMode && (
                            <>
                                {activeStep < 3 ? (
                                    <Button
                                        variant="contained"
                                        onClick={handleNextStep}
                                        size="large"
                                        disabled={pageLoading}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={handleSubmit}
                                        disabled={pageLoading || storeLoading}
                                        size="large"
                                        startIcon={<Save />}
                                        sx={{
                                            minWidth: 140,
                                            bgcolor: 'success.main',
                                            '&:hover': {
                                                bgcolor: 'success.dark',
                                            }
                                        }}
                                    >
                                        {pageLoading ? 'Saving...' : `${isEditMode ? 'Update' : 'Save'} Content`}
                                    </Button>
                                )}
                            </>
                        )}
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default WeeklyContentPage;