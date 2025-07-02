from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import os

from utils.faiss_utils import load_faiss_index, search_faiss_index
from utils.generativeai_utils import configure_genai, generate_response
from sentence_transformers import SentenceTransformer

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load everything once
faiss_index = load_faiss_index("knowledge_base/vector.index")

with open("knowledge_base/text_extracted_list.pkl", "rb") as f:
    texts, embeddings = pickle.load(f)

with open("knowledge_base/documents.pkl", "rb") as f:
    documents = pickle.load(f)

encoder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Hardcoded generative model config
GENAI_API_KEY = "AIzaSyAL-uBGSuGfkOYIpgNAOFDI3ExdBt-Z-rM"
GENAI_MODEL = "gemini-2.0-flash"
model = configure_genai(
    api_key=GENAI_API_KEY,
    model_name=GENAI_MODEL
)

class QueryRequest(BaseModel):
    query: str
    history: list[dict] = []

@app.post("/query")
def handle_query(data: QueryRequest):
    user_query = data.query
    history = data.history

    query_embedding = encoder.encode(user_query).astype("float32")
    indices = search_faiss_index(faiss_index, query_embedding, k=3)
    extracted_chunks = [texts[i] for i in indices]

    response = generate_response(model, "\n".join(extracted_chunks), user_query, history)

    return {
        "response": response,
        "chunks": extracted_chunks
    }