import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Alert,
  Skeleton,
  LinearProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Psychology as PsychologyIcon,
  Search as SearchIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  AutoAwesome as AutoAwesomeIcon,
  Insights as InsightsIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ScatterChart, Scatter, ZAxis
} from 'recharts';

const Analytics = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({});

  // Mock data for demonstration
  const chartData = [
    { month: 'Jan', documents: 65, insights: 28, searches: 45, users: 12 },
    { month: 'Feb', documents: 78, insights: 35, searches: 52, users: 15 },
    { month: 'Mar', documents: 90, insights: 42, searches: 68, users: 18 },
    { month: 'Apr', documents: 85, insights: 38, searches: 61, users: 16 },
    { month: 'May', documents: 95, insights: 45, searches: 75, users: 20 },
    { month: 'Jun', documents: 110, insights: 52, searches: 82, users: 22 },
  ];

  const pieData = [
    { name: 'Technical Docs', value: 35, color: '#6366f1' },
    { name: 'Process Docs', value: 25, color: '#ec4899' },
    { name: 'Knowledge Base', value: 20, color: '#10b981' },
    { name: 'Project Files', value: 20, color: '#f59e0b' },
  ];

  const radarData = [
    { subject: 'Document Quality', A: 85, B: 90, fullMark: 100 },
    { subject: 'Search Relevance', A: 78, B: 88, fullMark: 100 },
    { subject: 'AI Insights', A: 92, B: 85, fullMark: 100 },
    { subject: 'User Engagement', A: 80, B: 92, fullMark: 100 },
    { subject: 'Knowledge Coverage', A: 75, B: 88, fullMark: 100 },
    { subject: 'System Performance', A: 88, B: 90, fullMark: 100 },
  ];

  const scatterData = [
    { x: 100, y: 200, z: 200, size: 20 },
    { x: 120, y: 100, z: 260, size: 25 },
    { x: 170, y: 300, z: 400, size: 30 },
    { x: 140, y: 250, z: 280, size: 22 },
    { x: 150, y: 400, z: 500, size: 35 },
    { x: 110, y: 280, z: 200, size: 18 },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMetrics({
        totalDocuments: 1247,
        totalInsights: 342,
        totalSearches: 567,
        activeUsers: 22,
        avgResponseTime: 1.2,
        satisfactionScore: 4.6,
        knowledgeCoverage: 78,
        aiAccuracy: 92,
      });
      setLoading(false);
    }, 2000);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const MetricCard = ({ title, value, icon, color, trend, subtitle, loading: isLoading }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            {isLoading ? (
              <Skeleton variant="text" width="60%" />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
                {value}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trend.startsWith('+') ? (
              <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
            ) : (
              <TrendingDownIcon sx={{ color: 'error.main', mr: 0.5, fontSize: 16 }} />
            )}
            <Typography
              variant="body2"
              color={trend.startsWith('+') ? 'success.main' : 'error.main'}
            >
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderTabContent = (tabIndex) => {
    switch (tabIndex) {
      case 0: // Overview
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Documents"
                value={metrics.totalDocuments?.toLocaleString() || '0'}
                icon={<StorageIcon />}
                color="primary.main"
                trend="+12%"
                subtitle="Knowledge base size"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="AI Insights"
                value={metrics.totalInsights?.toLocaleString() || '0'}
                icon={<PsychologyIcon />}
                color="secondary.main"
                trend="+8%"
                subtitle="Generated automatically"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Search Queries"
                value={metrics.totalSearches?.toLocaleString() || '0'}
                icon={<SearchIcon />}
                color="success.main"
                trend="+15%"
                subtitle="User engagement"
                loading={loading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Users"
                value={metrics.activeUsers || '0'}
                icon={<GroupIcon />}
                color="info.main"
                trend="+22%"
                subtitle="Monthly active users"
                loading={loading}
              />
            </Grid>

            {/* Charts */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      System Activity Trends
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Time Range</InputLabel>
                      <Select
                        value={timeRange}
                        label="Time Range"
                        onChange={(e) => setTimeRange(e.target.value)}
                      >
                        <MenuItem value="7d">Last 7 days</MenuItem>
                        <MenuItem value="30d">Last 30 days</MenuItem>
                        <MenuItem value="90d">Last 90 days</MenuItem>
                        <MenuItem value="1y">Last year</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line type="monotone" dataKey="documents" stroke="#6366f1" strokeWidth={3} name="Documents" />
                      <Line type="monotone" dataKey="insights" stroke="#ec4899" strokeWidth={3} name="AI Insights" />
                      <Line type="monotone" dataKey="searches" stroke="#10b981" strokeWidth={3} name="Searches" />
                      <Line type="monotone" dataKey="users" stroke="#f59e0b" strokeWidth={3} name="Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Document Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Performance Metrics
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Response Time</Typography>
                      <Typography variant="body2">{metrics.avgResponseTime || '0'}s</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((metrics.avgResponseTime || 0) * 20, 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Satisfaction Score</Typography>
                      <Typography variant="body2">{metrics.satisfactionScore || '0'}/5.0</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(metrics.satisfactionScore || 0) * 20}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Knowledge Coverage</Typography>
                      <Typography variant="body2">{metrics.knowledgeCoverage || '0'}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.knowledgeCoverage || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">AI Accuracy</Typography>
                      <Typography variant="body2">{metrics.aiAccuracy || '0'}%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.aiAccuracy || 0}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    AI Performance Analysis
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Current Month"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.3}
                      />
                      <Radar
                        name="Previous Month"
                        dataKey="B"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.3}
                      />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 1: // User Behavior
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    User Engagement Patterns
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Area
                        type="monotone"
                        dataKey="users"
                        stackId="1"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="searches"
                        stackId="1"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Search Query Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="searches" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                    Document vs Insights Correlation
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Documents" />
                      <YAxis type="number" dataKey="y" name="Insights" />
                      <ZAxis type="number" dataKey="z" range={[60, 400]} />
                      <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Scatter dataKey="z" fill="#6366f1" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      case 2: // AI Insights
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  AI-Powered Analytics Insights
                </Typography>
                <Typography variant="body2">
                  Our AI system continuously analyzes patterns and provides actionable insights to improve your knowledge management.
                </Typography>
              </Alert>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AutoAwesomeIcon sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Knowledge Gaps Identified
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="API Security Documentation"
                        secondary="High demand, low coverage - 67% gap"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'warning.main' }}>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Deployment Troubleshooting"
                        secondary="Frequently searched, needs expansion"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InsightsIcon sx={{ color: 'secondary.main', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Optimization Recommendations
                    </Typography>
                  </Box>
                  <List>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Document Clustering"
                        secondary="15% improvement opportunity detected"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'success.main' }}>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Search Algorithm"
                        secondary="Query relevance can be improved by 12%"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive analytics and AI-powered insights for your knowledge system
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<AssessmentIcon />}
          >
            Export Report
          </Button>
          <Button
            variant="contained"
            startIcon={<AutoAwesomeIcon />}
            sx={{ bgcolor: 'primary.main' }}
          >
            Generate Insights
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Overview" />
          <Tab label="User Behavior" />
          <Tab label="AI Insights" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent(activeTab)}
    </Box>
  );
};

export default Analytics;
