import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    const savedState = localStorage.getItem('sidebarExpanded');
    return savedState !== null ? (JSON.parse(savedState) ? 280 : 72) : 280;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const expanded = localStorage.getItem('sidebarExpanded');
      if (expanded !== null) {
        setSidebarWidth(JSON.parse(expanded) ? 280 : 72);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Check for changes regularly
    const checkSidebarState = () => {
      const expanded = localStorage.getItem('sidebarExpanded');
      if (expanded !== null) {
        const newWidth = JSON.parse(expanded) ? 280 : 72;
        if (newWidth !== sidebarWidth) {
          setSidebarWidth(newWidth);
        }
      }
    };

    const intervalId = setInterval(checkSidebarState, 300);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [sidebarWidth]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Header onMenuClick={handleDrawerToggle} />
      <Sidebar open={mobileOpen} onClose={handleDrawerToggle} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${sidebarWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;