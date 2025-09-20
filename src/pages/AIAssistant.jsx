import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Paper,
  Alert,
  Skeleton,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert as AlertComponent,
  LinearProgress,
  ListItemButton,
  Collapse,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Stop as StopIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  Code as CodeIcon,
  Business as BusinessIcon,
  Science as ScienceIcon,
  TrendingUp as TrendingUpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  History as HistoryIcon,
  FileDownload as FileDownloadIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "Welcome to the KMRL Knowledge Assistant. I am designed to help you navigate complex documents, extract key information, and answer your questions with precision.\n\nPlease begin by uploading relevant documents such as safety reports, project plans, or technical manuals using the attach button below.",
      timestamp: new Date(),
      confidence: 100,
      sources: ['Internal KMRL Procedures'],
      suggestions: ['Summarize the attached documents', 'What are the key deadlines?', 'Who is responsible for safety compliance?']
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Will store { file, content, status }
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showTrendsDialog, setShowTrendsDialog] = useState(false);
  const [showInsightsDialog, setShowInsightsDialog] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [analyzingTrends, setAnalyzingTrends] = useState(false);
  const [sharingInsights, setSharingInsights] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });
  const [expandedMessage, setExpandedMessage] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch('http://127.0.0.1:5001/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: currentInput }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const aiResponse = {
        id: Date.now(),
        type: 'ai',
        content: data.answer || "Sorry, I couldn't find an answer.",
        timestamp: new Date(),
        confidence: Math.round(data.confidence * 100),
        sources: uploadedFiles.map(f => f.file.name),
        context: data.context, // Store the context from the backend
        suggestions: ['Summarize the key findings', 'Who are the main stakeholders?', 'What are the next steps?']
      };


      setMessages(prev => [...prev, aiResponse]);

    } catch (error) {
      console.error('Error asking question:', error);
      showNotification('Error getting answer from the backend.', 'error');
      const errorResponse = {
        id: Date.now(),
        type: 'ai',
        content: "I'm having trouble connecting to my brain. Please ensure the backend server is running.",
        timestamp: new Date(),
        confidence: 0,
        sources: [],
        suggestions: []
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };


  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsProcessingFiles(true);
    showNotification(`Uploading and processing ${files.length} file(s)...`, 'info');

    const formData = new FormData();
    const fileStatus = files.map(file => ({ file, status: 'uploading' }));
    setUploadedFiles(fileStatus);

    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://127.0.0.1:5001/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File upload failed');
      }

      const data = await response.json();
      showNotification(data.message, 'success');
      setUploadedFiles(files.map(file => ({ file, status: 'processed' })));

    } catch (error) {
      console.error('Error uploading files:', error);
      showNotification('Error uploading files. Is the backend running?', 'error');
      setUploadedFiles(files.map(file => ({ file, status: 'error' })));
    } finally {
      setIsProcessingFiles(false);
    }
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      showNotification('Voice recording started. Click stop when finished.', 'info');
    } else {
      showNotification('Voice recording stopped. Processing audio...', 'info');
      // Simulate voice processing
      setTimeout(() => {
        const voiceText = "This is a simulated voice input based on your recording.";
        setInput(voiceText);
        showNotification('Voice input processed successfully!', 'success');
      }, 2000);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      setShowReportDialog(true);
      showNotification('Report generated successfully!', 'success');
    } catch (error) {
      showNotification('Error generating report. Please try again.', 'error');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleAnalyzeTrends = async () => {
    setAnalyzingTrends(true);
    try {
      // Simulate trend analysis
      await new Promise(resolve => setTimeout(resolve, 2500));
      setShowTrendsDialog(true);
      showNotification('Trend analysis completed!', 'success');
    } catch (error) {
      showNotification('Error analyzing trends. Please try again.', 'error');
    } finally {
      setAnalyzingTrends(false);
    }
  };

  const handleShareInsights = async () => {
    setSharingInsights(true);
    try {
      // Simulate sharing insights
      await new Promise(resolve => setTimeout(resolve, 2000));
      setShowInsightsDialog(true);
      showNotification('Insights shared successfully!', 'success');
    } catch (error) {
      showNotification('Error sharing insights. Please try again.', 'error');
    } finally {
      setSharingInsights(false);
    }
  };

  const handleDownloadConversation = () => {
    const conversationText = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversationText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('Conversation downloaded successfully!', 'success');
  };

  const handleClearConversation = () => {
    setMessages([messages[0]]); // Keep the initial greeting
    setConversationHistory([]);
    showNotification('Conversation cleared!', 'info');
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ open: true, message, type });
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const MessageBubble = ({ message }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: message.type === 'user' ? 'flex-end' : 'flex-start',
        }}
      >
        {message.type === 'ai' && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
              <PsychologyIcon />
            </Avatar>
            <Typography variant="caption" color="text.secondary">
              AI Assistant • {message.timestamp.toLocaleTimeString()}
            </Typography>
          </Box>
        )}
        
        <Paper
          sx={{
            p: 2,
            bgcolor: message.type === 'user' ? 'primary.main' : 'background.paper',
            color: message.type === 'user' ? 'primary.contrastText' : 'text.primary',
            borderRadius: 2,
            boxShadow: 1,
            position: 'relative',
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
            }}
          >
            {message.content}
          </Typography>
          
          {message.type === 'ai' && (
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Chip 
                  label={`${message.confidence}% confidence`} 
                  size="small" 
                  color="success" 
                  variant="outlined"
                />
                <IconButton
                  size="small"
                  onClick={() => setExpandedMessage(expandedMessage === message.id ? null : message.id)}
                >
                  <ExpandMoreIcon 
                    sx={{ 
                      transform: expandedMessage === message.id ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.2s'
                    }} 
                  />
                </IconButton>
              </Box>
              
              <Collapse in={expandedMessage === message.id}>
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Context Used:</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 150, overflowY: 'auto', mb: 2, backgroundColor: 'rgba(0,0,0,0.03)' }}>
                    <Typography variant="caption" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {message.context || "No context was retrieved."}
                    </Typography>
                  </Paper>

                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Source Document(s):</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {message.sources && message.sources.length > 0 
                      ? message.sources.map((source, index) => (
                          <Chip key={index} label={source} size="small" variant="outlined" />
                        ))
                      : <Typography variant="caption">N/A</Typography>
                    }
                  </Box>
                  
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>Suggestions:</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {message.suggestions.map((suggestion, index) => (
                      <Chip
                        key={index}
                        label={suggestion}
                        size="small"
                        color="primary"
                        variant="outlined"
                        onClick={() => handleSuggestionClick(suggestion)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Box>
                </Box>
              </Collapse>
            </Box>
          )}
        </Paper>
        
        {message.type === 'user' && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {message.timestamp.toLocaleTimeString()}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        AI Knowledge Assistant
      </Typography>

      <Grid container spacing={3}>
        {/* Main Chat Area */}
        <Grid item xs={12} lg={8}>
  
          {/* Chat Interface */}
          <Card sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 0 }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Conversation
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Download conversation">
                      <IconButton size="small" onClick={handleDownloadConversation}>
                        <FileDownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Clear conversation">
                      <IconButton size="small" onClick={handleClearConversation}>
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box 
                ref={chatContainerRef}
                sx={{ 
                  flexGrow: 1, 
                  overflowY: 'auto', 
                  p: 2,
                  maxHeight: '400px',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#c1c1c1',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    background: '#a8a8a8',
                  },
                }}
              >
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}>
                        <PsychologyIcon />
                      </Avatar>
                      <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={16} />
                          <Typography variant="body2" color="text.secondary">
                            AI is thinking...
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  </Box>
                )}
                
                <div ref={messagesEndRef} />
              </Box>

              {/* Input Area */}
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Ask me anything about your knowledge base, projects, or team..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    variant="outlined"
                    size="small"
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <input
                      accept="*/*"
                      style={{ display: 'none' }}
                      id="file-upload"
                      multiple
                      type="file"
                      onChange={handleFileUpload}
                    />
                    <label htmlFor="file-upload">
                      <Tooltip title="Attach files">
                        <IconButton component="span" color="primary">
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                    </label>
                    <Tooltip title={isRecording ? "Stop recording" : "Voice input"}>
                      <IconButton
                        color={isRecording ? "error" : "primary"}
                        onClick={handleVoiceInput}
                      >
                        {isRecording ? <StopIcon /> : <MicIcon />}
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isTyping}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Sidebar */}
        <Grid item xs={12} lg={4}>
          <Grid container spacing={2}>
            {/* Uploaded Files */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Uploaded Files
                  </Typography>
                  {uploadedFiles.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No files uploaded yet
                    </Typography>
                  ) : (
                    <List dense>
                      {uploadedFiles.map((file, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <AttachFileIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={file.file.name}
                            secondary={`${(file.file.size / 1024).toFixed(1)} KB - ${file.status}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Quick Actions */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<AutoAwesomeIcon />}
                      fullWidth
                      size="small"
                      onClick={handleGenerateReport}
                      disabled={generatingReport}
                    >
                      {generatingReport ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Generating...
                        </>
                      ) : (
                        'Generate Report'
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<TrendingUpIcon />}
                      fullWidth
                      size="small"
                      onClick={handleAnalyzeTrends}
                      disabled={analyzingTrends}
                    >
                      {analyzingTrends ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Analyzing...
                        </>
                      ) : (
                        'Analyze Trends'
                      )}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<ShareIcon />}
                      fullWidth
                      size="small"
                      onClick={handleShareInsights}
                      disabled={sharingInsights}
                    >
                      {sharingInsights ? (
                        <>
                          <CircularProgress size={16} sx={{ mr: 1 }} />
                          Sharing...
                        </>
                      ) : (
                        'Share Insights'
                      )}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Conversation History */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Recent Conversations
                  </Typography>
                  {conversationHistory.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                      No recent conversations
                    </Typography>
                  ) : (
                    <List dense>
                      {conversationHistory.slice(0, 5).map((conv) => (
                        <ListItem key={conv.id} sx={{ px: 0 }}>
                          <ListItemButton
                            onClick={() => {
                              setInput(conv.query);
                              showNotification('Query loaded from history!', 'info');
                            }}
                            sx={{ px: 0 }}
                          >
                            <ListItemText
                              primary={conv.query}
                              secondary={`${conv.timestamp.toLocaleTimeString()} • ${conv.mode}`}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{ variant: 'caption' }}
                            />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Generate Report Dialog */}
      <Dialog 
        open={showReportDialog} 
        onClose={() => setShowReportDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            AI Generated Report
            <IconButton onClick={() => setShowReportDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Executive Summary</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Based on our analysis of the knowledge base and recent conversations, here are the key insights:
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary.main" sx={{ mb: 1 }}>
                      Top Topics
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Project Management" secondary="67% of queries" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Technical Documentation" secondary="23% of queries" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Team Collaboration" secondary="10% of queries" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="success.main" sx={{ mb: 1 }}>
                      Recommendations
                    </Typography>
                    <List dense>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Update project documentation" secondary="High priority" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Improve technical guides" secondary="Medium priority" />
                      </ListItem>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemText primary="Enhance team processes" secondary="Low priority" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReportDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analyze Trends Dialog */}
      <Dialog 
        open={showTrendsDialog} 
        onClose={() => setShowTrendsDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Trend Analysis Results
            <IconButton onClick={() => setShowTrendsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Trend Analysis Overview</Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" color="success.main" sx={{ mb: 1 }}>
                      +23%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Increase in project queries
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <AutoAwesomeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                      89%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      AI confidence score
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <PsychologyIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h4" color="secondary.main" sx={{ mb: 1 }}>
                      156
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total interactions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Key Insights</Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              • Project management queries have increased significantly over the last month
              • Technical documentation requests show a steady upward trend
              • Team collaboration topics are gaining more attention
              • AI response accuracy has improved by 15% since last analysis
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTrendsDialog(false)}>Close</Button>
          <Button variant="contained" startIcon={<ShareIcon />}>
            Share Analysis
          </Button>
        </DialogActions>
      </Dialog>

      {/* Share Insights Dialog */}
      <Dialog 
        open={showInsightsDialog} 
        onClose={() => setShowInsightsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Share Insights
            <IconButton onClick={() => setShowInsightsDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Share Options</Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ContentCopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText('AI Assistant Insights Summary');
                    showNotification('Insights copied to clipboard!', 'success');
                  }}
                >
                  Copy to Clipboard
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={() => {
                    showNotification('Insights exported successfully!', 'success');
                  }}
                >
                  Export as PDF
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ShareIcon />}
                  onClick={() => {
                    showNotification('Insights shared with team!', 'success');
                  }}
                >
                  Share with Team
                </Button>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInsightsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <AlertComponent 
          onClose={closeNotification} 
          severity={notification.type}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </AlertComponent>
      </Snackbar>
    </Box>
  );
};

export default AIAssistant;
