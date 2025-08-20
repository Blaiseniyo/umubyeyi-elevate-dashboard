import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Article,
  TrendingUp,
  Schedule,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../hooks';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, trend }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp
                  sx={{
                    fontSize: 16,
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    transform: trend.isPositive ? 'none' : 'rotate(180deg)',
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    color: trend.isPositive ? 'success.main' : 'error.main',
                    fontWeight: 500,
                  }}
                >
                  {trend.value}%
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar
            sx={{
              bgcolor: color,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, total: totalUsers } = useAppSelector((state) => state.users);
  const { weeklyContent } = useAppSelector((state) => state.content);

  useEffect(() => {
    // dispatch(getUsersAsync({ limit: 100 }));
    // dispatch(getWeeklyContentAsync({ limit: 100 }));
  }, [dispatch]);

  const activeUsers = users.filter(user => user.status === 'active').length;
  const staffUsers = users.filter(user => user.role === 'staff' || user.role === 'admin').length;
  const totalWeeklyContent = weeklyContent.length;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<People />}
            color="primary.main"
            trend={{ value: 12, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<TrendingUp />}
            color="success.main"
            trend={{ value: 8, isPositive: true }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Staff Members"
            value={staffUsers}
            icon={<Schedule />}
            color="warning.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Weekly Content"
            value={totalWeeklyContent}
            icon={<Article />}
            color="info.main"
            trend={{ value: 5, isPositive: true }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Content Progress
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Weekly Content Created</Typography>
                  <Typography variant="body2">{totalWeeklyContent}/40 weeks</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(totalWeeklyContent / 40) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {40 - totalWeeklyContent} weeks remaining to complete pregnancy journey content
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Quick Stats
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">New Users Today</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {Math.floor(Math.random() * 10) + 1}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Content Views</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {Math.floor(Math.random() * 1000) + 500}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">App Downloads</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {Math.floor(Math.random() * 100) + 50}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;