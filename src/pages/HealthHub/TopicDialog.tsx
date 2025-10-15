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
import { Topic } from '../../types/healthHub';

interface TopicDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: { name: string }) => void;
    topic: Topic | null;
}

const TopicDialog: React.FC<TopicDialogProps> = ({ open, onClose, onSave, topic }) => {
    const [name, setName] = useState('');
    const [errors, setErrors] = useState({
        name: ''
    });

    useEffect(() => {
        if (topic) {
            setName(topic.name || '');
        } else {
            setName('');
        }
        setErrors({ name: '' });
    }, [topic, open]);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = { name: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                name
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{topic ? 'Edit Topic' : 'Create New Topic'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {topic
                        ? 'Edit the details of this topic.'
                        : 'Enter the details for the new health hub topic.'}
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Topic Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {topic ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TopicDialog;