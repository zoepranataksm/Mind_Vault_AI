import os
import fitz  # PyMuPDF
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModelForQuestionAnswering
from sentence_transformers import SentenceTransformer
import numpy as np
import faiss
from PIL import Image
import io
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# --- Initialization ---
app = Flask(__name__)
CORS(app) # Allow frontend to call backend

# Configure Gemini API
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# Load models from Hugging Face
# Using a high-performance embedding model for better semantic understanding
embedding_model = SentenceTransformer('sentence-transformers/all-mpnet-base-v2')
# Using a state-of-the-art QA model with much better accuracy
qa_model_name = "deepset/deberta-v3-large-squad2"
qa_tokenizer = AutoTokenizer.from_pretrained(qa_model_name)
qa_model = AutoModelForQuestionAnswering.from_pretrained(qa_model_name)
qa_pipeline = pipeline('question-answering', model=qa_model, tokenizer=qa_tokenizer)
# OCR pipeline for printed text
ocr_pipeline = pipeline("image-to-text", model="microsoft/trocr-base-printed")

# In-memory knowledge base
knowledge_base = {
    "documents": {},
    "index": None,
    "text_chunks": []
}

# --- Helper Functions ---
def extract_text_from_file(file_storage):
    """Extracts text from various file types (PDF, TXT, Images)."""
    filename = file_storage.filename
    file_content = file_storage.read()

    if filename.lower().endswith('.pdf'):
        with fitz.open(stream=file_content, filetype='pdf') as doc:
            return " ".join(page.get_text() for page in doc)
    elif filename.lower().endswith('.txt'):
        return file_content.decode('utf-8')
    elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        try:
            image = Image.open(io.BytesIO(file_content))
            # The OCR pipeline returns a list of dictionaries
            result = ocr_pipeline(image)
            return result[0]['generated_text'] if result else ""
        except Exception as e:
            print(f"Error processing image {filename}: {e}")
            return ""
    return None

def chunk_text(text, chunk_size=1024, overlap=128):
    """Splits text into overlapping chunks with better context preservation."""
    # Split by sentences first to preserve context
    sentences = text.split('. ')
    chunks = []
    current_chunk = ""
    
    for sentence in sentences:
        # Check if adding this sentence would exceed chunk size
        test_chunk = current_chunk + sentence + ". "
        tokens = qa_tokenizer.encode(test_chunk, add_special_tokens=False)
        
        if len(tokens) > chunk_size and current_chunk:
            # Add current chunk and start new one with overlap
            chunks.append(current_chunk.strip())
            # Keep last few sentences for overlap
            overlap_sentences = current_chunk.split('. ')[-2:]
            current_chunk = '. '.join(overlap_sentences) + ". " + sentence + ". "
        else:
            current_chunk += sentence + ". "
    
    # Add the last chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())
    
    return chunks

# --- API Endpoints ---
@app.route('/api/upload', methods=['POST'])
def upload_files():
    """Handles file uploads, processes them, and builds the vector store."""
    if 'files' not in request.files:
        return jsonify({"error": "No files part"}), 400

    files = request.files.getlist('files')
    if not files or files[0].filename == '':
        return jsonify({"error": "No selected files"}), 400

    # Reset knowledge base for new upload session
    global knowledge_base
    knowledge_base = {"documents": {}, "index": None, "text_chunks": []}

    for file in files:
        text = extract_text_from_file(file)
        if text:
            chunks = chunk_text(text)
            knowledge_base['text_chunks'].extend(chunks)
            knowledge_base['documents'][file.filename] = text

    if not knowledge_base['text_chunks']:
        return jsonify({"error": "Could not extract any text from the files."}), 400

    # Create embeddings and build FAISS index
    embeddings = embedding_model.encode(knowledge_base['text_chunks'], convert_to_tensor=False)
    dimension = embeddings.shape[1]
    knowledge_base['index'] = faiss.IndexFlatL2(dimension)
    knowledge_base['index'].add(np.array(embeddings, dtype=np.float32))

    return jsonify({"message": f"{len(files)} files processed successfully."}), 200

@app.route('/api/ask', methods=['POST'])
def ask_question():
    """Receives a question, retrieves relevant context, and generates an answer."""
    data = request.get_json()
    question = data.get('question')

    if not question:
        return jsonify({"error": "No question provided"}), 400

    if not knowledge_base['index']:
        return jsonify({"answer": "Please upload some documents first."})

    # 1. Retrieve relevant documents with better filtering
    question_embedding = embedding_model.encode([question])
    k = 8  # Retrieve more candidates for better selection
    distances, indices = knowledge_base['index'].search(np.array(question_embedding, dtype=np.float32), k)
    
    # Filter chunks by relevance threshold and remove duplicates
    retrieved_chunks = []
    seen_chunks = set()
    relevance_threshold = 1.5  # Lower distance = more relevant
    
    for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
        if distance < relevance_threshold:
            chunk = knowledge_base['text_chunks'][idx]
            # Avoid near-duplicate chunks
            chunk_key = chunk[:100]  # Use first 100 chars as key
            if chunk_key not in seen_chunks:
                retrieved_chunks.append(chunk)
                seen_chunks.add(chunk_key)
                if len(retrieved_chunks) >= 5:  # Limit to top 5 unique chunks
                    break
    
    if not retrieved_chunks:
        # If no chunks meet threshold, take the most relevant ones anyway
        retrieved_chunks = [knowledge_base['text_chunks'][i] for i in indices[0][:3]]
    
    context = " ".join(retrieved_chunks)

    # 2. Generate answer using Gemini API with retrieved context
    try:
        prompt = f"""Based on the following document context, please answer the user's question accurately and concisely.

Context from documents:
{context}

User Question: {question}

Please provide a clear, informative answer based on the context provided. If the context doesn't contain enough information to answer the question, please say so clearly."""

        response = gemini_model.generate_content(prompt)
        answer = response.text
        
        # Calculate a confidence score based on context relevance
        confidence = min(0.95, max(0.1, len(context) / 2000))  # Simple heuristic
        
    except Exception as e:
        print(f"Gemini API error: {e}")
        # Fallback to local model if Gemini fails
        result = qa_pipeline(question=question, context=context)
        answer = result['answer']
        confidence = result['score']

    return jsonify({
        "answer": answer,
        "confidence": confidence,
        "context": context
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    # Use a different port to avoid conflict with React dev server
    app.run(debug=True, port=5001)
