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

interface SectionDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { name: string; order: number }) => void;
    section: Section | null;
}

const SectionDialog: React.FC<SectionDialogProps> = ({ open, onClose, onSave, section }) => {
    const [name, setName] = useState('');
    const [order, setOrder] = useState<number>(1);
    const [errors, setErrors] = useState({
        name: '',
        order: ''
    });

    useEffect(() => {
        if (section) {
            setName(section.name || '');
            setOrder(section.order || 1);
        } else {
            setName('');
            setOrder(1);
        }
        setErrors({ name: '', order: '' });
    }, [section, open]);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { name: '', order: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
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
                order
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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

                    <TextField
                        label="Order"
                        type="number"
                        value={order}
                        onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                        fullWidth
                        required
                        inputProps={{ min: 1 }}
                        error={!!errors.order}
                        helperText={errors.order || 'The order in which this section appears in the course'}
                    />
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