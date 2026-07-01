import express from "express";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs, addDoc, doc, setDoc, limit } from "firebase/firestore";

dotenv.config();
dotenv.config({ path: ".env.local" });

// ── Config ─────────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET ?? "gt-dev-secret-change-in-prod";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const CRED_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? process.env.VITE_ADMIN_EMAIL ?? "mail.galaxatech@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

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

// Test database connection on startup to avoid hangs if database is not found or blocked
if (db) {
  console.log("[Firebase] Testing connection to Firestore project:", firebaseConfig.projectId);
  const testConn = async () => {
    try {
      const q = query(collection(db, "credentials"), limit(1));
      const testPromise = getDocs(q);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2500));
      await Promise.race([testPromise, timeoutPromise]);
      console.log("[Firebase] Firestore connection test passed. Firestore is active.");
    } catch (err: any) {
      console.warn("[Firebase] Firestore not available or database not found. Falling back to local/cookie mock database. Reason:", err.message);
      db = null;
    }
  };
  testConn();
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

  console.log("[Auth] Admin login attempt. Entered password:", password, "Expected fallback:", ADMIN_PASSWORD);

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
          console.log("[Auth] Found credentials in Firestore. Hash:", existingHash);
        } else {
          console.log("[Auth] No credentials found in Firestore.");
        }
      } catch (err: any) {
        console.error("[Auth] Error reading credentials from Firestore:", err?.message);
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
    console.log("[Auth] existingHash used for verification:", existingHash);
    let match = false;
    try {
      match = await bcrypt.compare(password, existingHash);
      console.log("[Auth] Bcrypt comparison result:", match);
    } catch (err: any) {
      console.error("[Auth] Bcrypt error:", err?.message);
    }
    if (!match) {
      console.log("[Auth] Checking fallback logic. ADMIN_PASSWORD:", ADMIN_PASSWORD, "Matches entered password:", password === ADMIN_PASSWORD);
      // Fallback: if it matches ADMIN_PASSWORD environment variable / default fallback
      if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        match = true;
        console.log("[Auth] Fallback matched! Resetting credentials cookie...");
        // Synchronize/reset the credentials cookie with the fallback password
        const hash = await bcrypt.hash(password, 10);
        setCredCookie(res, ADMIN_EMAIL, hash);
        
        // Also attempt to update Firestore if db is active
        if (db) {
          try {
            await addDoc(collection(db, "credentials"), {
              username: ADMIN_EMAIL.toLowerCase().trim(),
              passwordHash: hash,
              role: "admin",
              createdAt: new Date(),
            });
          } catch (err) {
            console.error("Failed to sync admin credentials in Firestore:", err);
          }
        }
      } else {
        console.log("[Auth] Fallback rejected. Returning 401 Incorrect password.");
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

// ── Customer Auth (self-serve signup/login) ────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, phone, password } = req.body ?? {};
  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }
  if (password.length < 6) return res.status(400).json({ error: "Password must be at least 6 characters." });

  const username = String(email).toLowerCase().trim();

  try {
    if (db) {
      const q = query(collection(db, "credentials"), where("username", "==", username));
      const snap = await getDocs(q);
      if (!snap.empty) return res.status(409).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    if (db) {
      await addDoc(collection(db, "credentials"), {
        username,
        passwordHash,
        role: "customer",
        createdAt: new Date(),
      });
      await setDoc(doc(db, "customers", username), {
        username,
        email: username,
        displayName: name.trim(),
        phone: phone?.trim() ?? "",
        createdAt: new Date(),
      });
    } else {
      setCredCookie(res, username, passwordHash);
    }

    const token = jwt.sign({ role: "customer", email: username }, JWT_SECRET, { expiresIn: "7d" });
    setSessionCookie(res, token);
    res.json({ ok: true, role: "customer", email: username });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Server error creating account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email?.trim() || !password) return res.status(400).json({ error: "Email and password are required." });

  const username = String(email).toLowerCase().trim();

  try {
    let existingHash: string | null = null;
    let role = "customer";

    if (db) {
      const q = query(collection(db, "credentials"), where("username", "==", username));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0].data();
        existingHash = d.passwordHash ?? null;
        role = d.role ?? "customer";
      }
    }
    if (!existingHash) existingHash = getCredCookie(req, username);
    if (!existingHash) return res.status(401).json({ error: "Incorrect email or password." });

    const match = await bcrypt.compare(password, existingHash);
    if (!match) return res.status(401).json({ error: "Incorrect email or password." });

    const token = jwt.sign({ role, email: username }, JWT_SECRET, { expiresIn: "7d" });
    setSessionCookie(res, token);
    res.json({ ok: true, role, email: username });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "Server error during login." });
  }
});

// ── Invite Auth ────────────────────────────────────────────────────────────────
// Invite tokens are self-contained signed JWTs — no database writes needed.

