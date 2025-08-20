import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  tooltipClasses,
  TooltipProps,
  styled,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Refresh,
  InfoOutlined,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getWeeklyContentAsync,
  deleteWeeklyContentAsync,
  setFilters,
} from '../../store/slices/contentSlice';
import { WeeklyContent } from '../../types';
import ErrorMessage from '../../components/Common/ErrorMessage';
import ConfirmDialog from '../../components/Common/ConfirmDialog';

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#fff',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(14),
    border: '1px solid #dadde9',
    padding: '16px',
    overflowY: 'auto',
    maxHeight: '400px',
    boxShadow: theme.shadows[3],
    zIndex: theme.zIndex.tooltip + 100, // Ensure it's above other elements
  },
}));

const WeeklyContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { weeklyContent, loading, error, total, page, filters } = useAppSelector((state) => state.content);

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

  const [weekFilter, setWeekFilter] = useState('');
  const [trimesterFilter, setTrimesterFilter] = useState('');
  const [searchTriggered, setSearchTriggered] = useState(false);

  // Add state to track which tooltip is open
  const [openTooltip, setOpenTooltip] = useState<number | null>(null);

  // Memoize filters to prevent unnecessary re-renders
  const currentFilters = useMemo(() => ({ ...filters }), [
    filters.page,
    filters.limit,
    filters.week,
    filters.trimester,
    filters.search,
  ]);

  // Use useCallback to prevent recreation of this function on each render
  const fetchContent = useCallback(() => {
    dispatch(getWeeklyContentAsync(currentFilters));
  }, [dispatch, currentFilters]);

  // Only fetch when component mounts or when search is explicitly triggered
  useEffect(() => {
    if (searchTriggered) {
      fetchContent();
      setSearchTriggered(false);
    }
  }, [fetchContent, searchTriggered]);

  // Initial data load
  useEffect(() => {
    fetchContent();
  }, []);

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      week: weekFilter ? parseInt(weekFilter) : undefined,
      trimester: trimesterFilter ? parseInt(trimesterFilter) : undefined,
      page: 1,
    }));
    setSearchTriggered(true);
  };

  const handleRefresh = () => {
    setSearchTriggered(true);
  };

  // Navigation functions with {replace: true} to avoid history issues
  const handleAddContent = () => {
    navigate('/content/weekly/create', { replace: true });
  };

  const handleEditContent = (content: WeeklyContent) => {
    navigate(`/content/weekly/${content.id}/edit`, { replace: true });
  };

  const handleViewContent = (content: WeeklyContent) => {
    navigate(`/content/weekly/${content.id}/view`, { replace: true });
  };

  const handleDeleteContent = (content: WeeklyContent) => {
    setConfirmDialog({
      open: true,
      title: 'Delete Weekly Content',
      message: `Are you sure you want to delete content for week ${content.week}? This action cannot be undone.`,
      action: () => {
        dispatch(deleteWeeklyContentAsync(content.id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns: GridColDef[] = [
    {
      field: 'week',
      headerName: 'Week',
      width: 90,
      renderCell: (params) => (
        <Chip
          label={`Week ${params.value}`}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: 'trimester_name',
      headerName: 'Trimester',
      width: 150,

      renderCell: (params) => (
        <Chip
          label={params.value || ''}
          color="secondary"
          size="small"
          sx={{ fontWeight: 'bold' }}
        />
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      width: 300,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 400,
      renderCell: (params) => {
        // Clean text for display (strip HTML for table cell)
        const plainText = params.value ?
          (() => {
            // First remove HTML tags
            const withoutTags = params.value.replace(/<\/?[^>]+(>|$)/g, '');

            // Then decode HTML entities using DOM parser
            const textarea = document.createElement('textarea');
            textarea.innerHTML = withoutTags;

            // Return decoded text with normalized whitespace
            return textarea.value.replace(/\s+/g, ' ').trim();
          })() : '';

        return (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            width: '100%'
          }}>
            <Typography
              variant="body2"
              sx={{
                alignItems: 'center',
                display: 'flex',
                height: '100%',
                flexGrow: 1,
                mr: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {plainText}
            </Typography>

            <Box onClick={(e) => e.stopPropagation()}>
              <HtmlTooltip
                onClose={() => setOpenTooltip(null)}
                open={openTooltip === params.row.id}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {params.row.title}
                    </Typography>
                    <Box
                      dangerouslySetInnerHTML={{ __html: params.value }}
                      sx={{
                        lineHeight: 1.6,
                        fontFamily: '"Roboto", "sans-serif"',
                        '& p': { margin: '8px 0' },
                        '& ul': { paddingLeft: '20px' },
                        '& li': { margin: '4px 0' }
                      }}
                    />
                  </Box>
                }
                placement="top-start"
                arrow
              >
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenTooltip(prevId => prevId === params.row.id ? null : params.row.id);
                  }}
                  sx={{
                    color: 'primary.main',
                    padding: '2px',
                    '&:hover': {
                      bgcolor: 'rgba(1, 97, 116, 0.1)'
                    }
                  }}
                >
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </HtmlTooltip>
            </Box>
          </Box>
        );
      },
    },
    {
      field: 'created_at',
      headerName: 'Created',
      width: 130,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          {params.value ? formatDate(params.value) : ''}
        </Typography>
      ),
    },
    {
      field: 'updated_at',
      headerName: 'Updated',
      width: 150,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            // justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            maxWidth: '100%',
          }}
        >
          {params.value ? formatDate(params.value) : ''}
        </Typography>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params: GridRowParams) => {
        const content = params.row as WeeklyContent;
        return [
          <GridActionsCellItem
            icon={<Visibility />}
            label="View"
            onClick={() => handleViewContent(content)}
          />,
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditContent(content)}
          />,
          <GridActionsCellItem
            icon={<Delete />}
            label="Delete"
            onClick={() => handleDeleteContent(content)}
          />,
        ];
      },
    },
  ];

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  // Handle pagination changes
  const handlePaginationChange = (model: any) => {
    dispatch(setFilters({
      ...filters,
      page: model.page + 1,
      limit: model.pageSize,
    }));
    setSearchTriggered(true);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Weekly Content Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleRefresh}>
            <Refresh />
          </IconButton>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddContent}
          >
            Add Weekly Content
          </Button>
        </Box>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              label="Week Number"
              value={weekFilter}
              onChange={(e) => setWeekFilter(e.target.value)}
              size="small"
              type="number"
              inputProps={{ min: 1, max: 40 }}
              sx={{ minWidth: 120 }}
            />
            <TextField
              select
              label="Trimester"
              value={trimesterFilter}
              onChange={(e) => setTrimesterFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="1">First</MenuItem>
              <MenuItem value="2">Second</MenuItem>
              <MenuItem value="3">Third</MenuItem>
            </TextField>
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<Search />}
            >
              Search
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={weeklyContent || []}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{
              page: page - 1,
              pageSize: filters.limit || 10,
            }}
            onPaginationModelChange={handlePaginationChange}
            paginationMode="server"
            rowCount={total}
            disableRowSelectionOnClick
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #f0f0f0',
              },
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: 'grey.50',
                borderBottom: '2px solid #e0e0e0',
              },
            }}
          />
        </Box>
      </Card>

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

export default WeeklyContentManagement;