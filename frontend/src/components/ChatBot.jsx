import React, { useState } from "react";
import axios from "axios";
import "./ChatBot.css"; 
// import dotenv from "dotenv";
// dotenv.config();

const ChatBot = () => {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    try {
        const res = await axios.post(`http://localhost:3000/ask`, {
        query,
        history,
      });

      const newEntry = { "User Query": query, "Response": res.data.response };

      setHistory((prev) => [...prev, newEntry]);
      setResponse(res.data.response);
      setQuery("");
    } catch (error) {
      setResponse("Error: Unable to get response from server.");
      console.error("Error fetching response:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="chat-container">
      <h2>💬 RAG ChatBot</h2>
      <div className="chat-history">
        {history.map((entry, idx) => (
          <div key={idx}>
            <p><strong>You:</strong> {entry["User Query"]}</p>
            <p><strong>Bot:</strong> {entry["Response"]}</p>
            <hr />
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Send</button>
      </form>
      {loading && (
        <div className="loading">
          <strong>Loading...</strong>
        </div>
      )}
      {response && !loading && (
        <div className="latest-response">
          <strong>Latest:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
