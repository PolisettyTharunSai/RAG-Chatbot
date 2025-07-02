from pymongo import MongoClient

def fetch_texts_from_mongo(uri, db_name, collection_name):
    client = MongoClient(uri)
    collection = client[db_name][collection_name]
    documents = list(collection.find({}, {"_id": 0, "url": 1, "title": 1, "content": 1}))
    print(f"DEBUG: Found {len(documents)} docs in {db_name}.{collection_name}")
    for doc in documents:
        print(doc)
    client.close()
    return [doc["content"] for doc in documents if "content" in doc and doc["content"].strip()], documents