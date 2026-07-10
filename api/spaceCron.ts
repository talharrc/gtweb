import { initializeApp, cert, getApps, App } from "firebase-admin/app";
import {
  getFirestore, Firestore, Timestamp, FieldValue,
} from "firebase-admin/firestore";

// ── GalaxaSpace weekly ritual — runs as a free Vercel Cron Job hitting
// POST /api/space/cron/daily-ritual (see vercel.json "crons" + api/index.ts).
// Uses firebase-admin (bypasses Firestore security rules) so space_settings
// can stay client-write-locked (see firestore.rules) without needing a paid
// Firebase Blaze plan / Cloud Functions.

type SpaceCategory = "tools" | "news" | "prompts" | "build" | "ask" | "tutorials" | "jobs" | "showcase";
type Weekday = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface DailyThemeEntry {
  title: string;
  description: string;
  emoji: string;
  category: SpaceCategory;
  promptBody: string;
}

const DAILY_THEMES: Record<Weekday, DailyThemeEntry> = {
  Monday: {
    title: "AI Tool of the Week",
    description: "Share and discover the AI tools the community is using right now.",
    emoji: "🔧",
    category: "tools",
    promptBody: "🔧 What AI tool have you been using this week? Drop it below with what it does and why you rate it.",
  },
  Tuesday: {
    title: "Ask Anything AI",
    description: "No question too basic — ask the community anything about AI.",
    emoji: "🙋",
    category: "ask",
    promptBody: "🙋 Got a question about AI, prompting, or building with LLMs? Ask it here — no question too basic.",
  },
  Wednesday: {
    title: "Prompt Sharing",
    description: "Trade the prompts that have been working for you.",
    emoji: "✨",
    category: "prompts",
    promptBody: "✨ Share a prompt that's been working great for you lately — paste it below and tell us what it's for.",
  },
  Thursday: {
    title: "Build in Public",
    description: "Show your work in progress, big or small.",
    emoji: "🛠️",
    category: "build",
    promptBody: "🛠️ What are you building this week? Share progress, screenshots, or a link — big or small.",
  },
  Friday: {
    title: "Demo Day",
    description: "Ship something this week? Show it off.",
    emoji: "🚀",
    category: "showcase",
    promptBody: "🚀 It's Demo Day! Show off something you shipped this week — a link, a video, or a screenshot.",
  },
  Saturday: {
    title: "AI News Discussion",
    description: "Discuss the AI news that mattered this week.",
    emoji: "📰",
    category: "news",
    promptBody: "📰 What AI news caught your eye this week? Drop a link and your take.",
  },
  Sunday: {
    title: "Weekly Best Posts",
    description: "A look back at the community's top posts from the past week.",
    emoji: "🏆",
    category: "news",
    promptBody: "🏆 Take a look back — what was your favorite post from the community this week?",
  },
};

interface PostDoc {
  id: string;
  authorId: string;
  category: string;
  title: string;
  body: string;
  links: string[];
  tags: string[];
  imageUrl: string;
  upvoteCount: number;
  commentCount: number;
  createdAt: Timestamp;
  isFeatured: boolean;
  isPinned: boolean;
  isSystemGenerated: boolean;
  status: string;
}

let adminApp: App | null = null;

// Free — no Blaze plan required. Reads a service account key downloaded once
// from Firebase Console → Project Settings → Service Accounts (Spark plan OK).
function getAdminDb(): Firestore | null {
  if (!process.env.FIREBASE_ADMIN_PROJECT_ID || !process.env.FIREBASE_ADMIN_CLIENT_EMAIL || !process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return null;
  }
  if (!adminApp) {
    adminApp = getApps().length > 0 ? getApps()[0]! : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
  }
  return getFirestore(adminApp);
}

// new Date() inside a serverless function is UTC — the weekday must be
// derived explicitly from Asia/Dhaka local time (mirrors the technique
// already used client-side in src/App.tsx's Dhaka clock).
function getDhakaWeekday(now: Date): Weekday {
  const formatter = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Dhaka", weekday: "long" });
  return formatter.format(now) as Weekday;
}

async function ensureSystemUser(db: Firestore): Promise<void> {
  const ref = db.collection("space_users").doc("system");
  await ref.set(
    {
      uid: "system",
      username: "system",
      displayName: "GalaxaSpace",
      avatarUrl: "",
      bio: "Automated weekly rituals and community prompts.",
      reputation: 0,
    },
    { merge: true },
  );
  const snap = await ref.get();
  if (!snap.data()?.joinedAt) {
    await ref.set({ joinedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
}

function computeTrendingScore(post: PostDoc, now: Date): number {
  const createdMs = post.createdAt?.toDate?.().getTime() ?? now.getTime();
  const hoursSincePost = Math.max(1, (now.getTime() - createdMs) / (1000 * 60 * 60));
  return (post.upvoteCount + post.commentCount) / Math.sqrt(hoursSincePost);
}

async function createWeeklyBestPost(db: Firestore, siteOrigin: string): Promise<void> {
  const sevenDaysAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const snap = await db
    .collection("space_posts")
    .where("status", "==", "active")
    .where("createdAt", ">=", sevenDaysAgo)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const now = new Date();
  const posts = snap.docs.map((d) => d.data() as PostDoc);
  const top5 = [...posts].sort((a, b) => computeTrendingScore(b, now) - computeTrendingScore(a, now)).slice(0, 5);
  if (top5.length === 0) return;

  const links = top5.map((p) => `${siteOrigin}/space/post/${p.id}`);
  const bodyLines = top5.map((p, i) => `${i + 1}. ${p.title}`);
  const body = `This week's top posts from the community:\n\n${bodyLines.join("\n")}`;

  const ref = db.collection("space_posts").doc();
  await ref.set({
    id: ref.id,
    authorId: "system",
    category: "news",
    title: "This Week's Best Posts",
    body,
    links,
    tags: ["weekly-best"],
    imageUrl: "",
    upvoteCount: 0,
    commentCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    isFeatured: false,
    isPinned: false,
    isSystemGenerated: true,
    status: "active",
  });
}

export async function runDailyRitual(): Promise<{ ok: boolean; reason?: string; weekday?: string }> {
  const db = getAdminDb();
  if (!db) return { ok: false, reason: "firebase-admin credentials not configured" };

  const now = new Date();
  const weekday = getDhakaWeekday(now);
  const theme = DAILY_THEMES[weekday];

  await ensureSystemUser(db);

  await db.collection("space_settings").doc("dailyTheme").set({
    day: weekday,
    title: theme.title,
    description: theme.description,
    emoji: theme.emoji,
    updatedAt: FieldValue.serverTimestamp(),
  });

  const pinnedRef = db.collection("space_posts").doc();
  await pinnedRef.set({
    id: pinnedRef.id,
    authorId: "system",
    category: theme.category,
    title: theme.title,
    body: theme.promptBody,
    links: [],
    tags: [],
    imageUrl: "",
    upvoteCount: 0,
    commentCount: 0,
    createdAt: FieldValue.serverTimestamp(),
    isFeatured: false,
    isPinned: true,
    isSystemGenerated: true,
    status: "active",
  });

  if (weekday === "Sunday") {
    const siteOrigin = process.env.SITE_ORIGIN ?? "https://galaxatech.com";
    await createWeeklyBestPost(db, siteOrigin);
  }

  return { ok: true, weekday };
}
