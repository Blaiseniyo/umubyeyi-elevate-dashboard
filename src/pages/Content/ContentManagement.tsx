import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import TrimesterManagement from './TrimesterManagement';
import WeeklyContentManagement from './WeeklyContentManagement';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`content-tabpanel-${index}`}
      aria-labelledby={`content-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const ContentManagement: React.FC = () => {
  // get tab query parameter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get('tab') === 'trimesters' ? 1 : 0;
  const [tabValue, setTabValue] = useState(initialTab);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    // Update the URL with the new tab value
    const newParams = new URLSearchParams(window.location.search);
    newParams.set('tab', newValue === 1 ? 'trimesters' : 'weekly');
    window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Pregnancy Tracker Content Management
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Weekly Content" />
          <Tab label="Trimesters" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <WeeklyContentManagement />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <TrimesterManagement />
      </TabPanel>
    </Box>
  );
};

export default ContentManagement;