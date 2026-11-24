# Pravin Portfolio AI Assistant Backend

Node.js + Express backend powered by Google Gemini (`@google/genai`), designed for Pravin Rathod's portfolio chatbot with 3 visitor modes:
- **Technical** (`technical`) — Architecture, MERN, Java/Spring Boot, Flutter BLE, and AI deep-dives
- **Recruiter** (`recruiter`) — Skills, education, internship, and full-stack role fit
- **Business Owner** (`business`) — Outcomes, apps, AI features, and collaboration value

## Folder Structure

```text
server/
├── src/
│   ├── config/
│   │   ├── assistantModes.js   # Technical, Recruiter & Business Owner personas + greetings
│   │   ├── gemini.js           # @google/genai client setup
│   │   └── portfolioPrompt.js  # Pravin's portfolio knowledge base & short human-style rules
│   ├── controllers/
│   │   └── chat.controller.js  # Handles /modes and /chat requests
│   ├── routes/
│   │   └── chat.routes.js      # Express routes
│   ├── services/
│   │   └── llm.service.js      # Builds history + system prompt and calls Gemini
│   └── server.js               # Express entry point (Local + Vercel ready)
├── .env                        # Add your GEMINI_API_KEY here
├── .env.example
├── .gitignore
├── package.json
└── vercel.json
```

## Quick Start

1. **Install dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Add your Gemini API key**
   Open `server/.env` and replace `your_gemini_api_key_here` with your key from [Google AI Studio](https://aistudio.google.com/apikey):
   ```env
   GEMINI_API_KEY=AIzaSy...
   GEMINI_MODEL=gemini-3.5-flash-lite
   PORT=5000
   ALLOWED_ORIGINS=*
   ```

3. **Run locally**
   ```bash
   npm run dev
   ```
   Server runs at `http://localhost:5000`.

## API Endpoints

### 1. Get Modes (Call when chat opens)
`GET /api/chat/modes`

Returns the welcome message asking who the visitor is, plus the 3 mode buttons (`technical`, `recruiter`, `business`), their greetings, and starter questions.

### 2. Send Message
`POST /api/chat`

```json
{
  "mode": "recruiter",
  "message": "What projects has Pravin built?",
  "history": [
    { "sender": "bot", "text": "Hi there! Happy to help..." }
  ]
}
```

If `mode` is omitted, the server automatically replies with `requiresModeSelection: true` and the 3 modes to pick from.

## Deploy to Vercel

1. Push the `server/` folder to GitHub (`.gitignore` keeps `.env` private).
2. Import the `server` directory in Vercel.
3. Add `GEMINI_API_KEY` and `ALLOWED_ORIGINS` (your frontend Vercel URL) under **Settings → Environment Variables**.
4. Deploy! Your API will be live at `https://your-server.vercel.app/api/chat`.
