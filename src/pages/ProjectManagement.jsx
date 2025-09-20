import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Paper,
  Tabs,
  Tab,
  Badge,
} from '@mui/material';
import {
  Business as BusinessIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  Flag as FlagIcon,
  AttachFile as AttachFileIcon,
  Comment as CommentIcon,
  Visibility as VisibilityIcon,
  Archive as ArchiveIcon,
  RestoreFromTrash as RestoreIcon,
} from '@mui/icons-material';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    priority: 'medium',
    status: 'planning',
    teamMembers: [],
    budget: '',
    category: 'development'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockProjects = [
      {
        id: 1,
        name: 'AI Knowledge Transfer System',
        description: 'Advanced AI-powered knowledge management and transfer platform',
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        priority: 'high',
        status: 'in-progress',
        progress: 65,
        budget: '$50,000',
        category: 'development',
        teamMembers: [
          { id: 1, name: 'John Doe', avatar: 'J', role: 'Project Manager' },
          { id: 2, name: 'Jane Smith', avatar: 'J', role: 'Developer' },
          { id: 3, name: 'Mike Johnson', avatar: 'M', role: 'Designer' }
        ],
        tasks: [
          { id: 1, title: 'Frontend Development', status: 'completed', assignee: 'Jane Smith' },
          { id: 2, title: 'Backend API', status: 'in-progress', assignee: 'Mike Johnson' },
          { id: 3, title: 'AI Integration', status: 'pending', assignee: 'John Doe' }
        ],
        milestones: [
          { id: 1, title: 'Requirements Analysis', date: '2024-01-15', completed: true },
          { id: 2, title: 'Design Phase', date: '2024-02-15', completed: true },
          { id: 3, title: 'Development Phase', date: '2024-04-15', completed: false }
        ]
      },
      {
        id: 2,
        name: 'Mobile App Redesign',
        description: 'Complete redesign of the company mobile application',
        startDate: '2024-02-01',
        endDate: '2024-05-31',
        priority: 'medium',
        status: 'planning',
        progress: 25,
        budget: '$30,000',
        category: 'design',
        teamMembers: [
          { id: 4, name: 'Sarah Wilson', avatar: 'S', role: 'Design Lead' },
          { id: 5, name: 'Tom Brown', avatar: 'T', role: 'UX Designer' }
        ],
        tasks: [
          { id: 4, title: 'User Research', status: 'completed', assignee: 'Sarah Wilson' },
          { id: 5, title: 'Wireframing', status: 'in-progress', assignee: 'Tom Brown' },
          { id: 6, title: 'Prototyping', status: 'pending', assignee: 'Sarah Wilson' }
        ],
        milestones: [
          { id: 4, title: 'Research Complete', date: '2024-02-15', completed: true },
          { id: 5, title: 'Design Approval', date: '2024-03-15', completed: false },
          { id: 6, title: 'Development Start', date: '2024-04-01', completed: false }
        ]
      },
      {
        id: 3,
        name: 'Data Analytics Platform',
        description: 'Comprehensive data analytics and reporting platform',
        startDate: '2024-03-01',
        endDate: '2024-08-31',
        priority: 'high',
        status: 'completed',
        progress: 100,
        budget: '$75,000',
        category: 'analytics',
        teamMembers: [
          { id: 6, name: 'Alex Chen', avatar: 'A', role: 'Data Scientist' },
          { id: 7, name: 'Lisa Park', avatar: 'L', role: 'Backend Developer' }
        ],
        tasks: [
          { id: 7, title: 'Data Pipeline', status: 'completed', assignee: 'Alex Chen' },
          { id: 8, title: 'API Development', status: 'completed', assignee: 'Lisa Park' },
          { id: 9, title: 'Testing & Deployment', status: 'completed', assignee: 'Alex Chen' }
        ],
        milestones: [
          { id: 7, title: 'MVP Complete', date: '2024-06-15', completed: true },
          { id: 8, title: 'Testing Complete', date: '2024-07-15', completed: true },
          { id: 9, title: 'Production Launch', date: '2024-08-01', completed: true }
        ]
      }
    ];
    setProjects(mockProjects);
  }, []);

  const handleCreateProject = () => {
    const newProject = {
      id: Date.now(),
      ...formData,
      progress: 0,
      teamMembers: [],
      tasks: [],
      milestones: [],
      startDate: formData.startDate || new Date().toISOString().split('T')[0]
    };
    
    setProjects(prev => [newProject, ...prev]);
    setShowCreateDialog(false);
    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      priority: 'medium',
      status: 'planning',
      teamMembers: [],
      budget: '',
      category: 'development'
    });
    showNotification('Project created successfully!', 'success');
  };

  const handleEditProject = () => {
    setProjects(prev => 
      prev.map(p => p.id === selectedProject.id ? { ...p, ...formData } : p)
    );
    setShowEditDialog(false);
    setSelectedProject(null);
    showNotification('Project updated successfully!', 'success');
  };

  const handleDeleteProject = () => {
    setProjects(prev => prev.filter(p => p.id !== selectedProject.id));
    setShowDeleteDialog(false);
    setSelectedProject(null);
    showNotification('Project deleted successfully!', 'success');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'planning': return 'warning';
      case 'on-hold': return 'error';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 25) return 'warning';
    return 'error';
  };

  const filteredProjects = projects.filter(project => {
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const openEditDialog = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      priority: project.priority,
      status: project.status,
      teamMembers: project.teamMembers,
      budget: project.budget,
      category: project.category
    });
    setShowEditDialog(true);
  };

  const openDeleteDialog = (project) => {
    setSelectedProject(project);
    setShowDeleteDialog(true);
  };

  const ProjectCard = ({ project }) => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {project.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="View Details">
              <IconButton size="small">
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Edit Project">
              <IconButton size="small" onClick={() => openEditDialog(project)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Project">
              <IconButton size="small" color="error" onClick={() => openDeleteDialog(project)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {project.description}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip 
            label={project.status.replace('-', ' ')} 
            size="small" 
            color={getStatusColor(project.status)}
          />
          <Chip 
            label={project.priority} 
            size="small" 
            color={getPriorityColor(project.priority)}
          />
          <Chip 
            label={project.category} 
            size="small" 
            variant="outlined"
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {project.progress}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={project.progress} 
            color={getProgressColor(project.progress)}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {project.startDate} - {project.endDate}
            </Typography>
          </Box>
          <Typography variant="body2" color="primary.main" sx={{ fontWeight: 600 }}>
            {project.budget}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
            {project.teamMembers.map((member) => (
              <Tooltip key={member.id} title={`${member.name} (${member.role})`}>
                <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                  {member.avatar}
                </Avatar>
              </Tooltip>
            ))}
          </AvatarGroup>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Tasks">
              <Chip 
                icon={<AssignmentIcon />} 
                label={project.tasks.length} 
                size="small" 
                variant="outlined"
              />
            </Tooltip>
            <Tooltip title="Milestones">
              <Chip 
                icon={<FlagIcon />} 
                label={project.milestones.length} 
                size="small" 
                variant="outlined"
              />
            </Tooltip>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Project Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowCreateDialog(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Project
        </Button>
      </Box>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={filterStatus}
                label="Status Filter"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="in-progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="on-hold">On Hold</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small">
                <TrendingUpIcon sx={{ mr: 1 }} />
                Analytics
              </Button>
              <Button variant="outlined" size="small">
                <PeopleIcon sx={{ mr: 1 }} />
                Team
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Project Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                {projects.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                {projects.filter(p => p.status === 'completed').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" sx={{ mb: 1 }}>
                {projects.filter(p => p.status === 'in-progress').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main" sx={{ mb: 1 }}>
                {projects.filter(p => p.status === 'planning').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Planning
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {filteredProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="research">Research</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="$0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateProject}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  label="Status"
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="on-hold">On Hold</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="design">Design</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="analytics">Analytics</MenuItem>
                  <MenuItem value="research">Research</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Budget"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="$0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditProject}>
            Update Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedProject?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteProject}>
            Delete
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
        <Alert onClose={closeNotification} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProjectManagement;
