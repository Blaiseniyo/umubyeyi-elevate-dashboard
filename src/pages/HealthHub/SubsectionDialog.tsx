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
    onSave: (data: { name: string; content: string; order: number }) => void;
    subsection: Subsection | null;
    sectionId?: number | null;
}

const SubsectionDialog: React.FC<SubsectionDialogProps> = ({ open, onClose, onSave, subsection }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [order, setOrder] = useState<number>(1);
    const [errors, setErrors] = useState({
        name: '',
        content: '',
        order: ''
    });

    useEffect(() => {
        if (subsection) {
            setName(subsection.name || '');
            setContent(subsection.content || '');
            setOrder(subsection.order || 1);
        } else {
            setName('');
            setContent('');
            setOrder(1);
        }
        setErrors({ name: '', content: '', order: '' });
    }, [subsection, open]);

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

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                name,
                content,
                order
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