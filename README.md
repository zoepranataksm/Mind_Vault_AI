# Mind Vault - AI-Based Knowledge Transfer System

## 🚀 Project Overview

Mind Vault is a sophisticated AI-driven knowledge transfer system designed to automate employee onboarding and handover processes by extracting, processing, and making searchable knowledge from enterprise documents and tools. This system transforms unstructured project data into actionable, searchable knowledge that accelerates team productivity and preserves institutional memory.

## 🎯 Core Problem Solved

- **Knowledge Loss Prevention**: Prevents tribal knowledge from being lost during employee transitions
- **Onboarding Efficiency**: Streamlines new employee onboarding through structured knowledge access
- **Documentation Sync**: Keeps project documentation synchronized with actual discussions and decisions
- **Team Collaboration**: Centralized knowledge base accessible to all teams with audit trails

## 🏗️ Architecture & System Design

### 1. Frontend Dashboard (React.js)
Built with modern React.js and Material-UI, featuring:

#### **Core Pages:**
- **Dashboard**: Overview of knowledge categories, recent updates, and system analytics
- **AI Assistant**: Intelligent chatbot interface for Q&A with document context
- **Document Processor**: Upload and process documents (PDF, TXT, Images) with OCR support
- **Search Engine**: Advanced semantic search with filters and contextual retrieval
- **Knowledge Base**: Browse organized knowledge by categories and tags
- **Analytics**: Usage statistics, knowledge insights, and system performance metrics
- **Project Management**: Track knowledge extraction projects and workflows
- **Team Collaboration**: Shared workspaces and collaborative knowledge building
- **Settings**: User preferences, system configuration, and integrations

#### **Key Components:**
- **Advanced Sidebar**: Navigation with collapsible menu and quick access
- **Confluence Connector**: Integration panel for Atlassian Confluence
- **Jira Connector**: Integration panel for Jira project management
- **Pipeline Monitor**: Real-time processing status and job monitoring
- **Search Interface**: Advanced filtering and semantic search capabilities

### 2. Backend Infrastructure (Flask + AI/ML)

#### **Core API Endpoints:**
- `POST /api/upload` - File upload and processing endpoint
- `POST /api/ask` - Question answering with context retrieval
- `GET /api/health` - System health monitoring

#### **AI Processing Pipeline:**
1. **Document Ingestion**: Multi-format support (PDF, TXT, Images)
2. **Text Extraction**: PyMuPDF for PDFs, OCR for images using TrOCR
3. **Intelligent Chunking**: Context-preserving text segmentation with overlap
4. **Embedding Generation**: Sentence-BERT (all-mpnet-base-v2) for semantic vectors
5. **Vector Indexing**: FAISS for ultra-fast similarity search
6. **Question Answering**: DeBERTa-v3-large + Google Gemini API integration

## 🛠️ Technology Stack

### **Frontend Technologies:**
- **Framework**: React 18.2.0 with Vite for fast development
- **UI Library**: Material-UI (MUI) v5.15.0 with custom theming
- **Routing**: React Router DOM v6.20.1
- **State Management**: React Context API
- **Internationalization**: i18next for multi-language support
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns with MUI date pickers

### **Backend Technologies:**
- **Framework**: Flask 3.0.3 with CORS support
- **AI/ML Stack**:
  - PyTorch 2.0.1 with CUDA support
  - Transformers 4.35.2 (Hugging Face)
  - Sentence-Transformers 2.2.2
  - FAISS 1.7.4 for vector search
  - Google Generative AI (Gemini)
- **Document Processing**:
  - PyMuPDF for PDF extraction
  - Pillow for image processing
  - TrOCR for OCR capabilities
- **Data Science**: NumPy, Pandas, Scikit-learn, SciPy

### **Development & Deployment:**
- **Environment**: Python 3.8+ with virtual environment
- **Configuration**: python-dotenv for environment variables
- **Development Server**: Vite dev server (frontend) + Flask dev server (backend)

## 📋 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- CUDA-compatible GPU (optional, for faster processing)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Mind_Vault
```

### 2. Frontend Setup
```bash
# Install frontend dependencies
npm install

# Start development server
npm run dev
```

### 3. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Environment Configuration
Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
FLASK_ENV=development
```

### 5. Start the Application
```bash
# Terminal 1: Start backend (from backend directory)
python app.py

# Terminal 2: Start frontend (from root directory)
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5001`

## 🔧 Key Features & Capabilities

### **AI-Powered Features:**
- **Semantic Search**: Find content by meaning, not just keywords
- **Contextual Q&A**: Get answers with relevant document context
- **Intelligent Chunking**: Preserve context while processing large documents
- **Multi-format Support**: PDF, TXT, and image documents with OCR
- **Confidence Scoring**: AI confidence levels for generated answers

### **User Experience:**
- **Modern UI**: Material Design with dark/light theme support
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Multi-language**: Built-in internationalization support
- **Real-time Processing**: Live updates during document processing
- **Advanced Analytics**: Usage statistics and knowledge insights

### **Enterprise Features:**
- **Scalable Architecture**: FAISS indexing handles millions of documents
- **Security**: Environment-based configuration for API keys
- **Audit Trail**: Track knowledge evolution and usage patterns
- **Integration Ready**: Designed for Jira and Confluence integration

## 📊 Data Flow & Processing

1. **Upload**: Users upload documents through the web interface
2. **Extract**: Backend extracts text using appropriate parsers (PyMuPDF, OCR)
3. **Chunk**: Text is intelligently segmented with context preservation
4. **Embed**: Sentence-BERT generates semantic embeddings
5. **Index**: FAISS creates searchable vector index
6. **Query**: Users ask questions through natural language interface
7. **Retrieve**: System finds relevant document chunks using semantic similarity
8. **Generate**: AI generates contextual answers using retrieved information

## 🚀 Usage Examples

### Document Upload and Processing
1. Navigate to **Document Processor** page
2. Upload PDF, TXT, or image files
3. System automatically extracts and processes content
4. Knowledge becomes immediately searchable

### AI-Powered Q&A
1. Go to **AI Assistant** page
2. Ask questions in natural language
3. System retrieves relevant context and generates answers
4. View confidence scores and source context

### Semantic Search
1. Use **Search Engine** page for advanced queries
2. Search by meaning, not just exact keywords
3. Apply filters by date, source, or content type
4. Get ranked results with relevance scores

## 🔮 Future Enhancements

### Planned Features:
- **LangChain Integration**: Advanced AI orchestration and chaining
- **Role-Based Access Control**: SSO and granular permissions
- **Multilingual Support**: Global team accessibility
- **Time-Aware Indexing**: Document aging and relevance scoring
- **Slack Integration**: Chatbot access from team communication tools
- **Advanced Connectors**: Direct Jira and Confluence API integration
- **Knowledge Graphs**: Visual representation of knowledge relationships

### Scalability Improvements:
- **Microservices Architecture**: Containerized deployment with Docker
- **Database Integration**: MongoDB for persistent storage
- **Caching Layer**: Redis for improved response times
- **Load Balancing**: Nginx for production deployment
- **Monitoring**: Comprehensive logging and performance metrics

## 🤝 Contributing

This project is designed for enterprise knowledge management and follows best practices for:
- Code organization and modularity
- Security and authentication
- Scalability and performance
- User experience and accessibility

## 📄 License

This project is part of an AI-based knowledge transfer system designed for enterprise use.

---

**Mind Vault** - Transforming unstructured knowledge into actionable intelligence for modern teams.
