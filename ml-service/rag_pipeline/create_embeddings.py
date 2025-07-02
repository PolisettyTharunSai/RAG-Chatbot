import numpy as np
import pickle
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sentence_transformers import SentenceTransformer
from utils.faiss_utils import create_faiss_index
from utils.db_utils import fetch_texts_from_mongo
from dotenv import load_dotenv

load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# MONGO_DB = os.getenv("MONGO_DB")
# MONGO_COLLECTION = os.getenv("MONGO_COLLECTION")

# print("MONGO_URI:", MONGO_URI)
# print("MONGO_DB:", MONGO_DB)
# print("MONGO_COLLECTION:", MONGO_COLLECTION)

MONGO_URI = "mongodb://localhost:27017"
MONGO_DB = "ScraperDB"
MONGO_COLLECTION = "pages"

texts, docs = fetch_texts_from_mongo(MONGO_URI, MONGO_DB, MONGO_COLLECTION)

print("All fetched docs:")
for doc in docs:
    print(doc)
print(f"Texts extracted: {len(texts)}")

def create_embeddings(text_extracted_list, model_name="sentence-transformers/all-MiniLM-L6-v2"):
    """Generates embeddings for the extracted texts and saves them to the knowledge_base."""
    if not text_extracted_list:
        print("No texts found to embed.")
        return

    model = SentenceTransformer(model_name)
    embeddings = model.encode(text_extracted_list, batch_size=32, show_progress_bar=True)
    embeddings = np.array(embeddings, dtype='float32')
    faiss_index = create_faiss_index(embeddings)

    os.makedirs("knowledge_base", exist_ok=True)
    with open("knowledge_base/text_extracted_list.pkl", "wb") as f:
        pickle.dump((text_extracted_list, embeddings), f)
    with open("knowledge_base/documents.pkl", "wb") as f:
        pickle.dump(docs, f)

    return faiss_index

if __name__ == "__main__":
    create_embeddings(texts)
