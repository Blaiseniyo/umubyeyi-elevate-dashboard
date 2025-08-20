import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
} from '@mui/material';
import { useAppDispatch } from '../../hooks';
import { createTrimesterAsync, updateTrimesterAsync } from '../../store/slices/contentSlice';
import { Trimester } from '../../types';
import RichTextEditor from '../../components/Common/RichTextEditor';

interface TrimesterDialogProps {
  open: boolean;
  trimester: Trimester | null;
  onClose: () => void;
  onSave: () => void;
}

const TrimesterDialog: React.FC<TrimesterDialogProps> = ({ 
  open, 
  trimester, 
  onClose, 
  onSave 
}) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    number: 1 as 1 | 2 | 3,
    name: '',
    content: '',
  });

  useEffect(() => {
    if (trimester) {
      setFormData({
        number: trimester.number,
        name: trimester.name,
        content: trimester.content,
      });
    } else {
      setFormData({
        number: 1,
        name: '',
        content: '',
      });
    }
  }, [trimester]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'number' ? parseInt(value) as 1 | 2 | 3 : value,
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (trimester) {
        await dispatch(updateTrimesterAsync({
          id: trimester.id,
          data: {
            name: formData.name,
            content: formData.content,
          },
        })).unwrap();
      } else {
        await dispatch(createTrimesterAsync(formData)).unwrap();
      }
      onSave();
    } catch (error) {
      console.error('Failed to save trimester:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {trimester ? 'Edit Trimester' : 'Create New Trimester'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              select
              label="Trimester Number"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
              disabled={!!trimester} // Don't allow changing number for existing trimesters
            >
              <MenuItem value={1}>First Trimester</MenuItem>
              <MenuItem value={2}>Second Trimester</MenuItem>
              <MenuItem value={3}>Third Trimester</MenuItem>
            </TextField>

            <TextField
              fullWidth
              label="Trimester Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Early Pregnancy"
            />

            <RichTextEditor
              label="Content"
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Enter detailed information about this trimester..."
              height={300}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {trimester ? 'Update' : 'Create'} Trimester
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TrimesterDialog;