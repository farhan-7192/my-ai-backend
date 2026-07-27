require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const { PrismaClient } = require("@prisma/client");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({});

const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

app.get("/api/health", (req, res) => {
  res.json({ status: "Success", message: "My backend is alive!" });
});

app.get("/api/history", async (req, res) => {
  try {
    const history = await prisma.interaction.findMany({
      orderBy: { createdAt: "desc" }, 
    });
    res.json(history);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

app.post("/api/analyze", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
      return res.status(400).json({ error: "Please provide a prompt." });
    }

    console.log("Asking AI:", userPrompt);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
    });

    const aiAnswer = response.text;

    const savedInteraction = await prisma.interaction.create({
      data: {
        prompt: userPrompt,
        answer: aiAnswer,
      },
    });

    console.log("✅ Saved to database with ID:", savedInteraction.id);

    res.json({ answer: aiAnswer, savedId: savedInteraction.id });
  } catch (error) {
    console.error("AI/DB Error:", error);
    res.status(500).json({ error: "Failed to process request." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
