import React from 'react';
import {
    Typography,
    Box,
    Button,
    Divider,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Section, Subsection } from '../../../types/healthHub';

interface CourseContentTabProps {
    subtopicId?: string; // Made optional since it's unused
    sections: Section[];
    handleOpenSectionDialog: (section?: Section) => void;
    handleNavigateToSubsectionForm: (section: Section, subsection?: Subsection) => void;
    handleDeleteSection: (id: number) => void;
    handleDeleteSubsection: (id: number) => void;
}

const CourseContentTab: React.FC<CourseContentTabProps> = ({
    sections,
    handleOpenSectionDialog,
    handleNavigateToSubsectionForm,
    handleDeleteSection,
    handleDeleteSubsection
}) => {
    // Removed unused navigate variable

    return (
        <>
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

            {(!sections || sections.length === 0) ? (
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
                    {sections.map((section) => (
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
                                            {section.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {section.sub_sections?.length || 0} subsections
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
                                {!section.sub_sections || section.sub_sections.length === 0 ? (
                                    <Box sx={{ textAlign: 'center', py: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No subsections found in this section
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            sx={{ mt: 1 }}
                                            onClick={() => handleNavigateToSubsectionForm(section)}
                                        >
                                            Add Subsection
                                        </Button>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        {(section.sub_sections || []).map((subsection) => (
                                            <Accordion
                                                key={subsection.id}
                                                variant="outlined"
                                                sx={{
                                                    border: '1px solid rgba(0, 0, 0, 0.12)',
                                                    borderRadius: '4px',
                                                    '&:before': { display: 'none' }
                                                }}
                                            >
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    sx={{
                                                        '&.MuiAccordionSummary-root': {
                                                            '&:hover .subsection-actions': { opacity: 1 }
                                                        }
                                                    }}
                                                >
                                                    <Box sx={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        width: '100%',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Typography variant="subtitle2">
                                                            {subsection.name}
                                                        </Typography>
                                                        <Box
                                                            className="subsection-actions"
                                                            sx={{
                                                                display: 'flex',
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s'
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
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
                                                                    handleNavigateToSubsectionForm(section, subsection);
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
                                                                    handleDeleteSubsection(subsection.id);
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ p: 2 }}>
                                                    <Box dangerouslySetInnerHTML={{ __html: subsection.content }} />
                                                </AccordionDetails>
                                            </Accordion>
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
        </>
    );
};

export default CourseContentTab;