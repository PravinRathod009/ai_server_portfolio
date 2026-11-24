import { getGeminiClient, GEMINI_MODEL } from "../config/gemini.js";
import { PORTFOLIO_BASE_PROMPT } from "../config/portfolioPrompt.js";

/**
 * Sanitizes conversation history sent by the frontend and converts it
 * to Gemini's { role, parts } format (capped to the last 10 messages).
 */
function buildConversationContents(history = [], latestMessage) {
  const safeHistory = Array.isArray(history) ? history.slice(-10) : [];

  const contents = safeHistory
    .filter(
      (item) =>
        item &&
        typeof item.text === "string" &&
        item.text.trim().length > 0 &&
        ["user", "bot", "assistant", "model"].includes(item.sender || item.role)
    )
    .map((item) => {
      const sender = item.sender || item.role;
      return {
        role: sender === "user" ? "user" : "model",
        parts: [{ text: item.text.trim().slice(0, 1000) }]
      };
    });

  contents.push({
    role: "user",
    parts: [{ text: latestMessage }]
  });

  return contents;
}

export async function generatePortfolioReply({ message, modeConfig, history = [] }) {
  const ai = getGeminiClient();

  const systemInstruction = `${PORTFOLIO_BASE_PROMPT}

${modeConfig.instruction}

REMINDER: Keep your reply concise (2-3 short sentences), warm, and human-like.`.trim();

  const contents = buildConversationContents(history, message);

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction,
      maxOutputTokens: 240
    }
  });

  const reply = response.text?.trim();

  if (!reply) {
    return "Hmm, I didn't catch that properly—could you rephrase your question about Pravin?";
  }

  return reply;
}
