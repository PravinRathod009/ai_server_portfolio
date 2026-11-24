import "dotenv/config";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import chatRoutes from "./routes/chat.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup
const rawOrigins = process.env.ALLOWED_ORIGINS || "*";
const allowedOrigins = rawOrigins
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  })
);

app.use(express.json({ limit: "1mb" }));

// Rate limiter to protect your Gemini API quota
const chatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 25, // max 25 requests per IP per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "You're chatting fast! Give me a few seconds and try again."
  }
});

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Pravin Portfolio AI Assistant API",
    endpoints: {
      modes: "GET /api/chat/modes",
      chat: "POST /api/chat"
    }
  });
});

app.use("/api/chat", chatLimiter, chatRoutes);

// Start local server (Vercel handles listening automatically in serverless mode)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Portfolio AI server running at http://localhost:${PORT}`);
  });
}

export default app;
