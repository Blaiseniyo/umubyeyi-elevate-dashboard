import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  LinearProgress,
  Divider,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  People,
  Article,
  TrendingUp,
  ChildCare,
  Favorite,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  BarChart,
  FamilyRestroom,
  PregnantWoman,
  HealthAndSafety,
} from '@mui/icons-material';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
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
    <Card sx={{
      height: '100%',
      borderRadius: 2,
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
      }
    }}>
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
                {trend.isPositive ? (
                  <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
                ) : (
                  <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
                )}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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

  // Chart options and series
  const trimesterDistributionOptions: ApexOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['First Trimester', 'Second Trimester', 'Third Trimester'],
    colors: ['#016174', '#4a8a9a', '#78B7C5'],
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    legend: {
      position: 'bottom'
    },
    dataLabels: {
      enabled: false
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const trimesterDistributionSeries = [
    weeklyContent.filter(content => content.trimester?.trimester === 1).length || 5,
    weeklyContent.filter(content => content.trimester?.trimester === 2).length || 8,
    weeklyContent.filter(content => content.trimester?.trimester === 3).length || 7
  ];

  const userGrowthOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
        stops: [0, 90, 100]
      }
    },
    colors: ['#016174'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      labels: {
        style: {
          colors: '#7f8c8d',
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#7f8c8d',
        }
      }
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
    }
  };

  const userGrowthSeries = [{
    name: 'New Users',
    data: [25, 35, 45, 55, 70, 85, 100].map(value => Math.floor(value * (Math.random() * 0.5 + 0.8)))
  }];

  const contentEngagementOptions: ApexOptions = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '70%',
      }
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#4a8a9a'],
    xaxis: {
      categories: ['Wk 1-5', 'Wk 6-10', 'Wk 11-15', 'Wk 16-20', 'Wk 21-25', 'Wk 26-30', 'Wk 31-35', 'Wk 36-40'],
      labels: {
        style: {
          colors: '#7f8c8d',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#7f8c8d'
        }
      }
    }
  };

  const contentEngagementSeries = [{
    name: 'Views',
    data: [320, 450, 680, 720, 850, 920, 880, 950]
  }];

  const userActivityOptions: ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.2,
        stops: [0, 90, 100]
      }
    },
    colors: ['#78B7C5'],
    xaxis: {
      categories: ['12am-4am', '4am-8am', '8am-12pm', '12pm-4pm', '4pm-8pm', '8pm-12am'],
      labels: {
        style: {
          colors: '#7f8c8d',
          fontSize: '12px'
        }
      }
    }
  };

  const userActivitySeries = [{
    name: 'Users',
    data: [80, 220, 380, 520, 750, 350]
  }];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 4 }}>
        Dashboard Overview
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: 240 }}>
          <StatCard
            title="Total Users"
            value={totalUsers || 540}
            icon={<People />}
            color="#016174"
            trend={{ value: 12, isPositive: true }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: 240 }}>
          <StatCard
            title="Active Users"
            value={activeUsers || 425}
            icon={<TrendingUp />}
            color="#4CAF50"
            trend={{ value: 8, isPositive: true }}
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: 240 }}>
          <StatCard
            title="Staff Members"
            value={staffUsers || 12}
            icon={<HealthAndSafety />}
            color="#FF9800"
          />
        </Box>
        <Box sx={{ flex: '1 1 calc(25% - 24px)', minWidth: 240 }}>
          <StatCard
            title="Weekly Content"
            value={totalWeeklyContent || 24}
            icon={<Article />}
            color="#2196F3"
            trend={{ value: 5, isPositive: true }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ flex: '1 1 calc(66.666% - 16px)', minWidth: 500 }}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  User Growth Trend
                </Typography>
                <Chip
                  label="Last 7 Months"
                  size="small"
                  sx={{ backgroundColor: 'rgba(1, 97, 116, 0.1)', color: '#016174' }}
                />
              </Box>
              <Chart
                options={userGrowthOptions}
                series={userGrowthSeries}
                type="area"
                height={280}
              />
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Content Engagement by Pregnancy Week
                </Typography>
                <IconButton size="small">
                  <MoreVert fontSize="small" />
                </IconButton>
              </Box>
              <Chart
                options={contentEngagementOptions}
                series={contentEngagementSeries}
                type="bar"
                height={280}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 300 }}>
          <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Content by Trimester
                </Typography>
                <IconButton size="small">
                  <BarChart fontSize="small" />
                </IconButton>
              </Box>
              <Chart
                options={trimesterDistributionOptions}
                series={trimesterDistributionSeries}
                type="donut"
                height={250}
              />
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                {40 - totalWeeklyContent} weeks of content remaining to complete
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Daily User Activity
                </Typography>
                <Chip
                  label="Today"
                  size="small"
                  sx={{ backgroundColor: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}
                />
              </Box>
              <Chart
                options={userActivityOptions}
                series={userActivitySeries}
                type="area"
                height={200}
              />
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: '100%' }}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Pregnancy Milestones Progress
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<PregnantWoman />}
                  sx={{ borderColor: '#016174', color: '#016174' }}
                >
                  View Details
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 240 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ChildCare fontSize="small" color="primary" /> First Trimester
                      </Typography>
                      <Typography variant="body2">{trimesterDistributionSeries[0]}/13 weeks</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(trimesterDistributionSeries[0] / 13) * 100}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(1, 97, 116, 0.1)' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 240 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FamilyRestroom fontSize="small" color="primary" /> Second Trimester
                      </Typography>
                      <Typography variant="body2">{trimesterDistributionSeries[1]}/13 weeks</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(trimesterDistributionSeries[1] / 13) * 100}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(1, 97, 116, 0.1)' }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: '1 1 calc(33.333% - 16px)', minWidth: 240 }}>
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Favorite fontSize="small" color="primary" /> Third Trimester
                      </Typography>
                      <Typography variant="body2">{trimesterDistributionSeries[2]}/14 weeks</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(trimesterDistributionSeries[2] / 14) * 100}
                      sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(1, 97, 116, 0.1)' }}
                    />
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Last Content Added
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Week {Math.min(40, Math.max(1, totalWeeklyContent))} - Baby Development
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Most Viewed Content
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Week 20 - Ultrasound Insights
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Content Completion
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {Math.floor((totalWeeklyContent / 40) * 100)}%
                    <Chip
                      label="In Progress"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.7rem',
                        bgcolor: 'rgba(255, 152, 0, 0.1)',
                        color: '#FF9800',
                        ml: 1
                      }}
                    />
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;