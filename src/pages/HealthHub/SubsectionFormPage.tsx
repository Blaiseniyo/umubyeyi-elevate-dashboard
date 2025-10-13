import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    Box,
    Paper,
    Breadcrumbs,
    Link as MuiLink,
    CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import { healthHubService } from '../../services/healthHubService';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Subsection, Section } from '../../types/healthHub';

const SubsectionFormPage: React.FC = () => {
    const { subtopicId, sectionId, subsectionId } = useParams<{
        subtopicId: string;
        sectionId: string;
        subsectionId?: string;
    }>();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [section, setSection] = useState<Section | null>(null);
    const [subsection, setSubsection] = useState<Subsection | null>(null);

    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [order, setOrder] = useState(1);

    const [errors, setErrors] = useState({
        name: '',
        content: '',
        order: ''
    });

    // Fetch section and subsection data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                if (sectionId) {
                    const sectionResponse = await healthHubService.getSectionById(Number(sectionId));
                    if (sectionResponse.success) {
                        setSection(sectionResponse.data);
                    } else {
                        showToast('Failed to load section', 'error');
                        navigate(`/health-hub/subtopics/${subtopicId}`);
                        return;
                    }
                }

                // If we have a subsectionId, fetch the subsection data
                if (subsectionId) {
                    const subsectionResponse = await healthHubService.getSubsectionById(Number(subsectionId));
                    if (subsectionResponse.success) {
                        const fetchedSubsection = subsectionResponse.data;
                        setSubsection(fetchedSubsection);
                        setName(fetchedSubsection.name);
                        setContent(fetchedSubsection.content);
                        setOrder(fetchedSubsection.order);
                    } else {
                        showToast('Failed to load subsection', 'error');
                        navigate(`/health-hub/subtopics/${subtopicId}`);
                        return;
                    }
                }
            } catch (error) {
                console.error('Error loading data:', error);
                showToast('Error loading data', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [subtopicId, sectionId, subsectionId, navigate, showToast]);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { name: '', content: '', order: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
            isValid = false;
        }

        if (!order || order <= 0) {
            newErrors.order = 'Order must be a positive number';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setSaving(true);

            const subsectionData = {
                name,
                content,
                order,
                section_id: Number(sectionId)
            };

            let response;
            if (subsectionId) {
                // Update existing subsection
                response = await healthHubService.updateSubsection(Number(subsectionId), subsectionData);
            } else {
                // Create new subsection
                response = await healthHubService.createSubsection(subsectionData);
            }

            if (response.success) {
                showToast(`Subsection ${subsectionId ? 'updated' : 'created'} successfully`, 'success');
                navigate(`/health-hub/subtopics/${subtopicId}`);
            } else {
                showToast(`Failed to ${subsectionId ? 'update' : 'create'} subsection`, 'error');
            }
        } catch (error) {
            console.error(`Error ${subsectionId ? 'updating' : 'creating'} subsection:`, error);
            showToast(`Error ${subsectionId ? 'updating' : 'creating'} subsection`, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Breadcrumbs sx={{ mb: 3 }}>
                    <MuiLink component={Link} to="/health-hub" underline="hover" color="inherit">
                        Health Hub
                    </MuiLink>
                    <MuiLink
                        component={Link}
                        to={`/health-hub/subtopics/${subtopicId}`}
                        underline="hover"
                        color="inherit"
                    >
                        Back to Subtopic
                    </MuiLink>
                    <Typography color="text.primary">
                        {subsectionId ? 'Edit Subsection' : 'Create Subsection'}
                    </Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        {subsectionId ? 'Edit Subsection' : 'Create New Subsection'}
                    </Typography>
                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/health-hub/subtopics/${subtopicId}`}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to Subtopic
                    </Button>
                </Box>

                {section && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" color="text.secondary">
                            Section: {section.name}
                        </Typography>
                    </Box>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Subsection Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        label="Order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                        error={!!errors.order}
                        helperText={errors.order || 'The order in which this subsection appears in the section'}
                    />

                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Content
                        </Typography>
                        {errors.content && (
                            <Typography color="error" sx={{ fontSize: '0.75rem', mb: 1 }}>
                                {errors.content}
                            </Typography>
                        )}
                        <RichTextEditor
                            label= ""
                            value={content}
                            onChange={(value) => setContent(value)}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button
                            variant="outlined"
                            component={Link}
                            to={`/health-hub/subtopics/${subtopicId}`}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <CircularProgress size={24} sx={{ mr: 1 }} />
                                    Saving...
                                </>
                            ) : subsectionId ? 'Update Subsection' : 'Create Subsection'}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default SubsectionFormPage;