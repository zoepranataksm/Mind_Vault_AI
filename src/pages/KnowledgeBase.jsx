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
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  Badge,
  Skeleton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Psychology as PsychologyIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  Tag as TagIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const categories = [
    'Technical Documentation',
    'Process Guidelines',
    'Project Files',
    'Team Knowledge',
    'Research Papers',
    'Best Practices',
    'Troubleshooting',
    'Training Materials',
  ];

  const tags = [
    'API', 'Frontend', 'Backend', 'Database', 'DevOps', 'Security',
    'UI/UX', 'Testing', 'Deployment', 'Monitoring', 'Analytics'
  ];

  useEffect(() => {
    // Simulate loading documents
    setTimeout(() => {
      const mockDocuments = [
        {
          id: 1,
          title: 'API Integration Guide',
          description: 'Comprehensive guide for integrating third-party APIs into our system',
          category: 'Technical Documentation',
          tags: ['API', 'Integration', 'Backend'],
          author: 'John Doe',
          date: '2024-01-15',
          size: '2.4 MB',
          type: 'PDF',
          views: 156,
          downloads: 89,
          aiInsights: ['High relevance score', 'Frequently referenced'],
          status: 'published'
        },
        {
          id: 2,
          title: 'Deployment Process',
          description: 'Step-by-step deployment process for production environments',
          category: 'Process Guidelines',
          tags: ['DevOps', 'Deployment', 'Production'],
          author: 'Sarah Wilson',
          date: '2024-01-10',
          size: '1.8 MB',
          type: 'PDF',
          views: 203,
          downloads: 134,
          aiInsights: ['Critical process', 'Team favorite'],
          status: 'published'
        },
        {
          id: 3,
          title: 'Frontend Component Library',
          description: 'Reusable UI components and design system guidelines',
          category: 'Technical Documentation',
          tags: ['Frontend', 'UI/UX', 'Components'],
          author: 'Mike Chen',
          date: '2024-01-08',
          size: '3.2 MB',
          type: 'PDF',
          views: 98,
          downloads: 67,
          aiInsights: ['Design system', 'Component reuse'],
          status: 'published'
        },
        {
          id: 4,
          title: 'Database Schema Design',
          description: 'Database architecture and schema design principles',
          category: 'Technical Documentation',
          tags: ['Database', 'Architecture', 'Design'],
          author: 'Alex Johnson',
          date: '2024-01-05',
          size: '2.1 MB',
          type: 'PDF',
          views: 145,
          downloads: 92,
          aiInsights: ['Architecture decision', 'Performance impact'],
          status: 'published'
        },
        {
          id: 5,
          title: 'Security Best Practices',
          description: 'Security guidelines and best practices for development',
          category: 'Best Practices',
          tags: ['Security', 'Best Practices', 'Development'],
          author: 'Emma Davis',
          date: '2024-01-03',
          size: '1.5 MB',
          type: 'PDF',
          views: 178,
          downloads: 156,
          aiInsights: ['Security critical', 'Compliance required'],
          status: 'published'
        }
      ];
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    // Filter documents based on search query
    if (searchQuery.trim() === '') {
      setFilteredDocuments(documents);
    } else {
      const filtered = documents.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredDocuments(filtered);
    }
  }, [searchQuery, documents]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDocumentClick = (document) => {
    setSelectedDocument(document);
    setViewDialogOpen(true);
  };

  const handleUpload = () => {
    setUploadDialogOpen(true);
  };

  const DocumentCard = ({ document }) => (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
      onClick={() => handleDocumentClick(document)}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            <DescriptionIcon />
          </Avatar>
          <Box sx={{ textAlign: 'right' }}>
            <Chip
              label={document.status}
              size="small"
              color={document.status === 'published' ? 'success' : 'warning'}
            />
            <Typography variant="caption" display="block" color="text.secondary">
              {document.type}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, lineHeight: 1.3 }}>
          {document.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.5 }}>
          {document.description}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Chip
            label={document.category}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {document.tags.slice(0, 3).map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                color="secondary"
              />
            ))}
            {document.tags.length > 3 && (
              <Chip
                label={`+${document.tags.length - 3}`}
                size="small"
                variant="outlined"
                color="default"
              />
            )}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            by {document.author}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {document.date}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <VisibilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {document.views}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <DownloadIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {document.downloads}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary">
            {document.size}
          </Typography>
        </Box>

        {document.aiInsights && document.aiInsights.length > 0 && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: 'primary.light', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AutoAwesomeIcon sx={{ fontSize: 16, color: 'primary.main', mr: 0.5 }} />
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                AI Insights
              </Typography>
            </Box>
            {document.aiInsights.map((insight, index) => (
              <Typography key={index} variant="caption" display="block" color="primary.main">
                • {insight}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderTabContent = (tabIndex) => {
    switch (tabIndex) {
      case 0: // All Documents
        return (
          <Grid container spacing={3}>
            {loading ? (
              [...Array(6)].map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Skeleton variant="rectangular" height={300} />
                </Grid>
              ))
            ) : (
              filteredDocuments.map((document) => (
                <Grid item xs={12} sm={6} md={4} key={document.id}>
                  <DocumentCard document={document} />
                </Grid>
              ))
            )}
          </Grid>
        );

      case 1: // Categories
        return (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category}>
                <Card sx={{ height: '100%', cursor: 'pointer' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
                      <FolderIcon />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {documents.filter(doc => doc.category === category).length} documents
                    </Typography>
                    <Button variant="outlined" size="small">
                      Browse Category
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 2: // AI Insights
        return (
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              AI-powered insights help you discover patterns, identify knowledge gaps, and optimize your documentation.
            </Alert>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Knowledge Gaps
                    </Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <TrendingUpIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary="API Security Documentation"
                          secondary="High demand, low coverage"
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
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Trending Topics
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {['API Integration', 'Security', 'Performance', 'Testing'].map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
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
            Knowledge Base
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Centralized repository of all your team's knowledge and documentation
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
          >
            Filters
          </Button>
          <Button
            variant="outlined"
            startIcon={<SortIcon />}
          >
            Sort
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleUpload}
            sx={{ bgcolor: 'primary.main' }}
          >
            Upload Document
          </Button>
        </Box>
      </Box>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search documents, categories, tags, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {tags.slice(0, 8).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
                sx={{ cursor: 'pointer' }}
                onClick={() => setSearchQuery(tag)}
              />
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="All Documents" />
          <Tab label="Categories" />
          <Tab label="AI Insights" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {renderTabContent(activeTab)}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Drag & Drop Files Here
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              or click to browse files
            </Typography>
            <Button variant="outlined" component="label">
              Choose Files
              <input type="file" hidden multiple />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Upload</Button>
        </DialogActions>
      </Dialog>

      {/* View Document Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedDocument?.title}
        </DialogTitle>
        <DialogContent>
          {selectedDocument && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedDocument.description}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {selectedDocument.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                Author: {selectedDocument.author} | Date: {selectedDocument.date} | Size: {selectedDocument.size}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button startIcon={<DownloadIcon />}>Download</Button>
          <Button startIcon={<ShareIcon />}>Share</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KnowledgeBase;
