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
  LinearProgress,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Search as SearchIcon,
  Storage as StorageIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Upload,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  
  const [stats, setStats] = useState({
    totalDocuments: 0,
    processedDocuments: 0,
    aiInsights: 0,
    teamMembers: 0,
    projects: 0,
    searchQueries: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  // Mock data for demonstration
  const chartData = [
    { name: 'Jan', documents: 65, insights: 28, searches: 45 },
    { name: 'Feb', documents: 78, insights: 35, searches: 52 },
    { name: 'Mar', documents: 90, insights: 42, searches: 68 },
    { name: 'Apr', documents: 85, insights: 38, searches: 61 },
    { name: 'May', documents: 95, insights: 45, searches: 75 },
    { name: 'Jun', documents: 110, insights: 52, searches: 82 },
  ];

  const pieData = [
    { name: 'Technical Docs', value: 35, color: '#6366f1' },
    { name: 'Process Docs', value: 25, color: '#ec4899' },
    { name: 'Knowledge Base', value: 20, color: '#10b981' },
    { name: 'Project Files', value: 20, color: '#f59e0b' },
  ];

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalDocuments: 1247 + uploadedFiles.length,
        processedDocuments: 1189 + uploadedFiles.length,
        aiInsights: 342 + Math.floor(uploadedFiles.length * 0.3),
        teamMembers: 12,
        projects: 8,
        searchQueries: 567 + Math.floor(uploadedFiles.length * 0.5),
      });

      setRecentActivity([
        {
          id: 1,
          type: 'document',
          title: 'API Documentation Updated',
          user: 'John Doe',
          time: '2 hours ago',
          avatar: 'J',
        },
        {
          id: 2,
          type: 'insight',
          title: 'New AI Pattern Detected',
          user: 'AI System',
          time: '4 hours ago',
          avatar: 'AI',
        },
        {
          id: 3,
          type: 'project',
          title: 'Project Alpha Milestone Reached',
          user: 'Sarah Wilson',
          time: '1 day ago',
          avatar: 'S',
        },
        ...uploadedFiles.map((file, index) => ({
          id: 1000 + index,
          type: 'upload',
          title: `${file.name} uploaded and processed`,
          user: 'You',
          time: 'Just now',
          avatar: 'U',
        }))
      ]);

      setAiInsights([
        {
          id: 1,
          title: 'Document Clustering Optimization',
          description: 'AI detected 15% improvement opportunity in document categorization',
          confidence: 92,
          type: 'optimization',
        },
        {
          id: 2,
          title: 'Knowledge Gap Identified',
          description: 'Missing documentation in API integration section',
          confidence: 87,
          type: 'gap',
        },
        {
          id: 3,
          title: 'Trend Analysis',
          description: 'Increased queries about deployment procedures',
          confidence: 94,
          type: 'trend',
        },
        ...uploadedFiles.map((file, index) => ({
          id: 1000 + index,
          title: `New ${file.type} Document Analyzed`,
          description: `AI extracted key insights from ${file.name}`,
          confidence: 85 + Math.floor(Math.random() * 15),
          type: 'analysis',
        }))
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    showNotification('Dashboard refreshed successfully!', 'success');
  };

  const handleNewDocument = () => {
    setShowUploadDialog(true);
  };

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type.split('/')[1] || 'document',
        uploadedAt: new Date(),
        status: 'processed',
        insights: Math.floor(Math.random() * 5) + 1,
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);
      setShowUploadDialog(false);
      showNotification(`${newFiles.length} document(s) uploaded and processed successfully!`, 'success');
      
      // Refresh dashboard data
      await loadDashboardData();
    } catch (error) {
      console.error('Error uploading files:', error);
      showNotification('Error uploading files. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'search':
        navigate('/search');
        break;
      case 'ai-assistant':
        navigate('/ai-assistant');
        break;
      case 'upload':
        setShowUploadDialog(true);
        break;
      case 'team':
        navigate('/team');
        break;
      default:
        break;
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend, onClick }) => (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative', 
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 3 } : {},
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: color }}>
              {value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <TrendingUpIcon sx={{ color: 'success.main', mr: 0.5, fontSize: 16 }} />
            <Typography variant="body2" color="success.main">
              {trend}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const InsightCard = ({ insight, onClick }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'translateY(-2px)', boxShadow: 3 } : {},
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Chip
            label={insight.type}
            size="small"
            color={insight.type === 'optimization' ? 'success' : insight.type === 'gap' ? 'warning' : 'info'}
          />
          <Typography variant="body2" color="text.secondary">
            {insight.confidence}% confidence
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
          {insight.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {insight.description}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={insight.confidence}
          sx={{ height: 6, borderRadius: 3 }}
        />
      </CardContent>
    </Card>
  );

  const ActivityItem = ({ activity, onClick }) => (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        py: 1.5,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { bgcolor: 'action.hover', borderRadius: 1 } : {},
        transition: 'all 0.2s ease-in-out'
      }}
      onClick={onClick}
    >
      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
        {activity.avatar}
      </Avatar>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {activity.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          by {activity.user} • {activity.time}
        </Typography>
      </Box>
      <Chip
        label={activity.type}
        size="small"
        variant="outlined"
        color="primary"
      />
    </Box>
  );

  if (loading) {
    return (
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rectangular" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your AI Knowledge System today
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewDocument}
            sx={{ bgcolor: 'primary.main' }}
          >
            New Document
          </Button>
        </Box>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Documents"
            value={stats.totalDocuments}
            icon={<StorageIcon />}
            color="primary.main"
            subtitle={`${stats.processedDocuments} processed`}
            trend="+12% this month"
            onClick={() => navigate('/knowledge')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="AI Insights"
            value={stats.aiInsights}
            icon={<PsychologyIcon />}
            color="secondary.main"
            subtitle="Generated automatically"
            trend="+8% this week"
            onClick={() => navigate('/ai-assistant')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Search Queries"
            value={stats.searchQueries}
            icon={<SearchIcon />}
            color="success.main"
            subtitle="Knowledge base searches"
            trend="+15% this month"
            onClick={() => navigate('/search')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Team Members"
            value={stats.teamMembers}
            icon={<GroupIcon />}
            color="info.main"
            subtitle="Active collaborators"
            onClick={() => navigate('/team')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Active Projects"
            value={stats.projects}
            icon={<BusinessIcon />}
            color="warning.main"
            subtitle="Ongoing initiatives"
            onClick={() => navigate('/projects')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Processing Rate"
            value={Math.round((stats.processedDocuments / stats.totalDocuments) * 100)}
            icon={<DescriptionIcon />}
            color="success.main"
            subtitle="% of documents processed"
            trend="95% efficiency"
            onClick={() => navigate('/documents')}
          />
        </Grid>
      </Grid>

      {/* Charts and Analytics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  System Activity Overview
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label="Documents" size="small" color="primary" />
                  <Chip label="Insights" size="small" color="secondary" />
                  <Chip label="Searches" size="small" color="success" />
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="documents" stroke="#6366f1" strokeWidth={3} />
                  <Line type="monotone" dataKey="insights" stroke="#ec4899" strokeWidth={3} />
                  <Line type="monotone" dataKey="searches" stroke="#10b981" strokeWidth={3} />
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
      </Grid>

      {/* AI Insights and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI-Generated Insights
                </Typography>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => navigate('/ai-assistant')}
                >
                  View All
                </Button>
              </Box>
              <Grid container spacing={2}>
                {aiInsights.map((insight) => (
                  <Grid item xs={12} key={insight.id}>
                    <InsightCard 
                      insight={insight} 
                      onClick={() => navigate('/ai-assistant')}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Activity
                </Typography>
                <Button 
                  size="small" 
                  color="primary"
                  onClick={() => navigate('/knowledge')}
                >
                  View All
                </Button>
              </Box>
              <Box>
                {recentActivity.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ActivityItem 
                      activity={activity} 
                      onClick={() => {
                        if (activity.type === 'document') navigate('/knowledge');
                        else if (activity.type === 'insight') navigate('/ai-assistant');
                        else if (activity.type === 'project') navigate('/projects');
                        else if (activity.type === 'upload') navigate('/documents');
                      }}
                    />
                    {activity.id !== recentActivity[recentActivity.length - 1].id && <Divider />}
                  </React.Fragment>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              size="large"
              onClick={() => handleQuickAction('search')}
            >
              Search Knowledge Base
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<PsychologyIcon />}
              size="large"
              onClick={() => handleQuickAction('ai-assistant')}
            >
              Ask AI Assistant
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<DescriptionIcon />}
              size="large"
              onClick={() => handleQuickAction('upload')}
            >
              Upload Documents
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<GroupIcon />}
              size="large"
              onClick={() => handleQuickAction('team')}
            >
              Invite Team Members
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* File Upload Dialog */}
      <Dialog 
        open={showUploadDialog} 
        onClose={() => setShowUploadDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Upload Documents
            <IconButton onClick={() => setShowUploadDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <input
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
              style={{ display: 'none' }}
              id="file-upload"
              multiple
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
                size="large"
                disabled={uploading}
                sx={{ mb: 2 }}
              >
                {uploading ? 'Processing...' : 'Choose Files'}
              </Button>
            </label>
            <Typography variant="body2" color="text.secondary">
              Supported formats: PDF, Word, Excel, PowerPoint, Text
            </Typography>
            {uploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography variant="body2">Processing documents...</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUploadDialog(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={closeNotification} 
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
