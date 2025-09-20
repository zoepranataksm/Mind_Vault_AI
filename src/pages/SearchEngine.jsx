import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  TextField, 
  Button, 
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  TrendingUp, 
  History, 
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const SearchEngine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [searchHistory, setSearchHistory] = useState([]);
  const [filters, setFilters] = useState({
    documentType: 'all',
    category: 'all',
    dateRange: 'all',
    confidence: 0,
    includeTags: [],
  });
  const [savedSearches, setSavedSearches] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showResultDialog, setShowResultDialog] = useState(false);

  // Mock data for demonstration
  const mockSearchResults = [
    {
      id: 1,
      title: 'AI Knowledge Transfer Guide',
      type: 'Document',
      category: 'Technical Docs',
      relevance: 95,
      description: 'Comprehensive guide on implementing AI-powered knowledge transfer systems in organizations.',
      tags: ['AI', 'Knowledge Transfer', 'Technical', 'Guide'],
      author: 'Dr. Sarah Chen',
      lastModified: '2024-01-15',
      size: '2.4 MB',
      views: 1247,
      downloads: 89,
      rating: 4.8,
      content: 'This document provides a detailed overview of AI-powered knowledge transfer systems...',
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      type: 'Article',
      category: 'Research Papers',
      relevance: 87,
      description: 'Core concepts and principles of machine learning algorithms and their applications.',
      tags: ['Machine Learning', 'AI', 'Research', 'Fundamentals'],
      author: 'Prof. Michael Rodriguez',
      lastModified: '2024-01-14',
      size: '1.8 MB',
      views: 892,
      downloads: 156,
      rating: 4.6,
      content: 'Machine learning is a subset of artificial intelligence that enables systems to learn...',
    },
    {
      id: 3,
      title: 'Data Science Best Practices',
      type: 'Report',
      category: 'Process Docs',
      relevance: 82,
      description: 'Industry best practices for data science projects and workflow optimization.',
      tags: ['Data Science', 'Best Practices', 'Process', 'Workflow'],
      author: 'Data Science Team',
      lastModified: '2024-01-13',
      size: '3.2 MB',
      views: 567,
      downloads: 234,
      rating: 4.4,
      content: 'This report outlines the best practices for data science projects...',
    },
    {
      id: 4,
      title: 'Artificial Intelligence Trends 2024',
      type: 'Research',
      category: 'Research Papers',
      relevance: 78,
      description: 'Analysis of emerging trends and developments in artificial intelligence for 2024.',
      tags: ['AI Trends', 'Research', '2024', 'Emerging Tech'],
      author: 'AI Research Institute',
      lastModified: '2024-01-12',
      size: '4.1 MB',
      views: 445,
      downloads: 178,
      rating: 4.7,
      content: 'The year 2024 brings significant advancements in artificial intelligence...',
    },
  ];

  const popularSearches = [
    'AI Assistant', 'Knowledge Base', 'Document Processing', 'Team Collaboration',
    'Analytics Dashboard', 'Project Management', 'Machine Learning', 'Data Analysis'
  ];

  const searchHistoryData = [
    'AI knowledge transfer',
    'machine learning algorithms',
    'data science workflow',
    'project management tools',
    'team collaboration features'
  ];

  useEffect(() => {
    // Load search history from localStorage
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Load saved searches
    const saved = localStorage.getItem('savedSearches');
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showNotification('Please enter a search query', 'warning');
      return;
    }

    setIsSearching(true);
    try {
      // Simulate search API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter results based on query and filters
      let filteredResults = mockSearchResults.filter(result => {
        const matchesQuery = result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesType = filters.documentType === 'all' || result.type.toLowerCase() === filters.documentType.toLowerCase();
        const matchesCategory = filters.category === 'all' || result.category === filters.category;
        const matchesConfidence = result.relevance >= filters.confidence;
        
        return matchesQuery && matchesType && matchesCategory && matchesConfidence;
      });

      // Sort by relevance
      filteredResults.sort((a, b) => b.relevance - a.relevance);
      
      setSearchResults(filteredResults);
      
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
      
      showNotification(`Found ${filteredResults.length} results for "${searchQuery}"`, 'success');
    } catch (error) {
      console.error('Search error:', error);
      showNotification('Error performing search. Please try again.', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
    setTimeout(() => handleSearch(), 100);
  };

  const handleSaveSearch = () => {
    if (!searchQuery.trim()) {
      showNotification('Please enter a search query to save', 'warning');
      return;
    }

    const newSavedSearch = {
      id: Date.now(),
      query: searchQuery,
      filters: { ...filters },
      timestamp: new Date().toISOString(),
    };

    const updated = [newSavedSearch, ...savedSearches.filter(s => s.query !== searchQuery)];
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    showNotification('Search saved successfully!', 'success');
  };

  const handleLoadSavedSearch = (savedSearch) => {
    setSearchQuery(savedSearch.query);
    setFilters(savedSearch.filters);
    showNotification('Saved search loaded!', 'info');
  };

  const handleDeleteSavedSearch = (searchId) => {
    const updated = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updated);
    localStorage.setItem('savedSearches', JSON.stringify(updated));
    showNotification('Saved search deleted!', 'success');
  };

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
    showNotification('Search history cleared!', 'success');
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowResultDialog(true);
  };

  const handleDownloadResult = (result) => {
    showNotification(`${result.title} download started!`, 'info');
  };

  const handleShareResult = (result) => {
    showNotification(`${result.title} shared successfully!`, 'success');
  };

  const handleBookmarkResult = (result) => {
    showNotification(`${result.title} bookmarked!`, 'success');
  };

  const handleRateResult = (result, rating) => {
    showNotification(`Rated ${result.title} with ${rating} stars!`, 'success');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const clearFilters = () => {
    setFilters({
      documentType: 'all',
      category: 'all',
      dateRange: 'all',
      confidence: 0,
      includeTags: [],
    });
    showNotification('Filters cleared!', 'info');
  };

  const filteredResults = searchResults.filter(result => {
    if (filters.includeTags.length === 0) return true;
    return filters.includeTags.some(tag => result.tags.includes(tag));
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Advanced Search Engine
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find exactly what you need with intelligent search capabilities
        </Typography>
      </Box>

      {/* Search Interface */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search for documents, articles, insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    {isSearching && <CircularProgress size={20} />}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                sx={{ flexGrow: 1 }}
              >
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filters
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        {showFilters && (
          <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Document Type</InputLabel>
                  <Select
                    value={filters.documentType}
                    label="Document Type"
                    onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="document">Documents</MenuItem>
                    <MenuItem value="article">Articles</MenuItem>
                    <MenuItem value="report">Reports</MenuItem>
                    <MenuItem value="research">Research</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filters.category}
                    label="Category"
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  >
                    <MenuItem value="all">All Categories</MenuItem>
                    <MenuItem value="Technical Docs">Technical Docs</MenuItem>
                    <MenuItem value="Process Docs">Process Docs</MenuItem>
                    <MenuItem value="Research Papers">Research Papers</MenuItem>
                    <MenuItem value="Project Files">Project Files</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Min Confidence</InputLabel>
                  <Select
                    value={filters.confidence}
                    label="Min Confidence"
                    onChange={(e) => setFilters({ ...filters, confidence: e.target.value })}
                  >
                    <MenuItem value={0}>Any</MenuItem>
                    <MenuItem value={50}>50%+</MenuItem>
                    <MenuItem value={70}>70%+</MenuItem>
                    <MenuItem value={80}>80%+</MenuItem>
                    <MenuItem value={90}>90%+</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={clearFilters}
                    startIcon={<ClearIcon />}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleSearch}
                    disabled={isSearching}
                  >
                    Apply
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Search Results ({filteredResults.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleSaveSearch}
                disabled={!searchQuery.trim()}
              >
                Save Search
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => setShowHistory(true)}
              >
                View History
              </Button>
            </Box>
          </Box>
          
          <List>
            {filteredResults.map((result, index) => (
              <Box key={result.id}>
                <ListItem sx={{ px: 0, py: 2 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6" sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                  onClick={() => handleViewResult(result)}>
                          {result.title}
                        </Typography>
                        <Chip 
                          label={result.type} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${result.relevance}%`} 
                          size="small" 
                          color="success"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {result.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            By {result.author} • {result.lastModified} • {result.size}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {result.views} views • {result.downloads} downloads
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {result.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              variant="outlined"
                              onClick={() => handleQuickSearch(tag)}
                              sx={{ cursor: 'pointer' }}
                            />
                          ))}
                        </Box>
                      </Box>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IconButton
                          key={star}
                          size="small"
                          onClick={() => handleRateResult(result, star)}
                        >
                          {star <= result.rating ? <StarIcon color="warning" /> : <StarBorderIcon />}
                        </IconButton>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleViewResult(result)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download">
                        <IconButton size="small" onClick={() => handleDownloadResult(result)}>
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Share">
                        <IconButton size="small" onClick={() => handleShareResult(result)}>
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Bookmark">
                        <IconButton size="small" onClick={() => handleBookmarkResult(result)}>
                          <BookmarkIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </ListItem>
                {index < filteredResults.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      )}

      {/* Popular Searches */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUp sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Popular Searches</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {popularSearches.map((search, index) => (
            <Chip
              key={index}
              label={search}
              variant="outlined"
              clickable
              onClick={() => handleQuickSearch(search)}
            />
          ))}
        </Box>
      </Paper>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <BookmarkIcon sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5">Saved Searches</Typography>
          </Box>
          <Grid container spacing={2}>
            {savedSearches.map((savedSearch) => (
              <Grid item xs={12} sm={6} md={4} key={savedSearch.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                      {savedSearch.query}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                      Saved {new Date(savedSearch.timestamp).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleLoadSavedSearch(savedSearch)}
                      >
                        Load
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleDeleteSavedSearch(savedSearch.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Search History */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <History sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Search History</Typography>
          <Box sx={{ ml: 'auto' }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleClearHistory}
              disabled={searchHistory.length === 0}
            >
              Clear History
            </Button>
          </Box>
        </Box>
        {searchHistory.length > 0 ? (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchHistory.map((query, index) => (
              <Chip
                key={index}
                label={query}
                variant="outlined"
                clickable
                onClick={() => handleQuickSearch(query)}
                onDelete={() => {
                  const newHistory = searchHistory.filter((_, i) => i !== index);
                  setSearchHistory(newHistory);
                  localStorage.setItem('searchHistory', JSON.stringify(newHistory));
                }}
              />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Your recent searches will appear here to help you quickly access frequently used queries.
          </Typography>
        )}
      </Paper>

      {/* Search History Dialog */}
      <Dialog 
        open={showHistory} 
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Search History
            <IconButton onClick={() => setShowHistory(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Searches</Typography>
            <List>
              {searchHistoryData.map((query, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText 
                    primary={query}
                    secondary={`Searched ${Math.floor(Math.random() * 7) + 1} days ago`}
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => {
                      handleQuickSearch(query);
                      setShowHistory(false);
                    }}
                  >
                    Search Again
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Result Details Dialog */}
      <Dialog 
        open={showResultDialog} 
        onClose={() => setShowResultDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Document Details
            <IconButton onClick={() => setShowResultDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedResult && (
            <Box sx={{ py: 2 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {selectedResult.title}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip label={selectedResult.type} color="primary" />
                <Chip label={selectedResult.category} color="secondary" />
                <Chip label={`${selectedResult.relevance}% relevance`} color="success" />
              </Box>

              <Typography variant="body1" sx={{ mb: 3 }}>
                {selectedResult.description}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Document Information</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Author:</strong> {selectedResult.author}<br />
                    <strong>Last Modified:</strong> {selectedResult.lastModified}<br />
                    <strong>Size:</strong> {selectedResult.size}<br />
                    <strong>Views:</strong> {selectedResult.views}<br />
                    <strong>Downloads:</strong> {selectedResult.downloads}<br />
                    <strong>Rating:</strong> {selectedResult.rating}/5
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedResult.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        variant="outlined"
                        onClick={() => handleQuickSearch(tag)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 1 }}>Content Preview</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedResult.content}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDownloadResult(selectedResult)}>
            Download
          </Button>
          <Button onClick={() => handleShareResult(selectedResult)}>
            Share
          </Button>
          <Button onClick={() => setShowResultDialog(false)}>
            Close
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
    </Container>
  );
};

export default SearchEngine;
