# Emotion-Aware Chatbot using RAG

This project implements an **emotion-aware chatbot** powered by Retrieval-Augmented Generation (RAG). The chatbot detects user emotions and provides contextually relevant, emotionally intelligent responses.

## Features

- **Emotion Detection:** Analyzes user input to identify emotions (e.g., happy, sad, angry).
- **RAG-based Responses:** Uses a retrieval system to fetch relevant information and a generative model to craft responses.
- **Context Awareness:** Maintains conversation context for coherent interactions.

## Getting Started

1. **Clone the repository**
2. **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```
3. **Run the chatbot**
    ```bash
    python chatbot.py
    ```

## Technologies Used

- Python
- Hugging Face Transformers
- Sentence Transformers
- Emotion classification models

## Example

```
User: I feel really down today.
Bot: I'm sorry to hear that. If you'd like to talk about what's bothering you, I'm here to listen.
```

## License

MIT License
