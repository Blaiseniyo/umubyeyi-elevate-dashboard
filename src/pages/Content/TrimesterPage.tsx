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
    Card
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useAppDispatch } from '../../hooks';
import { createTrimesterAsync, updateTrimesterAsync, getTrimesterByIdAsync } from '../../store/slices/contentSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';

interface FormData {
    trimester: 1 | 2 | 3;
    trimester_name: string;
    title: string;
    description: string;
    start_week: number;
    end_week: number;
    medical_checks: string;
    tips_and_advice: string;
}

// Define validation errors interface for the form
interface ValidationErrors extends Partial<Record<keyof FormData, string>> { }

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
    medical_checks: '',
    tips_and_advice: '',
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
                        medical_checks: response.medical_checks || '',
                        tips_and_advice: response.tips_and_advice || '',
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
                    medical_checks: '',
                    tips_and_advice: '',
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

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        if (!formData.trimester_name.trim()) {
            newErrors.trimester_name = 'Trimester name is required';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (formData.start_week < 1 || formData.start_week > 42) {
            newErrors.start_week = 'Start week must be between 1 and 42';
        }

        if (formData.end_week < 1 || formData.end_week > 42) {
            newErrors.end_week = 'End week must be between 1 and 42';
        }

        if (formData.start_week >= formData.end_week) {
            newErrors.start_week = 'Start week must be less than end week';
        }

        // // Helper function to check if a rich text field has content
        // const hasContent = (html: string | undefined): boolean => {
        //     if (!html) return false;
        //     // Remove HTML tags and check if there's actual text
        //     const text = html.replace(/<[^>]*>/g, '').trim();
        //     return text.length > 0;
        // };

        // Only check if description is empty when considering it a required field
        const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();
        if (!descriptionText) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
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

                {/* Form content */}
                <form onSubmit={handleSubmit}>
                    <Box sx={{ p: 3 }}>
                        {submissionError && (
                            <Alert severity="error" sx={{ mb: 3 }}>{submissionError}</Alert>
                        )}

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
                            <Card variant="outlined" sx={{ p: 3, maxWidth: 1207, margin: "0 auto" }}>
                                <RichTextEditor
                                    label="Description"
                                    value={formData.description || ""}
                                    onChange={(value) => handleRichTextChange('description', value)}
                                    placeholder="Enter a detailed description of this trimester..."
                                    error={!!errors.description}
                                />
                            </Card>


                            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Medical Checks"
                                    name="medical_checks"
                                    value={formData.medical_checks}
                                    onChange={handleChange}
                                    placeholder="Enter recommended medical checks for this trimester..."
                                    error={!!errors.medical_checks}
                                    helperText={errors.medical_checks}
                                    variant="outlined"
                                    disabled={isViewMode}
                                />
                            </Box>

                            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Tips and Advice"
                                    name="tips_and_advice"
                                    value={formData.tips_and_advice}
                                    onChange={handleChange}
                                    placeholder="Enter helpful tips and advice for mothers during this trimester..."
                                    error={!!errors.tips_and_advice}
                                    helperText={errors.tips_and_advice}
                                    variant="outlined"
                                    disabled={isViewMode}
                                />
                            </Box>
                        </Box>

                        {!isViewMode && (
                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    onClick={handleGoBack}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                >
                                    {isEditMode ? 'Update' : 'Create'} Trimester Content
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
