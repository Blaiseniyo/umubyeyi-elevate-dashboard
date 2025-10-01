import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Paper,
    Container,
    IconButton,
    Stack,
    Alert,
    Card,
    Stepper,
    Step,
    StepLabel,
    Divider,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { createTrimesterAsync, updateTrimesterAsync, getTrimesterByIdAsync } from '../../store/slices/contentSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import TrimesterSymptomsStep from '../../components/WeeklyContent/TrimesterSymptomsStep';

interface FormData {
    trimester: 1 | 2 | 3;
    trimester_name: string;
    title: string;
    description: string;
    start_week: number;
    end_week: number;
    fetal_development: string;
    baby_size: string;
    symptoms: Array<{
        id?: number;
        name: string;
        description: string;
        image_url: string;
        signed_image_url?: string;
        trimester_number?: number;
        trimester_name?: string;
    }>;
}

// Define validation errors interface for the form
interface ValidationErrors {
    trimester?: string;
    trimester_name?: string;
    title?: string;
    description?: string;
    start_week?: string;
    end_week?: string;
    fetal_development?: string;
    baby_size?: string;
    symptoms?: {
        [index: number]: {
            name?: string;
            image_url?: string;
        }
    }
}

// Define the week ranges for each trimester
const TRIMESTER_RANGES = {
    1: { start: 1, end: 12 },
    2: { start: 13, end: 27 },
    3: { start: 28, end: 42 }
};

const defaultTrimester: FormData = {
    trimester: 1,
    trimester_name: 'First Trimester',
    title: '',
    description: '',
    start_week: 1,
    end_week: 12,
    fetal_development: '',
    baby_size: '',
    symptoms: []
};

const TrimesterPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const rawMode = searchParams.get('mode');
    const mode: 'create' | 'edit' | 'view' =
        (rawMode === 'create' || rawMode === 'edit' || rawMode === 'view')
            ? rawMode
            : (id ? 'edit' : 'create');
    const dispatch = useAppDispatch();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>(defaultTrimester);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState(0);

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';

    // Fetch trimester details when editing or viewing
    useEffect(() => {
        const fetchTrimesterDetails = async () => {
            if (id && (isEditMode || isViewMode)) {
                setLoading(true);
                setFetchError(null);

                try {
                    const response = await dispatch(getTrimesterByIdAsync(id)).unwrap();

                    // Set form data from response
                    setFormData({
                        trimester: response.trimester,
                        trimester_name: response.trimester_name || '',
                        title: response.title || '',
                        description: response.description || '',
                        start_week: response.start_week || TRIMESTER_RANGES[response.trimester].start,
                        end_week: response.end_week || TRIMESTER_RANGES[response.trimester].end,
                        fetal_development: response.fetal_development || '',
                        baby_size: response.baby_size || '',
                        symptoms: response.symptoms || []
                    });
                } catch (error: any) {
                    console.error('Failed to fetch trimester details:', error);
                    setFetchError(error.message || error || 'Failed to load trimester details');
                } finally {
                    setLoading(false);
                }
            } else {
                // For create mode, initialize with default values
                const defaultTrimester = 1;
                setFormData({
                    trimester: defaultTrimester,
                    trimester_name: `Trimester ${defaultTrimester}`,
                    title: '',
                    description: '',
                    start_week: TRIMESTER_RANGES[defaultTrimester].start,
                    end_week: TRIMESTER_RANGES[defaultTrimester].end,
                    fetal_development: '',
                    baby_size: '',
                    symptoms: []
                });
            }
        };

        fetchTrimesterDetails();
    }, [id, mode, dispatch, isEditMode, isViewMode]);

    console.log('Form Data:', formData);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'trimester') {
            handleTrimesterChange(parseInt(value) as 1 | 2 | 3);
        } else if (name === 'start_week' || name === 'end_week') {
            setFormData(prev => ({
                ...prev,
                [name]: parseInt(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for this field when it changes
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    // Handle rich text editor change
    const handleRichTextChange = (fieldName: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [fieldName]: value
        }));

        // Clear error for this field when it changes
        if (errors[fieldName]) {
            setErrors(prev => ({
                ...prev,
                [fieldName]: undefined
            }));
        }
    };

    // Updated to handle trimester change more comprehensively
    const handleTrimesterChange = (trimesterValue: 1 | 2 | 3) => {
        // Set trimester name based on selection
        const trimesterNames = {
            1: 'First Trimester',
            2: 'Second Trimester',
            3: 'Third Trimester'
        };

        setFormData(prev => ({
            ...prev,
            trimester: trimesterValue,
            trimester_name: trimesterNames[trimesterValue],
            start_week: TRIMESTER_RANGES[trimesterValue].start,
            end_week: TRIMESTER_RANGES[trimesterValue].end
        }));

        // Clear any errors
        if (errors.trimester) {
            setErrors(prev => ({
                ...prev,
                trimester: undefined
            }));
        }
    };

    // Handle step navigation
    const handleNextStep = () => {
        const isValid = validateStep(activeStep);
        if (isValid) {
            setActiveStep((prevStep) => Math.min(prevStep + 1, 2));
        }
    };

    const handlePrevStep = () => {
        setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
    };

    // Handle symptom updates
    const handleSymptomsUpdate = (updatedSymptoms: FormData['symptoms']) => {
        setFormData((prev) => ({
            ...prev,
            symptoms: updatedSymptoms
        }));

        // Clear any symptom validation errors
        if (errors.symptoms) {
            setErrors(prev => ({
                ...prev,
                symptoms: undefined
            }));
        }
    };

    // Validate specific step
    const validateStep = (step: number): boolean => {
        let stepValid = true;
        const newErrors: ValidationErrors = {};

        if (step === 0) {
            // Basic information validation
            if (!formData.trimester_name.trim()) {
                newErrors.trimester_name = 'Trimester name is required';
                stepValid = false;
            }

            if (!formData.title.trim()) {
                newErrors.title = 'Title is required';
                stepValid = false;
            }

            if (formData.start_week < 1 || formData.start_week > 42) {
                newErrors.start_week = 'Start week must be between 1 and 42';
                stepValid = false;
            }

            if (formData.end_week < 1 || formData.end_week > 42) {
                newErrors.end_week = 'End week must be between 1 and 42';
                stepValid = false;
            }

            if (formData.start_week >= formData.end_week) {
                newErrors.start_week = 'Start week must be less than end week';
                stepValid = false;
            }

            const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();
            if (!descriptionText) {
                newErrors.description = 'Description is required';
                stepValid = false;
            }
        } else if (step === 1) {
            // Symptoms validation - only validate if there are symptoms
            if (formData.symptoms.length > 0) {
                const symptomErrors: ValidationErrors['symptoms'] = {};
                let hasSymptomError = false;

                formData.symptoms.forEach((symptom, index) => {
                    const symptomError: { name?: string; image_url?: string } = {};

                    if (!symptom.name.trim()) {
                        symptomError.name = 'Symptom name is required';
                        hasSymptomError = true;
                    }

                    if (!symptom.image_url.trim()) {
                        symptomError.image_url = 'Symptom image is required';
                        hasSymptomError = true;
                    }

                    if (Object.keys(symptomError).length > 0) {
                        symptomErrors[index] = symptomError;
                    }
                });

                if (hasSymptomError) {
                    newErrors.symptoms = symptomErrors;
                    stepValid = false;
                }
            }
        }

        setErrors(newErrors);
        return stepValid;
    };

    const validateForm = (): boolean => {
        // Validate all steps
        const basicInfoValid = validateStep(0);
        const symptomsValid = validateStep(1);

        return basicInfoValid && symptomsValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            setSubmissionError('Please correct the validation errors before submitting');
            return;
        }

        setSubmissionError(null);
        setLoading(true);

        try {
            if (isEditMode && id) {
                await dispatch(updateTrimesterAsync({
                    id: id,
                    data: formData,
                })).unwrap();
            } else {
                await dispatch(createTrimesterAsync(formData)).unwrap();
            }

            // Navigate back to trimester list page
            navigate('/pregnancy-tracker/content?tab=trimesters', { replace: true });
        } catch (error: any) {
            console.error('Failed to save trimester:', error);
            setSubmissionError(error.message || 'Failed to save trimester content');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        // Use the replace option to avoid re-rendering issues
        navigate('/pregnancy-tracker/content?tab=trimesters', { replace: true });
    };

    // Show loading spinner while fetching data
    if (loading && !submissionError) {
        return (
            <Container maxWidth="lg">
                <Paper sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <LoadingSpinner />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            {isViewMode ? 'Loading trimester content...' : isEditMode ? 'Loading trimester content for editing...' : 'Loading...'}
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
                            Error Loading Trimester Content
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                            {fetchError}
                        </Typography>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button variant="outlined" onClick={() => navigate('/pregnancy-tracker/content/trimester')}>
                                Back to Trimester List
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
                                ? `Trimester ${formData.trimester} Content`
                                : isEditMode
                                    ? `Edit Trimester ${formData.trimester} Content`
                                    : 'Create New Trimester Content'
                            }
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isViewMode
                                ? 'View details of trimester content'
                                : 'Fill in the information for this trimester\'s content'
                            }
                        </Typography>
                    </Box>

                    {!isViewMode && (
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {isEditMode ? 'Update' : 'Create'} Trimester
                        </Button>
                    )}
                </Box>

                {/* Stepper for non-view mode */}
                {!isViewMode && (
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            <Step>
                                <StepLabel>Basic Information</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Trimester Symptoms</StepLabel>
                            </Step>
                        </Stepper>
                    </Box>
                )}

                {/* Form content */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ p: 3 }}>
                        {submissionError && (
                            <Alert severity="error" sx={{ mb: 3 }}>{submissionError}</Alert>
                        )}

                        {/* Step 0: Basic Information */}
                        {(activeStep === 0 || isViewMode) && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Trimester"
                                    name="trimester"
                                    value={formData.trimester}
                                    onChange={handleChange}
                                    required
                                    disabled={isViewMode || !!id} // Don't allow changing trimester for existing entries or in view mode
                                >
                                    <MenuItem value={1}>First Trimester (Weeks 1-12)</MenuItem>
                                    <MenuItem value={2}>Second Trimester (Weeks 13-27)</MenuItem>
                                    <MenuItem value={3}>Third Trimester (Weeks 28-42)</MenuItem>
                                </TextField>

                                <TextField
                                    fullWidth
                                    label="Trimester Name"
                                    name="trimester_name"
                                    value={formData.trimester_name}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., First Trimester"
                                    error={!!errors.trimester_name}
                                    helperText={errors.trimester_name}
                                    disabled={isViewMode}
                                />

                                <TextField
                                    fullWidth
                                    label="Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Beginning of Your Pregnancy Journey"
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    disabled={isViewMode}
                                />

                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Start Week"
                                        name="start_week"
                                        value={formData.start_week}
                                        onChange={handleChange}
                                        required
                                        error={!!errors.start_week}
                                        helperText={errors.start_week}
                                        disabled={isViewMode}
                                    />

                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="End Week"
                                        name="end_week"
                                        value={formData.end_week}
                                        onChange={handleChange}
                                        required
                                        error={!!errors.end_week}
                                        helperText={errors.end_week}
                                        disabled={isViewMode}
                                    />
                                </Box>
                                <Card variant="outlined" sx={{ p: 3 }}>
                                    <RichTextEditor
                                        label="Description"
                                        value={formData.description || ""}
                                        onChange={(value) => handleRichTextChange('description', value)}
                                        placeholder="Enter a detailed description of this trimester..."
                                        error={!!errors.description}
                                    />
                                </Card>

                                <Card variant="outlined" sx={{ p: 3 }}>
                                    <RichTextEditor
                                        label="Fetal Development"
                                        value={formData.fetal_development || ""}
                                        onChange={(value) => handleRichTextChange('fetal_development', value)}
                                        placeholder="Describe the fetal development during this trimester..."
                                    />
                                </Card>

                                <Card variant="outlined" sx={{ p: 3 }}>
                                    <RichTextEditor
                                        label="Baby Size"
                                        value={formData.baby_size || ""}
                                        onChange={(value) => handleRichTextChange('baby_size', value)}
                                        placeholder="Describe the baby's size during this trimester..."
                                    />
                                </Card>


                            </Box>
                        )}

                        {/* Step 1: Symptoms */}
                        {(activeStep === 1 || isViewMode) && (
                            <Box sx={{ mt: isViewMode ? 4 : 0 }}>
                                {isViewMode && <Divider sx={{ my: 4 }} />}
                                <TrimesterSymptomsStep
                                    symptoms={formData.symptoms}
                                    onSymptomUpdate={handleSymptomsUpdate}
                                    isViewMode={isViewMode}
                                    validationErrors={errors.symptoms}
                                />
                            </Box>
                        )}

                        {/* Navigation buttons */}
                        {!isViewMode && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={activeStep === 0 ? handleGoBack : handlePrevStep}
                                    disabled={loading}
                                >
                                    {activeStep === 0 ? 'Cancel' : 'Previous'}
                                </Button>

                                <Box>
                                    {activeStep === 1 && (
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={loading}
                                            sx={{ ml: 2 }}
                                        >
                                            {isEditMode ? 'Update' : 'Create'} Trimester Content
                                        </Button>
                                    )}

                                    {activeStep === 0 && (
                                        <Button
                                            variant="contained"
                                            onClick={handleNextStep}
                                            disabled={loading}
                                        >
                                            Next: Symptoms
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        )}

                        {/* View mode actions */}
                        {isViewMode && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGoBack}
                                >
                                    Back to List
                                </Button>
                            </Box>
                        )}
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default TrimesterPage;
