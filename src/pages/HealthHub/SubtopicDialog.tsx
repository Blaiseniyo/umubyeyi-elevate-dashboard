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
import { Subtopic } from '../../types/healthHub';
import RichTextEditor from '../../components/Common/richTextEditor/RichTextEditor';

interface SubtopicDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: {
        name: string;
        cover_image_url: string;
        content: string;
        course_duration: string;
    }) => void;
    subtopic: Subtopic | null;
}

const SubtopicDialog: React.FC<SubtopicDialogProps> = ({ open, onClose, onSave, subtopic }) => {
    const [name, setName] = useState('');
    const [thumbnail, setThumbnail] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [errors, setErrors] = useState({
        name: '',
        thumbnail: '',
        description: '',
        duration: ''
    });

    useEffect(() => {
        if (subtopic) {
            setName(subtopic.name || '');
            setThumbnail(subtopic.cover_image_url || '');
            setDescription(subtopic.content || '');
            setDuration(subtopic.course_duration || '');
        } else {
            setName('');
            setThumbnail('');
            setDescription('');
            setDuration('');
        }
        setErrors({ name: '', thumbnail: '', description: '', duration: '' });
    }, [subtopic, open]);

    const validateForm = (): boolean => {
        let isValid = true;
        const newErrors = {
            name: '',
            thumbnail: '',
            description: '',
            duration: ''
        };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        if (!thumbnail.trim()) {
            newErrors.thumbnail = 'Thumbnail URL is required';
            isValid = false;
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        if (!duration.trim()) {
            newErrors.duration = 'Duration is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSave({
                name,
                cover_image_url: thumbnail,
                content: description,
                course_duration: duration
            });
        }
    };

    const handleEditorChange = (content: string) => {
        setDescription(content);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{subtopic ? 'Edit Subtopic' : 'Create New Subtopic'}</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {subtopic
                        ? 'Edit the details of this subtopic.'
                        : 'Enter the details for the new subtopic.'}
                </DialogContentText>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    <TextField
                        label="Subtopic Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.name}
                        helperText={errors.name}
                    />

                    <TextField
                        label="Thumbnail URL"
                        value={thumbnail}
                        onChange={(e) => setThumbnail(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.thumbnail}
                        helperText={errors.thumbnail}
                    />

                    <TextField
                        label="Duration (e.g., 2h, 45m)"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        fullWidth
                        required
                        error={!!errors.duration}
                        helperText={errors.duration}
                    />

                    <Box>
                        <Box sx={{ mb: 1 }}>
                            <DialogContentText>Description</DialogContentText>
                            {errors.description && (
                                <DialogContentText color="error" sx={{ fontSize: '0.75rem' }}>
                                    {errors.description}
                                </DialogContentText>
                            )}
                        </Box>
                        <RichTextEditor
                            value={description}
                            onChange={handleEditorChange}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    {subtopic ? 'Update' : 'Create'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubtopicDialog;