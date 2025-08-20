import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getTrimestersAsync,
  deleteTrimesterAsync,
} from '../../store/slices/contentSlice';
import { Trimester } from '../../types';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import TrimesterDialog from './TrimesterDialog';

const TrimesterManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trimesters, loading, error } = useAppSelector((state) => state.content);

  const [selectedTrimester, setSelectedTrimester] = useState<Trimester | null>(null);
  const [trimesterDialogOpen, setTrimesterDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => { },
  });

  useEffect(() => {
    // dispatch(getTrimestersAsync());
  }, [dispatch]);

  const handleAddTrimester = () => {
    setSelectedTrimester(null);
    setTrimesterDialogOpen(true);
  };

  const handleEditTrimester = (trimester: Trimester) => {
    setSelectedTrimester(trimester);
    setTrimesterDialogOpen(true);
  };

  const handleDeleteTrimester = (trimester: Trimester) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Trimester',
      message: `Are you sure you want to delete "${trimester.name}"? This action cannot be undone.`,
      action: () => {
        dispatch(deleteTrimesterAsync(trimester.id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const handleRefresh = () => {
    dispatch(getTrimestersAsync());
  };

  if (loading) {
    return <LoadingSpinner message="Loading trimesters..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Trimester Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddTrimester}
        >
          Add Trimester
        </Button>
      </Box>

      <Grid container spacing={3}>
        {trimesters.map((trimester) => (
          <Grid item xs={12} md={4} key={trimester.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Chip
                      label={`Trimester ${trimester.number}`}
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {trimester.name}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleEditTrimester(trimester)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteTrimester(trimester)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Box
                  sx={{
                    maxHeight: 150,
                    overflow: 'hidden',
                    '& p': { margin: 0 },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      fontSize: '1rem',
                      margin: '0.5rem 0',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: trimester.content }}
                />

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  Created: {new Date(trimester.createdAt).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {trimesters.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  No trimesters created yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddTrimester}
                >
                  Create First Trimester
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      <TrimesterDialog
        open={trimesterDialogOpen}
        trimester={selectedTrimester}
        onClose={() => {
          setTrimesterDialogOpen(false);
          setSelectedTrimester(null);
        }}
        onSave={() => {
          setTrimesterDialogOpen(false);
          setSelectedTrimester(null);
          handleRefresh();
        }}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.action}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default TrimesterManagement;