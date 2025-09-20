import React, { useState, useRef } from 'react';
import Tesseract from 'tesseract.js';
import nlp from 'compromise';
import { 
  Box, 
  Typography, 
  Paper, 
  Container, 
  Button, 
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Divider,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
} from '@mui/material';
import { 
  Upload, 
  Description, 
  AutoAwesome, 
  Storage, 
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  FileCopy as FileCopyIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';

const DocumentProcessor = () => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [processedFiles, setProcessedFiles] = useState([]);
  const [analysisResults, setAnalysisResults] = useState({});
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [extractedText, setExtractedText] = useState('');

  // Mock data for demonstration
  const mockUploadedFiles = [
    {
      id: 1,
      name: 'API_Documentation.pdf',
      size: '2.4 MB',
      type: 'pdf',
      uploadedAt: '2024-01-15',
      status: 'processed',
      category: 'Technical Docs',
      tags: ['API', 'Documentation', 'Technical'],
      insights: 5,
      confidence: 92,
    },
    {
      id: 2,
      name: 'User_Manual.docx',
      size: '1.8 MB',
      type: 'docx',
      uploadedAt: '2024-01-14',
      status: 'processed',
      category: 'Process Docs',
      tags: ['User Guide', 'Process', 'Manual'],
      insights: 3,
      confidence: 87,
    },
    {
      id: 3,
      name: 'Project_Report.xlsx',
      size: '3.2 MB',
      type: 'xlsx',
      uploadedAt: '2024-01-13',
      status: 'processing',
      category: 'Project Files',
      tags: ['Project', 'Report', 'Data'],
      insights: 0,
      confidence: 0,
    },
  ];

  useState(() => {
    setUploadedFiles(mockUploadedFiles);
    setProcessedFiles(mockUploadedFiles.filter(f => f.status === 'processed'));
  });

  const handleFileUpload = async (files) => {
    setUploading(true);
    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newFiles = Array.from(files).map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        type: file.type.split('/')[1] || 'document',
        uploadedAt: new Date().toISOString().split('T')[0],
        status: 'uploaded',
        category: 'Uncategorized',
        tags: [],
        insights: 0,
        confidence: 0,
      }));

      setUploadedFiles(prev => [...newFiles, ...prev]);
      setShowUploadDialog(false);
      showNotification(`${newFiles.length} document(s) uploaded successfully!`, 'success');
      
      // Auto-process files
      setTimeout(() => processFiles(Array.from(files)), 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
      showNotification('Error uploading files. Please try again.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const processFiles = async (files) => {
    setProcessing(true);
    showNotification('Starting document processing...', 'info');

    for (const file of files) {
      const fileType = file.type.split('/')[1] || '';
      const isImage = ['png', 'jpeg', 'jpg', 'bmp', 'gif'].includes(fileType);

      if (isImage) {
        try {
          const { data: { text } } = await Tesseract.recognize(
            file,
            'eng',
            {
              logger: m => {
                if (m.status === 'recognizing text') {
                  setOcrProgress(Math.floor(m.progress * 100));
                }
              }
            }
          );
          setExtractedText(text);
          showNotification(`Extracted text from ${file.name}`, 'success');

          // Update file status to processed
          setUploadedFiles(prev =>
            prev.map(f =>
              f.name === file.name ? { ...f, status: 'processed', insights: 1, confidence: 95, category: 'Image Scan', tags: ['ocr', 'image'] } : f
            )
          );
          setProcessedFiles(prev => [...prev, file]);

        } catch (err) {
          console.error('OCR Error:', err);
          showNotification(`Error processing ${file.name}.`, 'error');
        }
      } else {
        // Simulate processing for non-image files for now
        await new Promise(resolve => setTimeout(resolve, 1500));
        setUploadedFiles(prev =>
          prev.map(f =>
            f.name === file.name ? { ...f, status: 'processed', category: getRandomCategory(), tags: getRandomTags(), insights: Math.floor(Math.random() * 5) + 1, confidence: 80 + Math.floor(Math.random() * 20) } : f
          )
        );
        setProcessedFiles(prev => [...prev, file]);
      }
    }

    setProcessing(false);
    setOcrProgress(0);
    showNotification('All documents processed!', 'success');
  };

  const getRandomCategory = () => {
    const categories = ['Technical Docs', 'Process Docs', 'Knowledge Base', 'Project Files', 'Research Papers'];
    return categories[Math.floor(Math.random() * categories.length)];
  };

  const getRandomTags = () => {
    const allTags = ['Technical', 'Process', 'API', 'Documentation', 'User Guide', 'Project', 'Report', 'Data', 'Analysis', 'Research'];
    const numTags = Math.floor(Math.random() * 4) + 1;
    const shuffled = allTags.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numTags);
  };

  const handleAnalyzeFile = async (file) => {
    setSelectedFile(file);
    setShowAnalysisDialog(true);
    setAnalysisResults({}); // Clear previous results

    // For non-image files, we'll use a mock text for NLP demonstration
    const textToAnalyze = file.type.includes('image') 
      ? extractedText 
      : `This is a sample document for ${file.name}. It discusses project management, software development life cycles, and team collaboration. Key individuals involved include John Doe, the project manager, and Jane Smith, the lead developer. The project is based in New York. The goal is to enhance user engagement for the client, Acme Corporation.`;

    if (!textToAnalyze) {
      showNotification('No text available to analyze for this file.', 'warning');
      return;
    }

    try {
      const doc = nlp(textToAnalyze);
      
      const topics = doc.nouns().out('array').slice(0, 5);
      const people = doc.people().out('array');
      const places = doc.places().out('array');
      const organizations = doc.organizations().out('array');

      const analysis = {
        summary: `AI analysis of ${file.name} identifies key topics and entities.`,
        keyTopics: [...new Set(topics)], // Remove duplicates
        entities: [...new Set([...people, ...places, ...organizations])], // Combine and remove duplicates
        sentiment: 'positive', // Placeholder
        confidence: file.confidence,
        recommendations: [
          'Review key topics for document summary.',
          'Identify key entities for stakeholder mapping.',
          'Archive document based on identified category.'
        ]
      };

      setAnalysisResults(analysis);
    } catch (error) {
      console.error('Error analyzing file:', error);
      showNotification('Error analyzing file. Please try again.', 'error');
    }
  };

  const handleDeleteFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setProcessedFiles(prev => prev.filter(f => f.id !== fileId));
    showNotification('File deleted successfully!', 'success');
  };

  const handleDownloadFile = (file) => {
    // Simulate file download
    showNotification(`${file.name} download started!`, 'info');
  };

  const handleShareFile = (file) => {
    // Simulate file sharing
    showNotification(`${file.name} shared successfully!`, 'success');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesType = filterType === 'all' || file.type === filterType;
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Document Processor
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Upload, process, and analyze documents with AI-powered insights
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>File Type</InputLabel>
              <Select
                value={filterType}
                label="File Type"
                onChange={(e) => setFilterType(e.target.value)}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="docx">Word</MenuItem>
                <MenuItem value="xlsx">Excel</MenuItem>
                <MenuItem value="pptx">PowerPoint</MenuItem>
                <MenuItem value="txt">Text</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Upload />}
              onClick={() => setShowUploadDialog(true)}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Document List */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">Documents ({filteredFiles.length})</Typography>
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
            variant="outlined"
          >
            Refresh
          </Button>
        </Box>
        
        <List>
          {filteredFiles.map((file, index) => (
            <React.Fragment key={file.id}>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <Description color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {file.name}
                      </Typography>
                      <Chip 
                        label={file.status} 
                        size="small" 
                        color={file.status === 'processed' ? 'success' : 'warning'}
                      />
                      <Chip 
                        label={file.type.toUpperCase()} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {file.size} • {file.category} • Uploaded {file.uploadedAt}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                        {file.tags.map((tag, tagIndex) => (
                          <Chip 
                            key={tagIndex} 
                            label={tag} 
                            size="small" 
                            variant="outlined"
                          />
                        ))}
                      </Box>
                      {file.status === 'processed' && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {file.insights} insights • {file.confidence}% confidence
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  }
                />
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {file.status === 'processed' && (
                    <>
                      <Button
                        size="small"
                        startIcon={<AutoAwesome />}
                        onClick={() => handleAnalyzeFile(file)}
                        variant="outlined"
                      >
                        Analyze
                      </Button>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadFile(file)}
                        variant="outlined"
                      >
                        Download
                      </Button>
                      <Button
                        size="small"
                        startIcon={<FileCopyIcon />}
                        onClick={() => handleShareFile(file)}
                        variant="outlined"
                      >
                        Share
                      </Button>
                    </>
                  )}
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteFile(file.id)}
                    variant="outlined"
                    color="error"
                  >
                    Delete
                  </Button>
                </Box>
              </ListItem>
              {index < filteredFiles.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* AI Processing Status */}
      {processing && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <AutoAwesome sx={{ mr: 2, color: 'primary.main' }} />
            <Typography variant="h5">AI Processing</Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            Advanced AI algorithms are extracting key information, summarizing content, and identifying important insights from your documents.
          </Typography>
          {ocrProgress > 0 ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Extracting text from image... ({ocrProgress}%)
              </Typography>
              <LinearProgress variant="determinate" value={ocrProgress} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          ) : (
            <Box>
              <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Processing documents... Please wait.
              </Typography>
            </Box>
          )}
        </Paper>
      )}

      {/* Content Analysis */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Description sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Content Analysis</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Get detailed analysis including sentiment, key topics, entities, and relationships within your documents.
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                  {processedFiles.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Documents Analyzed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary.main" sx={{ mb: 1 }}>
                  {processedFiles.reduce((sum, f) => sum + f.insights, 0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Insights
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                  {Math.round(processedFiles.reduce((sum, f) => sum + f.confidence, 0) / Math.max(processedFiles.length, 1))}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Confidence
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Smart Storage */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Storage sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5">Smart Storage</Typography>
        </Box>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Intelligent document organization with automatic categorization, tagging, and search capabilities.
        </Typography>
        <Grid container spacing={2}>
          {['Technical Docs', 'Process Docs', 'Knowledge Base', 'Project Files'].map((category) => {
            const count = uploadedFiles.filter(f => f.category === category).length;
            return (
              <Grid item xs={12} sm={6} md={3} key={category}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>

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
              ref={fileInputRef}
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              multiple
              type="file"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <Button
              variant="contained"
              component="span"
              startIcon={<Upload />}
              size="large"
              disabled={uploading}
              sx={{ mb: 2 }}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? 'Uploading...' : 'Choose Files'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Supported formats: PDF, Word, Excel, PowerPoint, Text
            </Typography>
            {uploading && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                <LinearProgress sx={{ width: '100%', height: 8, borderRadius: 4 }} />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  Uploading documents...
                </Typography>
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

      {/* Analysis Results Dialog */}
      <Dialog 
        open={showAnalysisDialog} 
        onClose={() => setShowAnalysisDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            AI Analysis Results
            <IconButton onClick={() => setShowAnalysisDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFile && analysisResults.summary ? (
            <Box sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {selectedFile.name}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {analysisResults.summary}
              </Typography>

              {extractedText && selectedFile?.type.includes('image') && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Extracted Text</Typography>
                  <Paper variant="outlined" sx={{ p: 2, maxHeight: 200, overflowY: 'auto', backgroundColor: 'grey.100' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {extractedText}
                    </Typography>
                  </Paper>
                </Box>
              )}


              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Key Topics</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {analysisResults.keyTopics?.map((topic, index) => (
                      <Chip key={index} label={topic} color="primary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Entities</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {analysisResults.entities?.map((entity, index) => (
                      <Chip key={index} label={entity} color="secondary" variant="outlined" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Recommendations</Typography>
                  <List dense>
                    {analysisResults.recommendations?.map((rec, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={rec} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalysisDialog(false)}>
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

export default DocumentProcessor;
