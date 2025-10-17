import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Button,
    Box
} from '@mui/material';
import { Subsection } from '../../types/healthHub';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';

interface SubsectionDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { name: string; content: string }) => void;
    subsection: Subsection | null;
    sectionId?: number | null;
}

const SubsectionDialog: React.FC<SubsectionDialogProps> = ({ open, onClose, onSave, subsection }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        content: ''
    });

    useEffect(() => {
        if (subsection) {
            setName(subsection.name || '');
            setContent(subsection.content || '');
        } else {
            setName('');
            setContent('');
        }
        setErrors({ name: '', content: '' });
    }, [subsection, open]);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { name: '', content: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!content.trim()) {
            newErrors.content = 'Content is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                name,
                content
            });
        }
    };

    const handleEditorChange = (value: string) => {
        setContent(value);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{subsection ? 'Edit Subsection' : 'Create New Subsection'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {subsection
                        ? 'Edit the details of this subsection.'
                        : 'Enter the details for the new subsection.'}
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Subsection Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />



                    <Box>
                        <Box sx={{ mb: 1 }}>
                            <DialogContentText>Content</DialogContentText>
                            {errors.content && (
                                <DialogContentText color="error" sx={{ fontSize: '0.75rem' }}>
                                    {errors.content}
                                </DialogContentText>
                            )}
                        </Box>
                        <RichTextEditor
                            value={content}
                            onChange={handleEditorChange}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {subsection ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubsectionDialog;