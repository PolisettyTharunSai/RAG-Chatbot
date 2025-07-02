import faiss

def create_faiss_index(embeddings):
    """Creates a FAISS index for the provided embeddings."""
    dimension = embeddings.shape[1]
    faiss_index = faiss.IndexFlatL2(dimension)
    faiss_index.add(embeddings)
    faiss.write_index(faiss_index, "knowledge_base/vector.index")
    return faiss_index

def load_faiss_index(index_path):
    """Loads a FAISS index from the specified path."""
    return faiss.read_index(index_path)

def search_faiss_index(index, query_embedding, k=5):
    """Searches the FAISS index and return the k nearest neighbors."""
    distances, indices = index.search(query_embedding.reshape(1, -1), k)
    return indices[0]