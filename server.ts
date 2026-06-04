import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

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

// Pre-defined high-fidelity static fallback items to ensure pristine UI aesthetics if all API attempts are rate-limited or unavailable
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

// Lightweight subscriber persistence
const SUBSCRIBERS_FILE = path.join(process.cwd(), "subscribers.json");

// Cooldown to protect user's Gemini API quota from free-tier rate limits
let apiCooldownUntil = 0;

// API Route: Today's Dynamic Live AI Briefing Feed
app.get("/api/feed", async (req, res) => {
  const todayStr = new Date().toISOString().split("T")[0];

  // If under rate-limit cooldown, serve static fallback immediately and silently
  if (Date.now() < apiCooldownUntil) {
    console.log(`[API] Serving fallback during rate-limit cooldown. Remaining: ${Math.round((apiCooldownUntil - Date.now()) / 1000)}s`);
    return res.json({ source: "fallback_cooldown", items: getStaticFallbackItems(todayStr) });
  }

  // Return cached feed if it exists for today
  if (cachedFeed && cachedFeed.date === todayStr) {
    console.log(`[API] Serving cached daily feed for ${todayStr}`);
    return res.json({ source: "cache", items: cachedFeed.items });
  }

  const client = getGeminiClient();
  if (!client) {
    console.warn("[API] Gemini API client not configured. Serving static fallback.");
    return res.json({ source: "fallback_no_key", items: getStaticFallbackItems(todayStr) });
  }

  // Ordered list of models to try for maximum availability during demand spikes
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
  let lastErrorMsg = "";

  for (const modelName of modelsToTry) {
    // Retry up to 2 times (total 3 attempts) for each model model
    let retriesLeft = 2;
    while (retriesLeft >= 0) {
      try {
        console.log(`[API] Trying Gemini Feed Generation with [${modelName}] (Retries left: ${retriesLeft})...`);
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
                  id: { type: Type.STRING, description: "A unique dynamic slug (e.g., feed-1)" },
                  category: { type: Type.STRING, description: "Must be exactly one of: 'AI News Flash', 'AI Prompt Tip', 'LLM Comparison'" },
                  title: { type: Type.STRING, description: "High-level display heading" },
                  summary: { type: Type.STRING, description: "A compact summary of what was released/tested" },
                  readTime: { type: Type.STRING, description: "Estimated read time (e.g., '45s read')" },
                  content: { type: Type.STRING, description: "The deep, detailed breakdown of the technical mechanism, real prompt details, or metrics" }
                },
                required: ["id", "category", "title", "summary", "readTime", "content"]
              }
            }
          }
        });

        const rawText = response.text;
        if (rawText) {
          const items = JSON.parse(rawText.trim());
          
          // Inject theme-consistent badge colors dynamically to preserve flawless aesthetics
          const themedItems = items.map((item: any) => {
            let badgeColor = "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
            if (item.category === "AI Prompt Tip") {
              badgeColor = "bg-purple-500/10 text-purple-400 border-purple-500/20";
            } else if (item.category === "LLM Comparison") {
              badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
            }
            return { ...item, badgeColor };
          });

          // Cache the successful result for today
          cachedFeed = { date: todayStr, items: themedItems };
          console.log(`[API] Successfully generated daily briefing feed with model [${modelName}]`);
          return res.json({ source: "gemini_api", items: themedItems });
        }
        
        throw new Error("Empty text returned from Gemini API response candidates");
      } catch (err: any) {
        lastErrorMsg = err?.message || String(err);
        const lowerMsg = lastErrorMsg.toLowerCase();

        // Handle rate limits / quota exceeded (429 / RESOURCE_EXHAUSTED) gracefully and immediately
        if (lowerMsg.includes("429") || lowerMsg.includes("quota") || lowerMsg.includes("resource_exhausted") || lowerMsg.includes("limit exceeded")) {
          // Set a 15-minute cooldown to prevent spamming the API and wasting quota
          apiCooldownUntil = Date.now() + 15 * 60 * 1000;
          
          console.log(`[API] Gemini API quota limit reached (429). Activating a 15-minute rate-limit cooldown to protect your API limits and avoid system spam.`);
          
          // Cache the backup fallback items as today's feed to ensure zero-lag instant rendering on subsequent visits
          const backupFeed = getStaticFallbackItems(todayStr);
          cachedFeed = { date: todayStr, items: backupFeed };
          
          return res.json({ source: "fallback_quota_limit", items: backupFeed });
        }

        console.warn(`[API] Generation attempt on model [${modelName}] failed. Error details: ${lastErrorMsg}`);
        
        retriesLeft--;
        if (retriesLeft >= 0) {
          // Wait with exponential scale (e.g., attempt 1 wait = 800ms, attempt 2 wait = 1600ms) to bypass transient resource exhaustion
          const waitTime = (2 - retriesLeft) * 800;
          console.log(`[API] Transient failure, retrying [${modelName}] in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        }
      }
    }
  }

  // Fallback state if everything is exhausted due to high demand
  console.log(`[API] All Gemini models and retries exhausted. Serving high-fidelity static fallback feed.`);
  const fallbackFeed = getStaticFallbackItems(todayStr);
  cachedFeed = { date: todayStr, items: fallbackFeed }; // Cache fallback so we don't attempt again immediately
  return res.json({ source: "fallback_on_error", items: fallbackFeed });
});

// Server-side cloud persistence & authorization cache
let gAccessToken: string | null = null;
let gSpreadsheetId: string | null = null;
let adminEmail: string | null = null;
let localOfflineQueue: { email: string; timestamp: string }[] = [];

// Helper function to find or create the Google sheet in the owner's Google Drive
async function initGoogleSheet(accessToken: string): Promise<string> {
  try {
    // 1. Search for existing sheet of this name
    const searchQuery = encodeURIComponent("name = 'GalaxaTech Newsletter Subscribers' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false");
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${searchQuery}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    
    if (searchRes.ok) {
      const searchData: any = await searchRes.json();
      if (searchData && searchData.files && searchData.files.length > 0) {
        const foundId = searchData.files[0].id;
        console.log(`[Cloud Sync] Found existing newsletter sheet: ${foundId}`);
        return foundId;
      }
    }

    // 2. If not found, create a brand-new Spreadsheet under the user's Drive files
    console.log("[Cloud Sync] Creating new spreadsheet: 'GalaxaTech Newsletter Subscribers'");
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "GalaxaTech Newsletter Subscribers",
        mimeType: "application/vnd.google-apps.spreadsheet"
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Failed to create Google Sheet: ${errText}`);
    }

    const fileData: any = await createRes.json();
    const newSheetId = fileData.id;
    console.log(`[Cloud Sync] Created new Google Sheet with ID: ${newSheetId}`);

    // 3. Immediately initialize columns/headers so the user sees a perfectly structured table
    const headerRange = "A1:C1";
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${newSheetId}/values/${headerRange}?valueInputOption=USER_ENTERED`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        values: [["Subscriber Email", "Captured At (UTC)", "Sync Node Tag"]]
      })
    });

    return newSheetId;
  } catch (error) {
    console.error("[Cloud Sync] initGoogleSheet error:", error);
    throw error;
  }
}

// Drain local queue of subscribers into the active Google Sheet
async function drainOfflineQueue(accessToken: string, spreadsheetId: string) {
  if (localOfflineQueue.length === 0) return;
  console.log(`[Cloud Sync] Draining ${localOfflineQueue.length} queued subscriber(s) into Google Sheets...`);
  
  try {
    const valuesToAppend = localOfflineQueue.map(item => [item.email, item.timestamp, "Cloud Sync Engine"]);
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A:C:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: valuesToAppend })
    });

    if (res.ok) {
      console.log(`[Cloud Sync] Successfully compiled & synced ${localOfflineQueue.length} subscribers!`);
      localOfflineQueue = [];
    } else {
      console.warn("[Cloud Sync] Failed to append queue rows. Keeping queue for retry.");
    }
  } catch (e) {
    console.error("[Cloud Sync] Queue sync write crash:", e);
  }
}

// API Route: Authorize Admin with Client-side Google OAuth token
app.post("/api/admin/authorize", async (req, res) => {
  const { accessToken } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: "No Access Token provided" });
  }

  try {
    // 1. Fetch user's profile to confirm identity and secure channel
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!userRes.ok) {
      return res.status(401).json({ error: "Invalid Google credentials or token expired." });
    }

    const userData: any = await userRes.json();
    adminEmail = userData.email;
    gAccessToken = accessToken;

    console.log(`[Admin] Successfully activated Google Session for administrator: ${adminEmail}`);

    // 2. Locate or initialize the subscribers spreadsheet in their drive
    gSpreadsheetId = await initGoogleSheet(accessToken);

    // 3. Auto-drain any queued submissions that were submitted while offline
    if (localOfflineQueue.length > 0) {
      await drainOfflineQueue(accessToken, gSpreadsheetId);
    }

    return res.json({
      success: true,
      adminEmail,
      spreadsheetId: gSpreadsheetId,
      spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${gSpreadsheetId}/edit`
    });

  } catch (e: any) {
    console.error("[Admin Authorization Error] ", e?.message || e);
    return res.status(500).json({ error: "Internal workspace pairing failure" });
  }
});

