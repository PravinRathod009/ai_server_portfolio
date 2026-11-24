import {
  MODE_WELCOME_PROMPT,
  getPublicModes,
  resolveMode
} from "../config/assistantModes.js";
import { generatePortfolioReply } from "../services/llm.service.js";

/**
 * GET /api/chat/modes
 * Call this when the chat widget opens so the visitor picks Technical, Recruiter, or Business Owner first.
 */
export function getModes(req, res) {
  return res.status(200).json({
    success: true,
    welcomeMessage: MODE_WELCOME_PROMPT,
    modes: getPublicModes()
  });
}

/**
 * POST /api/chat
 * Body: { message: string, mode: "technical" | "recruiter" | "business", history?: Array<{ sender: "user"|"bot", text: string }> }
 */
export async function handleChat(req, res) {
  try {
    const { message, mode, history } = req.body || {};

    // Ask visitor to pick a mode first if not selected yet
    const modeConfig = resolveMode(mode);
    if (!modeConfig) {
      return res.status(200).json({
        success: true,
        requiresModeSelection: true,
        reply: MODE_WELCOME_PROMPT,
        modes: getPublicModes()
      });
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: "Please enter a message before sending."
      });
    }

    const cleanedMessage = message.trim();
    if (cleanedMessage.length > 1000) {
      return res.status(400).json({
        success: false,
        error: "Please keep your message under 1000 characters."
      });
    }

    const reply = await generatePortfolioReply({
      message: cleanedMessage,
      modeConfig,
      history
    });

    return res.status(200).json({
      success: true,
      mode: modeConfig.id,
      reply
    });
  } catch (error) {
    console.error("[ChatBot Error]:", error.message);

    const isConfigError = error.message?.includes("GEMINI_API_KEY");
    return res.status(isConfigError ? 503 : 500).json({
      success: false,
      error: isConfigError
        ? "Server API key is not configured yet. Add GEMINI_API_KEY in .env."
        : "I'm having a quick hiccup right now. Please try again in a moment or use the Say Hello button!"
    });
  }
}
