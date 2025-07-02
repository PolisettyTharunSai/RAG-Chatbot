import google.generativeai as genai

def configure_genai(api_key, model_name):
    """Configures and returns the Generative AI model."""
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(model_name=model_name)

def generate_response(model, extracted_texts, user_query, chat_history):
    """Generates a response using the Generative AI model."""
    history_text = ""
    for idx, convo in enumerate(chat_history[-3:]):
        history_text += f"Previous Query {idx+1}: {convo['User Query']}\nPrevious Response {idx+1}: {convo['Response']}\n"
    prompt = f"""
            You are a helpful assistant answering questions based on provided context.

            Context:\n{extracted_texts}

            Chat History:\n{history_text}

            Current Question:\n{user_query}

            Instructions:
            - Only use the context to answer the question and be clear and concise.
            - If context doesn't help, ask the user to rephrase or provide more info.
            """
    response = model.generate_content(prompt)
    return response.parts[0].text if response.parts else "⚡ No response generated."



