import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";

dotenv.config();

// ── Firebase Admin SDK ─────────────────────────────────────────────────────────
let adminDbInstance: ReturnType<typeof getFirestore> | null = null;
let adminAuthInstance: ReturnType<typeof getAdminAuth> | null = null;

function initAdmin() {
  if (adminDbInstance) return;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("Firebase Admin env vars missing — auth endpoints will be unavailable.");
    return;
  }

  if (!getApps().length) {
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  adminDbInstance = getFirestore();
  adminAuthInstance = getAdminAuth();
}

// ── JWT ────────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET ?? "gt-dev-secret-change-in-prod";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.VITE_ADMIN_EMAIL ?? "mail.galaxatech@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

function setCookie(res: express.Response, token: string) {
  res.cookie("gt_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const raw = req.cookies?.gt_session;
  if (!raw) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(raw, JWT_SECRET) as { role: string };
    if (payload.role !== "admin") return res.status(403).json({ error: "Admin only" });
    (req as any).jwtPayload = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
}

// ── Express app ────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cookieParser());

// ── Admin Auth ────────────────────────────────────────────────────────────────
// POST /api/auth/admin — env-password admin login
app.post("/api/auth/admin", async (req, res) => {
  const { password } = req.body ?? {};
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({ error: "ADMIN_PASSWORD env var not set on server." });
  }
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password." });
  }

  const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "7d" });
  setCookie(res, token);

  // Issue Firebase custom token so admin can use Firebase client SDK for Firestore
  initAdmin();
  let firebaseToken: string | null = null;
  try {
    if (adminAuthInstance) {
      firebaseToken = await adminAuthInstance.createCustomToken("admin-uid", {
        role: "admin",
        email: ADMIN_EMAIL,
      });
    }
  } catch (e) {
    console.error("Firebase custom token error:", e);
  }

  res.json({ ok: true, firebaseToken });
});

// ── Invite Auth ────────────────────────────────────────────────────────────────
// GET /api/auth/invite/:token — check if token exists, return {email, role, passwordSet}
app.get("/api/auth/invite/:token", async (req, res) => {
  initAdmin();
  if (!adminDbInstance) return res.status(503).json({ error: "Server auth not configured." });

  const { token } = req.params;
  try {
    const snap = await adminDbInstance
      .collection("credentials")
      .where("inviteToken", "==", token)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ error: "Invite link not found or expired." });

    const data = snap.docs[0].data();
    res.json({
      email: data.email,
      role: data.role,
      passwordSet: data.passwordSet === true,
    });
  } catch (e: any) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/auth/invite — set password (first visit) or login (returning)
