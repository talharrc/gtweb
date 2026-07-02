import * as admin from 'firebase-admin';
import { DAILY_THEMES, Weekday } from './dailyThemeConfig';

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
  createdAt: admin.firestore.Timestamp;
  isFeatured: boolean;
  isPinned: boolean;
  isSystemGenerated: boolean;
  status: string;
}

function getDb() {
  if (admin.apps.length === 0) {
    admin.initializeApp();
  }
  return admin.firestore();
}

// new Date() inside a Cloud Function reflects UTC, not the configured trigger
// timezone — the weekday must be derived explicitly from Asia/Dhaka local time
// (mirrors the technique already used client-side in src/App.tsx's Dhaka clock).
function getDhakaWeekday(now: Date): Weekday {
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Dhaka', weekday: 'long' });
  return formatter.format(now) as Weekday;
}

async function ensureSystemUser(db: admin.firestore.Firestore): Promise<void> {
  await db.collection('space_users').doc('system').set(
    {
      uid: 'system',
      username: 'system',
      displayName: 'GalaxaSpace',
      avatarUrl: '',
      bio: 'Automated weekly rituals and community prompts.',
      reputation: 0,
    },
    { merge: true },
  );
  // joinedAt is only set once so repeated idempotent runs don't reset it.
  const snap = await db.collection('space_users').doc('system').get();
  if (!snap.data()?.joinedAt) {
    await db.collection('space_users').doc('system').set(
      { joinedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true },
    );
  }
}

function computeTrendingScore(post: PostDoc, now: Date): number {
  const createdMs = post.createdAt?.toDate?.().getTime() ?? now.getTime();
  const hoursSincePost = Math.max(1, (now.getTime() - createdMs) / (1000 * 60 * 60));
  return (post.upvoteCount + post.commentCount) / Math.sqrt(hoursSincePost);
}

async function createWeeklyBestPost(db: admin.firestore.Firestore, siteOrigin: string): Promise<void> {
  const sevenDaysAgo = admin.firestore.Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));

  const snap = await db
    .collection('space_posts')
    .where('status', '==', 'active')
    .where('createdAt', '>=', sevenDaysAgo)
    .orderBy('createdAt', 'desc')
    .limit(200)
    .get();

  const now = new Date();
  const posts = snap.docs.map((d) => d.data() as PostDoc);
  const top5 = [...posts].sort((a, b) => computeTrendingScore(b, now) - computeTrendingScore(a, now)).slice(0, 5);

  if (top5.length === 0) return;

  const links = top5.map((p) => `${siteOrigin}/space/post/${p.id}`);
  const bodyLines = top5.map((p, i) => `${i + 1}. ${p.title}`);
  const body = `This week's top posts from the community:\n\n${bodyLines.join('\n')}`;

  const ref = db.collection('space_posts').doc();
  await ref.set({
    id: ref.id,
    authorId: 'system',
    category: 'news',
    title: "This Week's Best Posts",
    body,
    links,
    tags: ['weekly-best'],
    imageUrl: '',
    upvoteCount: 0,
    commentCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isFeatured: false,
    isPinned: false,
    isSystemGenerated: true,
    status: 'active',
  });
}

export async function runDailyRitual(): Promise<void> {
  const db = getDb();
  const now = new Date();
  const weekday = getDhakaWeekday(now);
  const theme = DAILY_THEMES[weekday];

  await ensureSystemUser(db);

  await db.collection('space_settings').doc('dailyTheme').set({
    day: weekday,
    title: theme.title,
    description: theme.description,
    emoji: theme.emoji,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  const pinnedRef = db.collection('space_posts').doc();
  await pinnedRef.set({
    id: pinnedRef.id,
    authorId: 'system',
    category: theme.category,
    title: theme.title,
    body: theme.promptBody,
    links: [],
    tags: [],
    imageUrl: '',
    upvoteCount: 0,
    commentCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    isFeatured: false,
    isPinned: true,
    isSystemGenerated: true,
    status: 'active',
  });

  if (weekday === 'Sunday') {
    const siteOrigin = process.env.SITE_ORIGIN ?? 'https://galaxatech.com';
    await createWeeklyBestPost(db, siteOrigin);
  }
}
