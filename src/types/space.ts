import { Timestamp } from 'firebase/firestore';

// ── GalaxaSpace types ────────────────────────────────────────────────────────
// Self-contained subsystem — intentionally kept separate from src/types.ts
// (which defines the unrelated JWT-hub UserRole/UserProfile types).

export type SpaceCategory =
  | 'tools' | 'news' | 'prompts' | 'build' | 'ask' | 'tutorials' | 'jobs' | 'showcase';

export const SPACE_CATEGORIES: SpaceCategory[] = [
  'tools', 'news', 'prompts', 'build', 'ask', 'tutorials', 'jobs', 'showcase',
];

export type ReportReason = 'spam' | 'inappropriate' | 'off-topic' | 'other';
export type ReportTargetType = 'post' | 'comment';
export type ReportStatus = 'pending' | 'resolved' | 'dismissed';
export type SpacePostStatus = 'active' | 'removed';

export interface SpaceUser {
  uid: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  joinedAt: Timestamp;
  reputation: number;
}

export interface SpacePost {
  id: string;
  authorId: string;
  category: SpaceCategory;
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
  status: SpacePostStatus;
}

export interface SpaceComment {
  id: string;
  postId: string;
  authorId: string;
  body: string;
  createdAt: Timestamp;
  parentCommentId: string | null;
}

export interface SpaceLike {
  userId: string;
  postId: string;
  createdAt: Timestamp;
}

export interface SpaceBookmark {
  userId: string;
  postId: string;
  createdAt: Timestamp;
}

export interface SpaceReport {
  id: string;
  targetType: ReportTargetType;
  targetId: string;
  reporterId: string;
  reason: ReportReason;
  status: ReportStatus;
  createdAt: Timestamp;
}

export interface SpaceDailyTheme {
  day: string;
  title: string;
  description: string;
  emoji: string;
  updatedAt: Timestamp;
}
