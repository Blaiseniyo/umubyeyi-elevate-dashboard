import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Breadcrumbs,
    Link as MuiLink,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchSubtopicById } from '../../store/slices/healthHubSlice';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import { Section, Subsection } from '../../types/healthHub';
import SectionDialog from './SectionDialog';
import TabsSection from './components/TabsSection';
import DescriptionSection from './components/DescriptionSection';
import DescriptionDialog from './components/DescriptionDialog';

const SubtopicDetailPage: React.FC = () => {
    const { subtopicId } = useParams<{ subtopicId: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentSubtopic, loading, error } = useAppSelector(state => state.healthHub);
    const [openSectionDialog, setOpenSectionDialog] = useState<boolean>(false);
    const [openDescriptionDialog, setOpenDescriptionDialog] = useState<boolean>(false);
    const [descriptionContent, setDescriptionContent] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<Section | null>(null);

    // Confirmation dialog states
    const [openDeleteSectionDialog, setOpenDeleteSectionDialog] = useState<boolean>(false);
    const [openDeleteSubsectionDialog, setOpenDeleteSubsectionDialog] = useState<boolean>(false);
    const [sectionToDelete, setSectionToDelete] = useState<number | null>(null);
    const [subsectionToDelete, setSubsectionToDelete] = useState<number | null>(null);

    const { showToast } = useToast();

    useEffect(() => {
        if (subtopicId) {
            dispatch(fetchSubtopicById(Number(subtopicId)));
        }
    }, [dispatch, subtopicId]);

    // useEffect(() => {
    //     if (currentSubtopic) {
    //     }
    // }, [currentSubtopic]);

    useEffect(() => {
        if (currentSubtopic?.content) {
            setDescriptionContent(currentSubtopic.content);
        }
    }, [currentSubtopic]);

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
            navigate(`/health-hub/subtopics/${subtopicId}/sections/${section.id}/subsections/${subsection.id}/edit`, {
                state: {
                    section,
                    subsection
                }
            });
        } else {
            navigate(`/health-hub/subtopics/${subtopicId}/sections/${section.id}/subsections/create`, {
                state: {
                    section
                }
            });
        }
    };

    const handleOpenDescriptionDialog = () => {
        if (currentSubtopic) {
            setDescriptionContent(currentSubtopic.content);
            setOpenDescriptionDialog(true);
        }
    };

    const handleCloseDescriptionDialog = () => {
        setOpenDescriptionDialog(false);
    };

    const handleSaveDescription = async () => {
        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.updateSubtopic(Number(subtopicId), {
                content: descriptionContent
            });

            if (response.success) {
                showToast('Description updated successfully', 'success');
                dispatch(fetchSubtopicById(Number(subtopicId)));
                handleCloseDescriptionDialog();
            } else {
                showToast('Failed to update description', 'error');
            }
        } catch (error) {
            console.error('Error updating description:', error);
            showToast('Error updating description', 'error');
        }
    };

    const handleSaveSection = async (formData: any) => {
        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);

            if (selectedSection) {
                // Update existing section
                const response = await healthHubService.updateSection(selectedSection.id, {
                    name: formData.name,
                    content: formData.content
                });

                if (response.success) {
                    showToast('Section updated successfully', 'success');
                    dispatch(fetchSubtopicById(Number(subtopicId)));
                    handleCloseSectionDialog();
                } else {
                    showToast('Failed to update section', 'error');
                }
            } else {
                // Create new section
                const payload = {
                    name: formData.name,
                    content: formData.content,
                    subtopic_id: Number(subtopicId)
                };

                const response = await healthHubService.createSection(payload);

                if (response.success) {
                    showToast('Section created successfully', 'success');
                    dispatch(fetchSubtopicById(Number(subtopicId)));
                    handleCloseSectionDialog();
                } else {
                    showToast('Failed to create section', 'error');
                }
            }
        } catch (error) {
            console.error(`Error ${selectedSection ? 'updating' : 'creating'} section:`, error);
            showToast(`Error ${selectedSection ? 'updating' : 'creating'} section`, 'error');
        }
    };

    // Open confirmation dialog for section deletion
    const handleDeleteSection = (id: number) => {
        setSectionToDelete(id);
        setOpenDeleteSectionDialog(true);
    };

    // Open confirmation dialog for subsection deletion
    const handleDeleteSubsection = (id: number) => {
        setSubsectionToDelete(id);
        setOpenDeleteSubsectionDialog(true);
    };

    // Handle actual section deletion after confirmation
    const confirmDeleteSection = async () => {
        if (sectionToDelete === null) return;

        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.deleteSection(sectionToDelete);

            if (response.success) {
                showToast('Section deleted successfully', 'success');
                dispatch(fetchSubtopicById(Number(subtopicId)));
            } else {
                showToast(response.message || 'Failed to delete section', 'error');
            }
        } catch (error: any) {
            console.error('Error deleting section:', error);
            showToast(error?.message || 'Error deleting section', 'error');
        } finally {
            // Close dialog and reset state
            setOpenDeleteSectionDialog(false);
            setSectionToDelete(null);
        }
    };

    // Handle actual subsection deletion after confirmation
    const confirmDeleteSubsection = async () => {
        if (subsectionToDelete === null) return;

        try {
            const healthHubService = await import('../../services/healthHubService').then(mod => mod.healthHubService);
            const response = await healthHubService.deleteSubsection(subsectionToDelete);

            if (response.success) {
                showToast('Subsection deleted successfully', 'success');
                dispatch(fetchSubtopicById(Number(subtopicId)));
            } else {
                showToast(response.message || 'Failed to delete subsection', 'error');
            }
        } catch (error: any) {
            console.error('Error deleting subsection:', error);
            showToast(error?.message || 'Error deleting subsection', 'error');
        } finally {
            // Close dialog and reset state
            setOpenDeleteSubsectionDialog(false);
            setSubsectionToDelete(null);
        }
    }; if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <LoadingSpinner />
            </Container>
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
                        to={`/health-hub/topics/${currentSubtopic.parent_topic_id}`}
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
                            Duration: {currentSubtopic.course_duration}
                        </Typography>
                    </Box>

                    <Button
                        variant="outlined"
                        component={Link}
                        to={`/health-hub/topics/${currentSubtopic.parent_topic_id}`}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back to {currentSubtopic.topic_name}
                    </Button>
                </Box>

                {/* Description Section */}
                <DescriptionSection
                    description={currentSubtopic.content}
                    onOpenDescriptionDialog={handleOpenDescriptionDialog}
                />

                {/* Tabs Section */}
                <TabsSection
                    subtopicId={subtopicId || ''}
                    sections={currentSubtopic.sections || []}
                    videos={currentSubtopic.videos || []}
                    podcasts={currentSubtopic.podcasts || []}
                    onOpenSectionDialog={handleOpenSectionDialog}
                    onDeleteSection={handleDeleteSection}
                    onNavigateToSubsectionForm={handleNavigateToSubsectionForm}
                    onDeleteSubsection={handleDeleteSubsection}
                />
            </Box>

            <SectionDialog
                open={openSectionDialog}
                onClose={handleCloseSectionDialog}
                onSave={handleSaveSection}
                section={selectedSection}
            />

            <DescriptionDialog
                open={openDescriptionDialog}
                content={descriptionContent}
                onClose={handleCloseDescriptionDialog}
                onSave={handleSaveDescription}
                onChange={setDescriptionContent}
            />

            {/* Confirm Delete Section Dialog */}
            <ConfirmDialog
                open={openDeleteSectionDialog}
                title="Delete Section"
                message="Are you sure you want to delete this section? This will also delete all sub-sections within."
                onConfirm={confirmDeleteSection}
                onCancel={() => {
                    setOpenDeleteSectionDialog(false);
                    setSectionToDelete(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
            />

            {/* Confirm Delete Subsection Dialog */}
            <ConfirmDialog
                open={openDeleteSubsectionDialog}
                title="Delete Subsection"
                message="Are you sure you want to delete this subsection?"
                onConfirm={confirmDeleteSubsection}
                onCancel={() => {
                    setOpenDeleteSubsectionDialog(false);
                    setSubsectionToDelete(null);
                }}
                confirmText="Delete"
                cancelText="Cancel"
                severity="error"
            />
        </Container>
    );
};

export default SubtopicDetailPage;