// API Route: Get Google Drive Sync status
app.get("/api/admin/status", (req, res) => {
  return res.json({
    connected: !!gAccessToken,
    adminEmail,
    spreadsheetId: gSpreadsheetId,
    spreadsheetUrl: gSpreadsheetId ? `https://docs.google.com/spreadsheets/d/${gSpreadsheetId}/edit` : null,
    queueSize: localOfflineQueue.length
  });
});

// API Route: Revoke Admin Sync connection
app.post("/api/admin/revoke", (req, res) => {
  gAccessToken = null;
  gSpreadsheetId = null;
  adminEmail = null;
  console.log("[Admin] Google Drive cloud synchronization has been disconnected.");
  return res.json({ success: true });
});

// API Route: Real Newsletter Subscription persistence directly in Google Sheets
app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const timestamp = new Date().toISOString();

  // If we have a connected Google session, write directly to Google Sheets!
  if (gAccessToken && gSpreadsheetId) {
    try {
      console.log(`[Cloud Sync] Live writing subscriber [${email}] directly to Google Sheet...`);
      const appendRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${gSpreadsheetId}/values/A:C:append?valueInputOption=USER_ENTERED`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${gAccessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          values: [[email, timestamp, "Live Cloud API Sync"]]
        })
      });

      if (appendRes.ok) {
        console.log(`[Cloud Sync] Live write successful for email: ${email}`);
        return res.json({ success: true, count: localOfflineQueue.length, cloudWritten: true });
      }

      // If token expired, fall back to queue gracefully & notify
      console.warn("[Cloud Sync] Live sheet write rejected (likely expired token). Grabbing queue...");
    } catch (err: any) {
      console.error("[Cloud Sync] Live sheets write failed, using offline fallback.", err.message);
    }
  }

  // Fallback / Offline Queue: Store subscriber in Server memory without writing file
  const isDuplicate = localOfflineQueue.some(item => item.email === email);
  if (!isDuplicate) {
    localOfflineQueue.push({ email, timestamp });
  }

  console.log(`[Cloud Sync] Cached email [${email}] in server offline queue (Current Queue: ${localOfflineQueue.length})`);
  return res.json({ 
    success: true, 
    count: localOfflineQueue.length, 
    cloudWritten: false, 
    queued: true,
    message: "Subscription captured! Connect your Google Account in the admin console to push directly to Drive." 
  });
});

// API Route: Get Subscription count
app.get("/api/newsletter/count", (req, res) => {
  return res.json({ count: localOfflineQueue.length });
});

// Configure Vite or Static Bundle serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("[Server] Launching Development server with Vite integration middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Server] Launching Production static handler serving from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Core running on http://localhost:${PORT}`);
  });
}

startServer();
