import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc } from "firebase/firestore";

dotenv.config();

// ── Config ─────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET ?? "gt-dev-secret-change-in-prod";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const CRED_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.VITE_ADMIN_EMAIL ?? "mail.galaxatech@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";

// Initialize Firebase for backend Firestore usage
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

let db: any = null;
try {
  if (firebaseConfig.projectId) {
    const firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
  }
} catch (e) {
  console.error("Firebase init failed in api/index.ts:", e);
}

// ── Express app ────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use(cookieParser());

function setSessionCookie(res: express.Response, token: string) {
  res.cookie("gt_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

function setCredCookie(res: express.Response, email: string, hash: string) {
  const key = Buffer.from(email.toLowerCase()).toString("base64url").replace(/=/g, "");
  res.cookie(`gt_cred_${key}`, hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CRED_MAX_AGE,
    path: "/",
  });
}

function getCredCookie(req: express.Request, email: string): string | null {
  const key = Buffer.from(email.toLowerCase()).toString("base64url").replace(/=/g, "");
  return req.cookies?.[`gt_cred_${key}`] ?? null;
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

// ── Admin Auth ────────────────────────────────────────────────────────────────
app.post("/api/auth/admin", async (req, res) => {
  const { password } = req.body ?? {};
  if (!password) return res.status(400).json({ error: "Password is required." });

  try {
    let existingHash: string | null = null;
    let docId: string | null = null;

    // 1. Try to read from Firestore credentials collection
    if (db) {
      try {
        const q = query(
          collection(db, "credentials"),
          where("username", "==", ADMIN_EMAIL.toLowerCase().trim())
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const d = snap.docs[0].data();
          existingHash = d.passwordHash ?? d.password ?? null;
          docId = snap.docs[0].id;
        }
      } catch (err) {
        console.error("Error reading credentials from Firestore:", err);
      }
    }

    // 2. Fallback to cookie credentials
    if (!existingHash) {
      existingHash = getCredCookie(req, ADMIN_EMAIL);
    }

    // 3. Dev Bootstrap: If no password hash exists yet, store this as the password!
    if (!existingHash) {
      const hash = await bcrypt.hash(password, 10);
      
      // Save to Firestore
      if (db) {
        try {
          await addDoc(collection(db, "credentials"), {
            username: ADMIN_EMAIL.toLowerCase().trim(),
            passwordHash: hash,
            role: "admin",
            createdAt: new Date(),
          });
          console.log("Admin credential bootstrapped in Firestore.");
        } catch (err) {
          console.error("Failed to save admin credential in Firestore:", err);
        }
      }

      // Save to Cookie
      setCredCookie(res, ADMIN_EMAIL, hash);
      existingHash = hash;
    }

    // 4. Verify password
    const match = await bcrypt.compare(password, existingHash);
    if (!match) {
      // Fallback: if it matches ADMIN_PASSWORD environment variable
      if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        // Correct
      } else {
        return res.status(401).json({ error: "Incorrect password." });
      }
    }

    const token = jwt.sign({ role: "admin", email: ADMIN_EMAIL }, JWT_SECRET, { expiresIn: "7d" });
    setSessionCookie(res, token);
    res.json({ ok: true });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Server authentication error." });
  }
});

// ── Invite Auth ────────────────────────────────────────────────────────────────
// Invite tokens are self-contained signed JWTs — no database writes needed.

app.get("/api/auth/invite/:token", (req, res) => {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: string; projectId: string | null; type?: string };
    if (payload.type !== "invite") return res.status(400).json({ error: "Invalid invite token." });
    const hash = getCredCookie(req, payload.email);
    res.json({ email: payload.email, role: payload.role, passwordSet: hash !== null });
  } catch {
    res.status(404).json({ error: "Invite link not found or expired." });
  }
});

app.post("/api/auth/invite", async (req, res) => {
  const { token, password } = req.body ?? {};
  if (!token || !password) return res.status(400).json({ error: "Missing token or password." });
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: string; projectId: string | null; type?: string };
    if (payload.type !== "invite") return res.status(400).json({ error: "Invalid invite token." });

    const existingHash = getCredCookie(req, payload.email);
    if (existingHash) {
      const match = await bcrypt.compare(password, existingHash);
      if (!match) return res.status(401).json({ error: "Incorrect password." });
    } else {
      const hash = await bcrypt.hash(password, 10);
      setCredCookie(res, payload.email, hash);
    }

    const sessionJwt = jwt.sign(
      { role: payload.role, email: payload.email, projectId: payload.projectId ?? null },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    setSessionCookie(res, sessionJwt);
    res.json({ ok: true, role: payload.role, email: payload.email, projectId: payload.projectId ?? null });
  } catch (e: any) {
    if (e?.name === "JsonWebTokenError" || e?.name === "TokenExpiredError") {
      return res.status(404).json({ error: "Invite link is invalid or expired." });
    }
    res.status(500).json({ error: e?.message ?? "Server error." });
  }
});

