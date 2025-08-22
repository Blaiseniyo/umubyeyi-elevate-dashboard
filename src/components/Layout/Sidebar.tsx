import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard,
  People,
  PregnantWoman,
  Settings,
  ExitToApp,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { logoutAsync } from '../../store/slices/authSlice';

const expandedWidth = 280;
const collapsedWidth = 72;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'User Management', icon: <People />, path: '/users' },
  { text: 'Pregnancy Tracker', icon: <PregnantWoman />, path: '/pregnancy-tracker/content' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [expanded, setExpanded] = useState<boolean>(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  const drawerWidth = expanded ? expandedWidth : collapsedWidth;

  useEffect(() => {
    localStorage.setItem('sidebarExpanded', JSON.stringify(expanded));
  }, [expanded]);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    dispatch(logoutAsync());
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar
        sx={{
          px: expanded ? 3 : 1,
          py: expanded ? 2 : 1,
          display: 'flex',
          justifyContent: expanded ? 'flex-start' : 'center'
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          width: '100%'
        }}>
          {expanded ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  component="img"
                  src="/umubyeyi_logo.png"
                  alt="Umubyeyi Elevate"
                  sx={{ height: 40 }}
                />
              </Box>
              <IconButton
                onClick={toggleSidebar}
                size="small"
                sx={{
                  width: 28,
                  height: 28
                }}
                aria-label="Collapse sidebar"
              >
                <ChevronLeft fontSize="small" />
              </IconButton>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Box
                  component="img"
                  src="/favicon.ico"
                  alt="Umubyeyi Icon"
                  sx={{
                    height: 40,
                    width: 30,
                    objectFit: 'contain',
                  }}
                />
                <Tooltip title="Expand sidebar" placement="right">
                  <IconButton
                    onClick={toggleSidebar}
                    size="small"
                    sx={{
                      mt: 1,
                      width: 24,
                      height: 24,
                      backgroundColor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'primary.dark',
                      }
                    }}
                    aria-label="Expand sidebar"
                  >
                    <ChevronRight fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>

      <Divider />

      <Box sx={{ px: expanded ? 2 : 1, py: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: expanded ? 2 : 0,
            p: expanded ? 2 : 1,
            bgcolor: 'grey.50',
            borderRadius: 2,
            justifyContent: expanded ? 'flex-start' : 'center',
          }}
        >
          <Tooltip title={!expanded ? `${user?.firstName || user?.first_name} ${user?.lastName || user?.last_name}` : ''} placement="right">
            <Avatar
              sx={{
                width: 36,
                height: 36,
                bgcolor: 'primary.light',
                fontSize: '0.9rem',
              }}
            >
              {user?.firstName?.[0] || user?.first_name?.[0]}{user?.lastName?.[0] || user?.last_name?.[0]}
            </Avatar>
          </Tooltip>
          {expanded && (
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                {user?.firstName || user?.first_name} {user?.lastName || user?.last_name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {user?.role || 'User'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <List sx={{ flex: 1, px: expanded ? 2 : 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={!expanded ? item.text : ''} placement="right">
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={location.pathname === item.path}
                sx={{
                  borderRadius: 2,
                  justifyContent: expanded ? 'flex-start' : 'center',
                  py: expanded ? 1 : 1.5,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                  },
                  '&:hover': {
                    bgcolor: 'grey.100',
                  },
                }}
              >
                <ListItemIcon sx={{
                  minWidth: expanded ? 40 : 0,
                  mr: expanded ? 2 : 0,
                  justifyContent: 'center'
                }}>
                  {item.icon}
                </ListItemIcon>
                {expanded && (
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: location.pathname === item.path ? 600 : 400,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List sx={{ px: expanded ? 2 : 1, pb: 2 }}>
        <ListItem disablePadding>
          <Tooltip title={!expanded ? 'Logout' : ''} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                justifyContent: expanded ? 'flex-start' : 'center',
                py: expanded ? 1 : 1.5,
                color: 'error.main',
                '&:hover': {
                  bgcolor: 'error.50',
                },
              }}
            >
              <ListItemIcon sx={{
                minWidth: expanded ? 40 : 0,
                mr: expanded ? 2 : 0,
                justifyContent: 'center',
                color: 'error.main'
              }}>
                <ExitToApp />
              </ListItemIcon>
              {expanded && (
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  // Dispatch a custom event when sidebar state changes to notify other components
  useEffect(() => {
    const event = new CustomEvent('sidebarStateChanged', {
      detail: { expanded }
    });
    document.dispatchEvent(event);

    // Trigger a window resize event to help any components that depend on window dimensions
    window.dispatchEvent(new Event('resize'));
  }, [expanded]);

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms'
      }}
    >
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: expandedWidth,
            border: 'none',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
            transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
            overflowX: 'hidden',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;