app.get("/api/auth/invite/:token", (req, res) => {
  const { token } = req.params;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { email: string; role: string; projectId: string | null; type?: string };
    if (payload.type !== "invite") return res.status(400).json({ error: "Invalid invite token." });

    // Auto-authenticate: sign session and set cookie
    const sessionJwt = jwt.sign(
      { role: payload.role, email: payload.email, projectId: payload.projectId ?? null },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    setSessionCookie(res, sessionJwt);

    res.json({
      email: payload.email,
      role: payload.role,
      projectId: payload.projectId ?? null,
      autoLogin: true
    });
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

// ── TEMP: one-time store product seed (safe to re-run, idempotent by fixed doc id) ──
app.post("/api/dev/seed-products", async (_req, res) => {
  if (!db) return res.status(500).json({ error: "Firestore not initialized" });
  const PRODUCTS = [
    { id: "prod-netflix", name: "Netflix Premium", slug: "netflix-premium", category: "Streaming", isFeatured: true,
      shortDescription: "Watch on any screen — mobile, laptop, or TV — in Full HD or 4K.",
      longDescription: "Shared and personal Netflix plans across mobile, laptop/PC, and Smart TV / Android TV / Fire Stick devices.",
      plans: [
        { id: "plan-mobile-1m", label: "Mobile / Laptop Screen", durationLabel: "1 Month", durationDays: 30, priceBDT: 349 },
        { id: "plan-tv-1m", label: "TV Screen (Full HD)", durationLabel: "1 Month", durationDays: 30, priceBDT: 449 },
        { id: "plan-premium-1m", label: "Premium 4K (2 Screens)", durationLabel: "1 Month", durationDays: 30, priceBDT: 649 },
      ] },
    { id: "prod-netflix-prime", name: "Netflix + Prime Video Combo", slug: "netflix-prime-combo", category: "Streaming",
      shortDescription: "One plan, two of the biggest streaming libraries.",
      longDescription: "Bundle Netflix and Amazon Prime Video access into a single monthly plan at a discounted combo rate.",
      plans: [{ id: "plan-combo-1m", label: "Combo Plan", durationLabel: "1 Month", durationDays: 30, priceBDT: 489 }] },
    { id: "prod-prime", name: "Amazon Prime Video", slug: "prime-video", category: "Streaming",
      shortDescription: "Prime Originals, movies, and live sports.",
      longDescription: "Standard Amazon Prime Video access on mobile, laptop, and TV devices.",
      plans: [{ id: "plan-1m", label: "Standard", durationLabel: "1 Month", durationDays: 30, priceBDT: 249 }] },
    { id: "prod-spotify", name: "Spotify Premium", slug: "spotify-premium", category: "Music",
      shortDescription: "Ad-free music, offline downloads, unlimited skips.",
      longDescription: "Individual Spotify Premium access with no ads and offline listening.",
      plans: [
        { id: "plan-1m", label: "Individual", durationLabel: "1 Month", durationDays: 30, priceBDT: 149 },
        { id: "plan-3m", label: "Individual", durationLabel: "3 Months", durationDays: 90, priceBDT: 399 },
      ] },
    { id: "prod-chatgpt", name: "ChatGPT Plus", slug: "chatgpt-plus", category: "AI Tools", isFeatured: true,
      shortDescription: "GPT-5 access, image generation, web browsing, and file uploads.",
      longDescription: "Choose a shared login for a lower price, or a personal-email invite so the subscription lives on your own OpenAI account.",
      plans: [
        { id: "plan-shared-1m", label: "Shared Account", durationLabel: "1 Month", durationDays: 30, priceBDT: 500 },
        { id: "plan-personal-1m", label: "Personal Account (Your Email)", durationLabel: "1 Month", durationDays: 30, priceBDT: 2750 },
      ] },
    { id: "prod-canva", name: "Canva Pro", slug: "canva-pro", category: "Design",
      shortDescription: "Premium templates, background remover, and brand kits.",
      longDescription: "Full-year Canva Pro invite added directly to your existing Canva account.",
      plans: [{ id: "plan-1y", label: "Full Year Invite", durationLabel: "1 Year", durationDays: 365, priceBDT: 599 }] },
    { id: "prod-disney", name: "Disney+ Hotstar", slug: "disney-hotstar", category: "Streaming",
      shortDescription: "Disney, Marvel, Star Wars, and live cricket.",
      longDescription: "Standard Disney+ Hotstar access across mobile and TV.",
      plans: [{ id: "plan-1m", label: "Standard", durationLabel: "1 Month", durationDays: 30, priceBDT: 299 }] },
  ];
  const results: string[] = [];
  for (const p of PRODUCTS) {
    const { id, ...rest } = p;
    await setDoc(doc(db, "products", id), { ...rest, imageUrl: "", isActive: true, isFeatured: !!(p as any).isFeatured, createdAt: new Date() });
    results.push(id);
  }
  res.json({ ok: true, seeded: results });
});

export default app;
