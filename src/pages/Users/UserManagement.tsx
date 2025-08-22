import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
} from '@mui/x-data-grid';
import {
  Edit,
  Delete,
  PersonAdd,
  PersonRemove,
  Search,
  Refresh,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getUsersAsync,
  promoteToStaffAsync,
  demoteFromStaffAsync,
  deleteUserAsync,
  setFilters,
} from '../../store/slices/userSlice';
import { User } from '../../types';
import LoadingSpinner from '../../components/Common/LoadingSpinner';
import ErrorMessage from '../../components/Common/ErrorMessage';
import ConfirmDialog from '../../components/Common/ConfirmDialog';
import UserDialog from './UserDialog';

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error, total, page, filters } = useAppSelector((state) => state.users);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    action: () => {},
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    // dispatch(getUsersAsync(filters));
  }, [dispatch, filters]);

  const handleSearch = () => {
    dispatch(setFilters({
      ...filters,
      search: searchTerm,
      status: statusFilter || undefined,
      role: roleFilter || undefined,
      page: 1,
    }));
  };

  const handleRefresh = () => {
    dispatch(getUsersAsync(filters));
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserDialogOpen(true);
  };

  const handlePromoteUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: 'Promote to Staff',
      message: `Are you sure you want to promote ${user.firstName} ${user.lastName} to staff?`,
      action: () => {
        dispatch(promoteToStaffAsync(user.id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const handleDemoteUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: 'Demote from Staff',
      message: `Are you sure you want to demote ${user.firstName} ${user.lastName} from staff?`,
      action: () => {
        dispatch(demoteFromStaffAsync(user.id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const handleDeleteUser = (user: User) => {
    setConfirmDialog({
      open: true,
      title: 'Delete User',
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
      action: () => {
        dispatch(deleteUserAsync(user.id));
        setConfirmDialog(prev => ({ ...prev, open: false }));
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'staff':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      valueGetter: (params) => `${params.row.firstName} ${params.row.lastName}`,
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      width: 150,
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'createdAt',
      headerName: 'Created',
      width: 120,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params: GridRowParams) => {
        const user = params.row as User;
        const actions = [
          <GridActionsCellItem
            icon={<Edit />}
            label="Edit"
            onClick={() => handleEditUser(user)}
          />,
        ];

        if (user.role === 'user') {
          actions.push(
            <GridActionsCellItem
              icon={<PersonAdd />}
              label="Promote to Staff"
              onClick={() => handlePromoteUser(user)}
            />
          );
        } else if (user.role === 'staff') {
          actions.push(
            <GridActionsCellItem
              icon={<PersonRemove />}
              label="Demote from Staff"
              onClick={() => handleDemoteUser(user)}
            />
          );
        }

        if (user.role !== 'admin') {
          actions.push(
            <GridActionsCellItem
              icon={<Delete />}
              label="Delete"
              onClick={() => handleDeleteUser(user)}
            />
          );
        }

        return actions;
      },
    },
  ];

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRefresh} />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          User Management
        </Typography>
        <Tooltip title="Refresh">
          <IconButton onClick={handleRefresh}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ minWidth: 200 }}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspended">Suspended</MenuItem>
            </TextField>
            <TextField
              select
              label="Role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
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
            rows={users}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{
              page: page - 1,
              pageSize: filters.limit || 10,
            }}
            onPaginationModelChange={(model) => {
              dispatch(setFilters({
                ...filters,
                page: model.page + 1,
                limit: model.pageSize,
              }));
            }}
            rowCount={total}
            paginationMode="server"
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

      <UserDialog
        open={userDialogOpen}
        user={selectedUser}
        onClose={() => {
          setUserDialogOpen(false);
          setSelectedUser(null);
        }}
        onSave={() => {
          setUserDialogOpen(false);
          setSelectedUser(null);
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

export default UserManagement;