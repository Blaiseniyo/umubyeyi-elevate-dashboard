import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Button,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Breadcrumbs,
    Link as MuiLink,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSubtopicById } from '../../store/slices/healthHubSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import { Section, Subsection } from '../../types/healthHub';
import SectionDialog from '../../pages/HealthHub/SectionDialog';

const SubtopicDetailPage: React.FC = () => {
    const { subtopicId } = useParams<{ subtopicId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentSubtopic, loading, error } = useAppSelector(state => state.healthHub);
    const [openSectionDialog, setOpenSectionDialog] = useState<boolean>(false);
    const [openDescriptionDialog, setOpenDescriptionDialog] = useState<boolean>(false);
    const [descriptionContent, setDescriptionContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);
    // We no longer need these state variables as we're using a dedicated page instead of a dialog
    // Removing them entirely could break existing code, so we'll keep them but not use them
    const { showToast } = useToast();

    useEffect(() => {
        if (subtopicId) {
            dispatch(fetchSubtopicById(Number(subtopicId)));
        }
    }, [dispatch, subtopicId]);

    useEffect(() => {
        if (error) {
            showToast('Error fetching subtopic', 'error');
        }
    }, [error, showToast]);

    const handleOpenSectionDialog = (section?: Section) => {
        setSelectedSection(section || null);
        setOpenSectionDialog(true);
    };

    const handleCloseSectionDialog = () => {
        setOpenSectionDialog(false);
        setSelectedSection(null);
    };

    // Navigate to subsection form page instead of opening a dialog
    const handleNavigateToSubsectionForm = (section: Section, subsection?: Subsection) => {
        if (subsection) {
            navigate(`/health-hub/subtopics/${subtopicId}/sections/${section.id}/subsections/${subsection.id}/edit`);
        } else {
            navigate(`/health-hub/subtopics/${subtopicId}/sections/${section.id}/subsections/create`);
        }
    };

    // Keep these for backward compatibility or if needed later
    const handleOpenSubsectionDialog = (section: Section, subsection?: Subsection) => {
        handleNavigateToSubsectionForm(section, subsection);
    };

    // This method was used for the dialog approach but is no longer needed

    const handleOpenDescriptionDialog = () => {
        if (currentSubtopic) {
            setDescriptionContent(currentSubtopic.description);
            setOpenDescriptionDialog(true);
        }
    };

    const handleCloseDescriptionDialog = () => {
        setOpenDescriptionDialog(false);
    };

    const handleSaveDescription = async () => {
        if (!currentSubtopic) return;

        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.updateSubtopic(currentSubtopic.id, {
                description: descriptionContent
            });

            if (response.success) {
                showToast('Description updated successfully', 'success');
                handleCloseDescriptionDialog();
                dispatch(fetchSubtopicById(Number(subtopicId)));
            } else {
                showToast('Failed to update description', 'error');
            }
        } catch (error) {
            console.error('Error updating description:', error);
            showToast('Error updating description', 'error');
        }
    };

    const handleSaveSection = async (sectionData: { name: string; order: number }) => {
        try {
            // Use the healthHubService directly since we haven't implemented
            // section actions in the Redux slice yet
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            let response;

            if (selectedSection) {
                response = await healthHubService.updateSection(selectedSection.id, sectionData);
            } else {
                response = await healthHubService.createSection({
                    ...sectionData,
                    subtopic_id: Number(subtopicId)
                });
            }

            if (response.success) {
                showToast(`Section ${selectedSection ? 'updated' : 'created'} successfully`, 'success');
                dispatch(fetchSubtopicById(Number(subtopicId)));
                handleCloseSectionDialog();
            } else {
                showToast(`Failed to ${selectedSection ? 'update' : 'create'} section`, 'error');
            }
        } catch (error) {
            console.error(`Error ${selectedSection ? 'updating' : 'creating'} section:`, error);
            showToast(`Error ${selectedSection ? 'updating' : 'creating'} section`, 'error');
        }
    };

    // Subsection saving is now handled in the SubsectionFormPage component

    const handleDeleteSection = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this section? This will also delete all subsections within.')) {
            try {
                // Use the healthHubService directly since we haven't implemented
                // delete section action in the Redux slice yet
                const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
                const response = await healthHubService.deleteSection(id);

                if (response.success) {
                    showToast('Section deleted successfully', 'success');
                    dispatch(fetchSubtopicById(Number(subtopicId)));
                } else {
                    showToast('Failed to delete section', 'error');
                }
            } catch (error) {
                console.error('Error deleting section:', error);
                showToast('Error deleting section', 'error');
            }
        }
    };

    const handleDeleteSubsection = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this subsection?')) {
            try {
                // Use the healthHubService directly since we haven't implemented
                // delete subsection action in the Redux slice yet
                const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
                const response = await healthHubService.deleteSubsection(id);

                if (response.success) {
                    showToast('Subsection deleted successfully', 'success');
                    dispatch(fetchSubtopicById(Number(subtopicId)));
                } else {
                    showToast('Failed to delete subsection', 'error');
                }
            } catch (error) {
                console.error('Error deleting subsection:', error);
                showToast('Error deleting subsection', 'error');
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <LoadingSpinner />
            </Box>
        );
    }

    if (!currentSubtopic) {
        return (
            <Container>
                <Typography variant="h6">Subtopic not found</Typography>
                <Button component={Link} to="/health-hub" startIcon={<ArrowBackIcon />}>
                    Back to Health Hub
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Breadcrumbs sx={{ mb: 2 }}>
                    <MuiLink component={Link} to="/health-hub" underline="hover" color="inherit">
                        Health Hub
                    </MuiLink>
                    <MuiLink
                        component={Link}
                        to={`/health-hub/topics/${currentSubtopic.topic_id}`}
                        underline="hover"
                        color="inherit"
                    >
                        {currentSubtopic.topic_name}
                    </MuiLink>
                    <Typography color="text.primary">{currentSubtopic.name}</Typography>
                </Breadcrumbs>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom>
                            {currentSubtopic.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Duration: {currentSubtopic.duration}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/health-hub/topics/${currentSubtopic.topic_id}`}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to {currentSubtopic.topic_name}
                    </Button>
                </Box>

                {/* Description display */}
                <Paper sx={{ p: 3, mb: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            Description
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={handleOpenDescriptionDialog}
                        >
                            Edit
                        </Button>
                    </Box>
                    <Box sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: currentSubtopic.description }} />
                </Paper>

                {/* Sections and Subsections */}
                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">Course Content</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenSectionDialog()}
                        >
                            Add New Section
                        </Button>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    {(!currentSubtopic.sections || currentSubtopic.sections.length === 0) ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="h6">No sections found</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Get started by creating a new section
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ mt: 2 }}
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenSectionDialog()}
                            >
                                Add New Section
                            </Button>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {[...currentSubtopic.sections]
                                .sort((a, b) => a.order - b.order)
                                .map((section) => (
                                    <Accordion key={section.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{
                                                '&.MuiAccordionSummary-root': {
                                                    '&:hover .section-actions': { opacity: 1 }
                                                }
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <Box>
                                                    <Typography variant="subtitle1">
                                                        Section {section.order}: {section.name}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {section.subsections.length} subsections
                                                    </Typography>
                                                </Box>
                                                <Box
                                                    className="section-actions"
                                                    sx={{
                                                        display: 'flex',
                                                        opacity: 0,
                                                        transition: 'opacity 0.3s'
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {/* Changed from IconButton to Box to avoid button nesting */}
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'primary.main',
                                                            cursor: 'pointer',
                                                            p: 0.5,
                                                            borderRadius: 1,
                                                            '&:hover': { bgcolor: 'action.hover' }
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleOpenSectionDialog(section);
                                                        }}
                                                    >
                                                        <EditIcon fontSize="small" />
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: 'error.main',
                                                            cursor: 'pointer',
                                                            p: 0.5,
                                                            borderRadius: 1,
                                                            '&:hover': { bgcolor: 'action.hover' }
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteSection(section.id);
                                                        }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            {section.subsections.length === 0 ? (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No subsections found in this section
                                                    </Typography>
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        startIcon={<AddIcon />}
                                                        sx={{ mt: 1 }}
                                                        onClick={() => handleOpenSubsectionDialog(section)}
                                                    >
                                                        Add Subsection
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                    {[...section.subsections]
                                                        .sort((a, b) => a.order - b.order)
                                                        .map((subsection) => (
                                                            <Paper
                                                                key={subsection.id}
                                                                variant="outlined"
                                                                sx={{ p: 2 }}
                                                            >
                                                                <Box sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    '&:hover .subsection-actions': { opacity: 1 }
                                                                }}>
                                                                    <Typography variant="subtitle2">
                                                                        {subsection.order}. {subsection.name}
                                                                    </Typography>
                                                                    <Box
                                                                        className="subsection-actions"
                                                                        sx={{
                                                                            display: 'flex',
                                                                            opacity: 0,
                                                                            transition: 'opacity 0.3s'
                                                                        }}
                                                                    >
                                                                        <IconButton
                                                                            size="small"
                                                                            color="primary"
                                                                            onClick={() => handleNavigateToSubsectionForm(section, subsection)}
                                                                        >
                                                                            <EditIcon fontSize="small" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            color="error"
                                                                            onClick={() => handleDeleteSubsection(subsection.id)}
                                                                        >
                                                                            <DeleteIcon fontSize="small" />
                                                                        </IconButton>
                                                                    </Box>
                                                                </Box>

                                                                <Divider sx={{ my: 1 }} />

                                                                <Box dangerouslySetInnerHTML={{ __html: subsection.content }} />
                                                            </Paper>
                                                        ))}

                                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            startIcon={<AddIcon />}
                                                            onClick={() => handleNavigateToSubsectionForm(section)}
                                                        >
                                                            Add Another Subsection
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            )}
                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                        </Box>
                    )}
                </Paper>
            </Box>

            <SectionDialog
                open={openSectionDialog}
                onClose={handleCloseSectionDialog}
                onSave={handleSaveSection}
                section={selectedSection}
            />

            {/* Subsection dialog has been replaced by a dedicated page */}

            {/* Description Edit Dialog */}
            <Dialog
                open={openDescriptionDialog}
                onClose={handleCloseDescriptionDialog}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>Edit Course Description</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Update the course description with rich text formatting.
                    </DialogContentText>
                    <Box sx={{ mt: 2 }}>
                        <RichTextEditor
                            value={descriptionContent}
                            onChange={setDescriptionContent}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDescriptionDialog}>Cancel</Button>
                    <Button
                        onClick={handleSaveDescription}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default SubtopicDetailPage;