app.post("/api/auth/invite", async (req, res) => {
  initAdmin();
  if (!adminDbInstance) return res.status(503).json({ error: "Server auth not configured." });

  const { token, password } = req.body ?? {};
  if (!token || !password) return res.status(400).json({ error: "Missing token or password." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    const snap = await adminDbInstance
      .collection("credentials")
      .where("inviteToken", "==", token)
      .limit(1)
      .get();

    if (snap.empty) return res.status(404).json({ error: "Invite link not found or expired." });

    const docRef = snap.docs[0].ref;
    const data = snap.docs[0].data();

    if (data.passwordSet) {
      // Returning user — verify
      const match = await bcrypt.compare(password, data.passwordHash);
      if (!match) return res.status(401).json({ error: "Incorrect password." });
    } else {
      // First visit — hash and store
      const hash = await bcrypt.hash(password, 12);
      await docRef.update({ passwordHash: hash, passwordSet: true });
    }

    const payload = { role: data.role, email: data.email, projectId: data.projectId ?? null };
    const jwtToken = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    setCookie(res, jwtToken);

    // Firebase custom token with role claims for Firestore rules
    let firebaseToken: string | null = null;
    try {
      if (adminAuthInstance) {
        const uid = `hub_${data.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        firebaseToken = await adminAuthInstance.createCustomToken(uid, {
          role: data.role,
          email: data.email,
          projectId: data.projectId ?? null,
        });
      }
    } catch (e) {
      console.error("Firebase custom token error:", e);
    }

    res.json({ ok: true, firebaseToken, role: data.role, email: data.email, projectId: data.projectId ?? null });
  } catch (e: any) {
    res.status(500).json({ error: "Server error." });
  }
});

// GET /api/auth/me — validate JWT cookie, optionally refresh Firebase custom token
app.get("/api/auth/me", async (req, res) => {
  const raw = req.cookies?.gt_session;
  if (!raw) return res.status(401).json({ error: "Not authenticated" });

  try {
    const payload = jwt.verify(raw, JWT_SECRET) as { role: string; email: string; projectId: string | null };

    // Optionally refresh Firebase custom token so client always has a fresh one
    initAdmin();
    let firebaseToken: string | null = null;
    try {
      if (adminAuthInstance) {
        const uid = payload.role === "admin" ? "admin-uid" : `hub_${payload.email.replace(/[^a-zA-Z0-9]/g, "_")}`;
        const claims: Record<string, any> = { role: payload.role, email: payload.email };
        if (payload.projectId) claims.projectId = payload.projectId;
        firebaseToken = await adminAuthInstance.createCustomToken(uid, claims);
      }
    } catch {
      // non-fatal — Firestore may already have a valid session
    }

    res.json({ role: payload.role, email: payload.email, projectId: payload.projectId ?? null, firebaseToken });
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

// POST /api/auth/logout
app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("gt_session", { path: "/" });
  res.json({ ok: true });
});

// ── Admin: Generate Invites ────────────────────────────────────────────────────
// POST /api/admin/generate-invites — called by admin panel after project creation
app.post("/api/admin/generate-invites", requireAdmin, async (req, res) => {
  initAdmin();
  if (!adminDbInstance) return res.status(503).json({ error: "Server auth not configured." });

  const { projectId, projectName, clientEmail, builderEmails } = req.body ?? {};

  const results: { email: string; role: string; inviteUrl: string }[] = [];

  const generateInvite = async (email: string, role: "client" | "builder") => {
    const inviteToken = crypto.randomUUID();
    await adminDbInstance!.collection("credentials").doc(email.toLowerCase()).set(
      {
        email: email.toLowerCase(),
        inviteToken,
        role,
        projectId: projectId ?? null,
        projectName: projectName ?? null,
        passwordHash: null,
        passwordSet: false,
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
    return inviteToken;
  };

  try {
    if (clientEmail?.trim()) {
      const tok = await generateInvite(clientEmail.trim(), "client");
      results.push({ email: clientEmail.trim(), role: "client", inviteUrl: `/hub/invite/${tok}` });
    }

    for (const email of (builderEmails ?? [])) {
      if (!email?.trim()) continue;
      const tok = await generateInvite(email.trim(), "builder");
      results.push({ email: email.trim(), role: "builder", inviteUrl: `/hub/invite/${tok}` });
    }

    res.json({ ok: true, invites: results });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Server error." });
  }
});

// ── Gemini Feed (unchanged) ────────────────────────────────────────────────────
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "aistudio-build" } },
    });
  }
  return ai;
}

let cachedFeed: { date: string; items: any[] } | null = null;
let apiCooldownUntil = 0;

function getStaticFallbackItems(todayStr: string) {
  return [
    {
      id: "feed-fallback-1",
      category: "AI News Flash",
      title: "Google Releases AI Tool to Convert Sketches into Gorgeous Artwork",
      summary: "A new standard that instantly transforms basic hand-drawn doodles into polished visual assets.",
      readTime: "45s read",
      content: `Google has released a new generative drawing canvas. Users can draw basic geometric layout drapes on screen, and the AI converts it into highly detailed digital art or custom cartoon assets for presentation slides on ${todayStr}. No technical coding training is required—simply draw and watch ideas materialize natively.`,
      badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    },
    {
      id: "feed-fallback-2",
      category: "AI Prompt Tip",
      title: "Teach Your AI Assistant to Write in Your Exact Voice",
      summary: "A simple prompting trick to make emails sound organic and prevent robotic phrases.",
      readTime: "50s read",
      content:
        "Stop receiving responses starting with 'I hope this email finds you well.' Paste 3 real emails you've typed yourself and tell the AI: 'Analyze the sentence length, greeting structure, and tone of these samples. Memorize this style, and draft all future emails using these exact vocabulary coordinates.' This instantly reduces manual adjustment times by 80%.",
      badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      id: "feed-fallback-3",
      category: "LLM Comparison",
      title: "Audio Summarizers vs Long Audio Listening test",
      summary: "Testing shows how AI extracts clear action items from long voice recordings in seconds.",
      readTime: "60s read",
      content:
        "Why sit through a boring 1-hour recording? Our team ran automatic test transfers on voice notes. By feeding standard transcript logs into Gemini 3.5 models, the AI isolated the 3 most crucial takeaways, noted who said what, and compiled action plans in under 3 seconds with absolute clarity, saving hours of manual review.",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];
}

let localOfflineQueue: { email: string; timestamp: string }[] = [];

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
            systemInstruction:
              "You are GalaxaTech's automated agent. You draft friendly, high-interest daily briefs containing actionable prompt tips, everyday automation guides, and interesting AI news suitable for standard audiences.",
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
                  content: { type: Type.STRING },
                },
                required: ["id", "category", "title", "summary", "readTime", "content"],
              },
            },
          },
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
        if (
          lowerMsg.includes("429") ||
          lowerMsg.includes("quota") ||
          lowerMsg.includes("resource_exhausted") ||
          lowerMsg.includes("limit exceeded")
        ) {
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

app.post("/api/newsletter/subscribe", async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email address" });
  const timestamp = new Date().toISOString();
  const isDuplicate = localOfflineQueue.some((item) => item.email === email);
  if (!isDuplicate) localOfflineQueue.push({ email, timestamp });
  return res.json({ success: true, count: localOfflineQueue.length });
});

app.get("/api/newsletter/count", (_req, res) => {
  return res.json({ count: localOfflineQueue.length });
});

export default app;