app.get("/api/auth/me", (req, res) => {
  const raw = req.cookies?.gt_session;
  if (!raw) return res.status(401).json({ error: "Not authenticated" });
  try {
    const payload = jwt.verify(raw, JWT_SECRET) as { role: string; email: string; projectId: string | null };
    res.json({ role: payload.role, email: payload.email, projectId: payload.projectId ?? null });
  } catch {
    res.status(401).json({ error: "Invalid session" });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("gt_session", { path: "/" });
  res.json({ ok: true });
});

// ── Admin: Generate Invites (stateless JWT tokens — no Firestore writes) ───────
app.post("/api/admin/generate-invites", requireAdmin, (req, res) => {
  const { projectId, projectName, clientEmail, builderEmails } = req.body ?? {};
  const results: { email: string; role: string; inviteUrl: string }[] = [];

  const generateInvite = (email: string, role: "client" | "builder") => {
    const inviteJwt = jwt.sign(
      { email: email.toLowerCase(), role, projectId: projectId ?? null, projectName: projectName ?? null, type: "invite" },
      JWT_SECRET,
      { expiresIn: "90d" }
    );
    return inviteJwt;
  };

  if (clientEmail?.trim()) {
    const tok = generateInvite(clientEmail.trim(), "client");
    results.push({ email: clientEmail.trim(), role: "client", inviteUrl: `/hub/invite/${tok}` });
  }
  for (const email of builderEmails ?? []) {
    if (!email?.trim()) continue;
    const tok = generateInvite(email.trim(), "builder");
    results.push({ email: email.trim(), role: "builder", inviteUrl: `/hub/invite/${tok}` });
  }
  res.json({ ok: true, invites: results });
});

// ── Gemini Feed (unchanged) ────────────────────────────────────────────────────
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai && process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY, httpOptions: { headers: { "User-Agent": "aistudio-build" } } });
  }
  return ai;
}

let cachedFeed: { date: string; items: any[] } | null = null;
let apiCooldownUntil = 0;

function getStaticFallbackItems(todayStr: string) {
  return [
    { id: "feed-fallback-1", category: "AI News Flash", title: "Google Releases AI Tool to Convert Sketches into Gorgeous Artwork", summary: "A new standard that instantly transforms basic hand-drawn doodles into polished visual assets.", readTime: "45s read", content: `Google has released a new generative drawing canvas on ${todayStr}. No technical coding training is required—simply draw and watch ideas materialize natively.`, badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
    { id: "feed-fallback-2", category: "AI Prompt Tip", title: "Teach Your AI Assistant to Write in Your Exact Voice", summary: "A simple prompting trick to make emails sound organic.", readTime: "50s read", content: "Stop receiving responses starting with 'I hope this email finds you well.' Paste 3 real emails you've typed yourself and tell the AI to mimic your style. This reduces manual adjustment times by 80%.", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
    { id: "feed-fallback-3", category: "LLM Comparison", title: "Audio Summarizers vs Long Audio Listening test", summary: "Testing shows how AI extracts clear action items from long voice recordings.", readTime: "60s read", content: "By feeding transcript logs into Gemini models, the AI isolated the 3 most crucial takeaways, noted who said what, and compiled action plans in under 3 seconds.", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ];
}

let localOfflineQueue: { email: string; timestamp: string }[] = [];

app.get("/api/feed", async (_req, res) => {
  const todayStr = new Date().toISOString().split("T")[0];
  if (Date.now() < apiCooldownUntil) return res.json({ source: "fallback_cooldown", items: getStaticFallbackItems(todayStr) });
  if (cachedFeed && cachedFeed.date === todayStr) return res.json({ source: "cache", items: cachedFeed.items });
  const client = getGeminiClient();
  if (!client) return res.json({ source: "fallback_no_key", items: getStaticFallbackItems(todayStr) });

  for (const modelName of ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]) {
    let retriesLeft = 2;
    while (retriesLeft >= 0) {
      try {
        const response = await client.models.generateContent({
          model: modelName,
          contents: `Generate exactly 3 fascinating daily briefings for AI-curious audiences. Today: ${todayStr}. Keep summaries ~15 words, content ~70 words. Everyday automation, life hacks, prompt tips.`,
          config: {
            systemInstruction: "You are GalaxaTech's automated agent drafting friendly daily AI briefs.",
            responseMimeType: "application/json",
            responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, category: { type: Type.STRING }, title: { type: Type.STRING }, summary: { type: Type.STRING }, readTime: { type: Type.STRING }, content: { type: Type.STRING } }, required: ["id", "category", "title", "summary", "readTime", "content"] } },
          },
        });
        if (response.text) {
          const items = JSON.parse(response.text.trim()).map((item: any) => ({ ...item, badgeColor: item.category === "AI Prompt Tip" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : item.category === "LLM Comparison" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" }));
          cachedFeed = { date: todayStr, items };
          return res.json({ source: "gemini_api", items });
        }
        throw new Error("Empty response");
      } catch (err: any) {
        const msg = (err?.message ?? "").toLowerCase();
        if (msg.includes("429") || msg.includes("quota") || msg.includes("resource_exhausted")) {
          apiCooldownUntil = Date.now() + 15 * 60 * 1000;
          const fallback = getStaticFallbackItems(todayStr);
          cachedFeed = { date: todayStr, items: fallback };
          return res.json({ source: "fallback_quota_limit", items: fallback });
        }
        if (--retriesLeft >= 0) await new Promise((r) => setTimeout(r, (2 - retriesLeft) * 800));
      }
    }
  }

  const fallback = getStaticFallbackItems(todayStr);
  cachedFeed = { date: todayStr, items: fallback };
  return res.json({ source: "fallback_on_error", items: fallback });
});

app.post("/api/newsletter/subscribe", (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes("@")) return res.status(400).json({ error: "Invalid email address" });
  if (!localOfflineQueue.some((i) => i.email === email)) localOfflineQueue.push({ email, timestamp: new Date().toISOString() });
  return res.json({ success: true, count: localOfflineQueue.length });
});

app.get("/api/newsletter/count", (_req, res) => res.json({ count: localOfflineQueue.length }));

export default app;
