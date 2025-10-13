import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Box,
} from '@mui/material';
import RichTextEditor from '../../../components/Common/richTextEditor/RichTextEditor';

interface DescriptionDialogProps {
    open: boolean;
    content: string;
    onClose: () => void;
    onSave: () => void;
    onChange: (content: string) => void;
}

const DescriptionDialog: React.FC<DescriptionDialogProps> = ({
    open,
    content,
    onClose,
    onSave,
    onChange
}) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
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
                        value={content}
                        onChange={onChange}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={onSave}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DescriptionDialog;