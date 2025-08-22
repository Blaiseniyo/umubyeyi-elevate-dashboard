import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  LinearProgress,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Refresh,
  Search,
  Visibility,
  MedicalServices,
  LightbulbOutlined
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

const TrimesterManagement: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { trimesters, loading, error } = useAppSelector((state) => state.content);

  const [searchQuery, setSearchQuery] = useState('');
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
    dispatch(getTrimestersAsync());
  }, [dispatch]);

  // Filter trimesters based on search query
  const filteredTrimesters = trimesters.filter(trimester =>
    trimester.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trimester.trimester_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(trimester.trimester).includes(searchQuery)
  );

  const handleAddTrimester = () => {
    navigate('/pregnancy-tracker/content/trimester/create', { replace: true });
  };

  const handleEditTrimester = (trimester: Trimester) => {
    navigate(`/pregnancy-tracker/content/trimester/${trimester.id}/edit`, { replace: true });
  };

  const handleViewTrimester = (trimester: Trimester) => {
    navigate(`/pregnancy-tracker/content/trimester/${trimester.id}/view`, { replace: true });
  };

  const handleDeleteTrimester = (trimester: Trimester) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Trimester',
      message: `Are you sure you want to delete "${trimester.trimester_name || `Trimester ${trimester.trimester}`}"? This action cannot be undone.`,
      action: () => {
        dispatch(deleteTrimesterAsync(trimester.id.toString()));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  // Update search query from input
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  const handleRefresh = useCallback(() => {
    dispatch(getTrimestersAsync());
  }, [dispatch]);

  // Format date helper
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to determine week range text
  const getWeekRangeText = (trimester: Trimester): string => {
    return `Weeks ${trimester.start_week}-${trimester.end_week}`;
  };

  // No longer need truncateText as we're handling rich text directly

  if (loading) {
    return <LoadingSpinner message="Loading trimester content..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Trimester Content Management
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            placeholder="Search trimesters..."
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />

          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            sx={{ minWidth: 100 }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddTrimester}
            sx={{ minWidth: 150 }}
          >
            Add Trimester
          </Button>
        </Box>
      </Box>

      {filteredTrimesters.length === 0 && !loading ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: 'center',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          }}
        >
          {searchQuery ? (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                No trimesters found matching "{searchQuery}"
              </Typography>
              <Button variant="outlined" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2, color: 'text.secondary' }}>
                No trimester content created yet
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTrimester}
              >
                Create First Trimester
              </Button>
            </>
          )}
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredTrimesters.map((trimester) => (
            <Box key={trimester.id}>
              <Card sx={{
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 25px rgba(0,0,0,0.1)',
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5 }}>
                    <Box sx={{ width: { xs: '100%', md: '33.333%' }, p: 1.5 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Chip
                            label={`Trimester ${trimester.trimester}`}
                            color="primary"
                            sx={{
                              borderRadius: '4px',
                              fontWeight: 600,
                              bgcolor: trimester.trimester === 1 ? '#016174' :
                                trimester.trimester === 2 ? '#4a8a9a' : '#78B7C5'
                            }}
                          />
                          <Chip
                            label={getWeekRangeText(trimester)}
                            variant="outlined"
                            size="small"
                            sx={{ borderRadius: '4px' }}
                          />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                          {trimester.title || trimester.trimester_name}
                        </Typography>

                        <Box
                          sx={{
                            mb: 2,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical',
                            color: 'text.secondary',
                            fontSize: '0.875rem',
                            lineHeight: 1.43,
                          }}
                          dangerouslySetInnerHTML={{
                            __html: trimester.description || 'No description provided.'
                          }}
                        />

                        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                          <Typography variant="caption" color="text.secondary">
                            Last updated: {formatDate(trimester.updated_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '58.333%' }, p: 1.5 }}>
                      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1 }}>
                          <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <MedicalServices color="primary" fontSize="small" />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Medical Checks
                                </Typography>
                                <Box
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.43,
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: trimester.medical_checks || 'No medical checks specified.'
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>

                          <Box sx={{ width: { xs: '100%', sm: '50%' }, p: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                              <LightbulbOutlined color="primary" fontSize="small" />
                              <Box>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                  Tips and Advice
                                </Typography>
                                <Box
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    color: 'text.secondary',
                                    fontSize: '0.875rem',
                                    lineHeight: 1.43,
                                  }}
                                  dangerouslySetInnerHTML={{
                                    __html: trimester.tips_and_advice || 'No tips specified.'
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => handleViewTrimester(trimester)}
                          >
                            View
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => handleEditTrimester(trimester)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Delete />}
                            onClick={() => handleDeleteTrimester(trimester)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Box>
                    </Box>

                    <Box sx={{ width: { xs: '100%', md: '8.333%' }, p: 1.5 }}>
                      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Box sx={{ height: '80%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="body2" color="text.secondary" align="center">
                              Weeks
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#016174' }}>
                              {trimester.end_week - trimester.start_week + 1}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={100}
                              sx={{
                                width: '80%',
                                height: 8,
                                borderRadius: 4,
                                mt: 1,
                                bgcolor: 'rgba(1, 97, 116, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: trimester.trimester === 1 ? '#016174' :
                                    trimester.trimester === 2 ? '#4a8a9a' : '#78B7C5'
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}



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