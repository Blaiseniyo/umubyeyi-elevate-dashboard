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
import { Section } from '../../types/healthHub';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';

interface SectionDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { name: string; content: string }) => void;
    section: Section | null;
}

const SectionDialog: React.FC<SectionDialogProps> = ({ open, onClose, onSave, section }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        content: ''
    });

    useEffect(() => {
        if (section) {
            setName(section.name || '');
            setContent(section.content || '');
        } else {
            setName('');
            setContent('');
        }
        setErrors({ name: '', content: '' });
    }, [section, open]);

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

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>{section ? 'Edit Section' : 'Create New Section'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {section
                        ? 'Edit the details of this section.'
                        : 'Enter the details for the new section.'}
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Section Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <Box sx={{ mt: 2 }}>
                        {/* <Box sx={{ mb: 1 }}>Content</Box> */}
                        <RichTextEditor
                            value={content}
                            onChange={setContent}
                        />
                        {errors.content && (
                            <Box sx={{ color: 'error.main', mt: 1, fontSize: '0.75rem' }}>
                                {errors.content}
                            </Box>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {section ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SectionDialog;