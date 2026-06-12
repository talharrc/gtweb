import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return ai;
}

// In-memory feed cache by date string (YYYY-MM-DD)
let cachedFeed: { date: string; items: any[] } | null = null;

function getStaticFallbackItems(todayStr: string) {
  return [
    {
      id: "feed-fallback-1",
      category: "AI News Flash",
      title: "Google Releases AI Tool to Convert Sketches into Gorgeous Artwork",
      summary: "A new standard that instantly transforms basic hand-drawn doodles into polished visual assets.",
      readTime: "45s read",
      content: `Google has released a new generative drawing canvas. Users can draw basic geometric layout drapes on screen, and the AI converts it into highly detailed digital art or custom cartoon assets for presentation slides on ${todayStr}. No technical coding training is required—simply draw and watch ideas materialize natively.`,
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
    },
    {
      id: "feed-fallback-2",
      category: "AI Prompt Tip",
      title: "Teach Your AI Assistant to Write in Your Exact Voice",
      summary: "A simple prompting trick to make emails sound organic and prevent robotic phrases.",
      readTime: "50s read",
      content: "Stop receiving responses starting with 'I hope this email finds you well.' Paste 3 real emails you've typed yourself and tell the AI: 'Analyze the sentence length, greeting structure, and tone of these samples. Memorize this style, and draft all future emails using these exact vocabulary coordinates.' This instantly reduces manual adjustment times by 80%.",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
    },
    {
      id: "feed-fallback-3",
      category: "LLM Comparison",
      title: "Audio Summarizers vs Long Audio Listening test",
      summary: "Testing shows how AI extracts clear action items from long voice recordings in seconds.",
      readTime: "60s read",
      content: "Why sit through a boring 1-hour recording? Our team ran automatic test transfers on voice notes. By feeding standard transcript logs into Gemini 3.5 models, the AI isolated the 3 most crucial takeaways, noted who said what, and compiled action plans in under 3 seconds with absolute clarity, saving hours of manual review.",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
    }
  ];
}

let localOfflineQueue: { email: string; timestamp: string }[] = [];
let apiCooldownUntil = 0;

// API Route: Today's Dynamic Live AI Briefing Feed
app.get("/api/feed", async (req, res) => {
  const todayStr = new Date().toISOString().split("T")[0];

  if (Date.now() < apiCooldownUntil) {
    return res.json({ source: "fallback_cooldown", items: getStaticFallbackItems(todayStr) });
  }

  if (cachedFeed && cachedFeed.date === todayStr) {
    return res.json({ source: "cache", items: cachedFeed.items });
  }

  const client = getGeminiClient();
  if (!client) {
    return res.json({ source: "fallback_no_key", items: getStaticFallbackItems(todayStr) });
  }

  const modelsToTry = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];
  let lastErrorMsg = "";

  for (const modelName of modelsToTry) {
    let retriesLeft = 2;
    while (retriesLeft >= 0) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: `Generate exactly 3 fascinating daily briefings, news, or pro prompt hacks for standard, general human audiences who want to use AI to save time or build creative projects.
The topics must relate to everyday automation, life hacks, custom voice assistants, cool design utilities, or productive prompting tricks.
Today's date is: ${todayStr}. Use today's current date as context to describe realistic releases or simple time-saving techniques.

Avoid boring developer jargon or complex architecture/token specs. Write in simple, enthusiastic, friendly language. Keep summaries around 15 words and full content around 60-80 words.`,
          config: {
            systemInstruction: "You are GalaxaTech's automated agent. You draft friendly, high-interest daily briefs containing actionable prompt tips, everyday automation guides, and interesting AI news suitable for standard audiences.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  readTime: { type: Type.STRING },
                  content: { type: Type.STRING }
                },
                required: ["id", "category", "title", "summary", "readTime", "content"]
              }
            }
          }
        });

        const rawText = response.text;
        if (rawText) {
          const items = JSON.parse(rawText.trim());
          const themedItems = items.map((item: any) => {
            let badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
            if (item.category === "AI Prompt Tip") badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
            else if (item.category === "LLM Comparison") badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            return { ...item, badgeColor };
          });
          cachedFeed = { date: todayStr, items: themedItems };
          return res.json({ source: "gemini_api", items: themedItems });
        }

        throw new Error("Empty text returned from Gemini API");
      } catch (err: any) {
        lastErrorMsg = err?.message || String(err);
        const lowerMsg = lastErrorMsg.toLowerCase();

        if (lowerMsg.includes("429") || lowerMsg.includes("quota") || lowerMsg.includes("resource_exhausted") || lowerMsg.includes("limit exceeded")) {
          apiCooldownUntil = Date.now() + 15 * 60 * 1000;
          const backupFeed = getStaticFallbackItems(todayStr);
          cachedFeed = { date: todayStr, items: backupFeed };
          return res.json({ source: "fallback_quota_limit", items: backupFeed });
        }

        retriesLeft--;
        if (retriesLeft >= 0) {
          const waitTime = (2 - retriesLeft) * 800;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
  }

  const fallbackFeed = getStaticFallbackItems(todayStr);
  cachedFeed = { date: todayStr, items: fallbackFeed };
  return res.json({ source: "fallback_on_error", items: fallbackFeed });
});

// API Route: Newsletter Subscribe
app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email address" });

  const timestamp = new Date().toISOString();
  const isDuplicate = localOfflineQueue.some(item => item.email === email);
  if (!isDuplicate) {
    localOfflineQueue.push({ email, timestamp });
  }

  return res.json({ success: true, count: localOfflineQueue.length });
});

// API Route: Newsletter Count
app.get("/api/newsletter/count", (req, res) => {
  return res.json({ count: localOfflineQueue.length });
});

export default app;
