import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PYTHON_API_URL = process.env.PYTHON_API_URL; // FastAPI endpoint

// Route to handle query from React
app.post("/ask", async (req, res) => {
  try {
    const { query, history } = req.body;

    const response = await axios.post(PYTHON_API_URL, {
      query,
      history,
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error calling Python backend:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Node server running on port ${PORT}`));
