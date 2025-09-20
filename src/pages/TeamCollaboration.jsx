import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
  AvatarGroup,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Badge,
  Divider,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  PeopleAlt,
  Group,
  Chat,
  Assignment,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
  Share as ShareIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showCreateProjectDialog, setShowCreateProjectDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      role: 'Project Manager',
      avatar: 'J',
      status: 'online',
      department: 'Management',
      skills: ['Leadership', 'Agile', 'Risk Management'],
      projects: ['AI Knowledge Transfer System', 'Mobile App Redesign']
    },
    {
      id: 2,
      name: 'Jane Smith',
      role: 'Senior Developer',
      avatar: 'J',
      status: 'online',
      department: 'Engineering',
      skills: ['React', 'Node.js', 'Python', 'AI/ML'],
      projects: ['AI Knowledge Transfer System', 'Data Analytics Platform']
    },
    {
      id: 3,
      name: 'Mike Johnson',
      role: 'UX Designer',
      avatar: 'M',
      status: 'away',
      department: 'Design',
      skills: ['Figma', 'User Research', 'Prototyping'],
      projects: ['Mobile App Redesign']
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      role: 'Design Lead',
      avatar: 'S',
      status: 'online',
      department: 'Design',
      skills: ['Design Systems', 'Branding', 'UI/UX'],
      projects: ['Mobile App Redesign', 'Brand Refresh']
    },
    {
      id: 5,
      name: 'Alex Chen',
      role: 'Data Scientist',
      avatar: 'A',
      status: 'offline',
      department: 'Analytics',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      projects: ['Data Analytics Platform']
    }
  ]);

  const [groupProjects] = useState([
    {
      id: 1,
      name: 'AI Knowledge Transfer System',
      description: 'Advanced AI-powered knowledge management platform',
      members: [1, 2, 3],
      progress: 65,
      status: 'in-progress',
      deadline: '2024-06-30'
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      description: 'Complete redesign of company mobile application',
      members: [3, 4],
      progress: 25,
      status: 'planning',
      deadline: '2024-05-31'
    },
    {
      id: 3,
      name: 'Data Analytics Platform',
      description: 'Comprehensive data analytics and reporting platform',
      members: [2, 5],
      progress: 100,
      status: 'completed',
      deadline: '2024-08-31'
    }
  ]);

  const [recentMessages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      message: 'Great work on the AI integration, team!',
      timestamp: '2 hours ago',
      avatar: 'J'
    },
    {
      id: 2,
      sender: 'Jane Smith',
      message: 'The new API endpoints are working perfectly',
      timestamp: '1 hour ago',
      avatar: 'J'
    },
    {
      id: 3,
      sender: 'Mike Johnson',
      message: 'Design mockups are ready for review',
      timestamp: '30 minutes ago',
      avatar: 'M'
    }
  ]);

  const [tasks] = useState([
    {
      id: 1,
      title: 'Implement AI Chat Interface',
      assignee: 'Jane Smith',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-02-15'
    },
    {
      id: 2,
      title: 'Design User Dashboard',
      assignee: 'Mike Johnson',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-02-10'
    },
    {
      id: 3,
      title: 'Setup Database Schema',
      assignee: 'Alex Chen',
      status: 'pending',
      priority: 'high',
      dueDate: '2024-02-20'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'success';
      case 'away': return 'warning';
      case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'primary';
      case 'pending': return 'warning';
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

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Team Collaboration
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Work together seamlessly with your team members
        </Typography>
      </Box>

      {/* Search and Actions */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowAddMemberDialog(true)}
              >
                Add Member
              </Button>
              <Button
                variant="outlined"
                startIcon={<Group />}
                onClick={() => setShowCreateProjectDialog(true)}
              >
                Create Project
              </Button>
              <Button
                variant="contained"
                startIcon={<Chat />}
                onClick={() => setShowChatDialog(true)}
              >
                Team Chat
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Team Members" />
          <Tab label="Group Projects" />
          <Tab label="Communication" />
          <Tab label="Task Management" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {filteredTeamMembers.map((member) => (
            <Grid item xs={12} md={6} lg={4} key={member.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: getStatusColor(member.status) === 'success' ? '#4caf50' : 
                                     getStatusColor(member.status) === 'warning' ? '#ff9800' : '#f44336'
                          }}
                        />
                      }
                    >
                      <Avatar sx={{ width: 56, height: 56, fontSize: '1.5rem' }}>
                        {member.avatar}
                      </Avatar>
                    </Badge>
                    <Box sx={{ ml: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role}
                      </Typography>
                      <Chip 
                        label={member.status} 
                        size="small" 
                        color={getStatusColor(member.status)}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Department: {member.department}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>Skills:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {member.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" variant="outlined" />
                    ))}
                  </Box>
                  
                  <Typography variant="body2" sx={{ mb: 1 }}>Projects:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {member.projects.map((project, index) => (
                      <Chip key={index} label={project} size="small" color="primary" />
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button size="small" startIcon={<MessageIcon />}>
                      Message
                    </Button>
                    <Button size="small" startIcon={<VideoCallIcon />}>
                      Call
                    </Button>
                    <Button size="small" startIcon={<Share />}>
                      Share
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          {groupProjects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {project.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem' } }}>
                      {project.members.map((memberId) => {
                        const member = teamMembers.find(m => m.id === memberId);
                        return member ? (
                          <Tooltip key={member.id} title={member.name}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                              {member.avatar}
                            </Avatar>
                          </Tooltip>
                        ) : null;
                      })}
                    </AvatarGroup>
                    <Chip 
                      label={project.status.replace('-', ' ')} 
                      size="small" 
                      color={project.status === 'completed' ? 'success' : 
                             project.status === 'in-progress' ? 'primary' : 'warning'}
                      sx={{ ml: 'auto' }}
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
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Deadline: {project.deadline}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" startIcon={<Assignment />}>
                      View Tasks
                    </Button>
                    <Button size="small" startIcon={<Chat />}>
                      Team Chat
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Messages</Typography>
              <List>
                {recentMessages.map((message, index) => (
                  <React.Fragment key={message.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>{message.avatar}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={message.sender}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.primary">
                              {message.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {message.timestamp}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < recentMessages.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  placeholder="Type your message..."
                  multiline
                  rows={2}
                />
                <Button variant="contained" sx={{ mt: 1 }}>
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" startIcon={<VideoCallIcon />} fullWidth>
                  Start Video Call
                </Button>
                <Button variant="outlined" startIcon={<MessageIcon />} fullWidth>
                  Group Chat
                </Button>
                <Button variant="outlined" startIcon={<Share />} fullWidth>
                  Share Files
                </Button>
                <Button variant="outlined" startIcon={<NotificationsIcon />} fullWidth>
                  Notifications
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Task Management</Typography>
              <List>
                {tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: getTaskStatusColor(task.status) === 'success' ? 'success.main' : 
                                               getTaskStatusColor(task.status) === 'primary' ? 'primary.main' : 'warning.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={task.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Assignee: {task.assignee}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip 
                                label={task.status} 
                                size="small" 
                                color={getTaskStatusColor(task.status)}
                              />
                              <Chip 
                                label={task.priority} 
                                size="small" 
                                color={getPriorityColor(task.priority)}
                              />
                              <Chip 
                                label={`Due: ${task.dueDate}`} 
                                size="small" 
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="edit">
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < tasks.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onClose={() => setShowAddMemberDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Team Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Role" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Department" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Skills (comma separated)" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddMemberDialog(false)}>Cancel</Button>
          <Button variant="contained">Add Member</Button>
        </DialogActions>
      </Dialog>

      {/* Create Project Dialog */}
      <Dialog open={showCreateProjectDialog} onClose={() => setShowCreateProjectDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Group Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField fullWidth label="Project Name" />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Start Date" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth type="date" label="Deadline" InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Team Members</InputLabel>
                <Select multiple label="Team Members">
                  {teamMembers.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.name} - {member.role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateProjectDialog(false)}>Cancel</Button>
          <Button variant="contained">Create Project</Button>
        </DialogActions>
      </Dialog>

      {/* Team Chat Dialog */}
      <Dialog open={showChatDialog} onClose={() => setShowChatDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Team Chat</DialogTitle>
        <DialogContent>
          <Box sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
              {recentMessages.map((message) => (
                <Box key={message.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 1, width: 32, height: 32 }}>{message.avatar}</Avatar>
                    <Typography variant="subtitle2" sx={{ mr: 1 }}>
                      {message.sender}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {message.timestamp}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ ml: 4 }}>
                    {message.message}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                multiline
                rows={2}
              />
              <Button variant="contained">Send</Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChatDialog(false)}>Close</Button>
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
    </Container>
  );
};

export default TeamCollaboration;
