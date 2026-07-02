export type SpaceCategory =
  | 'tools' | 'news' | 'prompts' | 'build' | 'ask' | 'tutorials' | 'jobs' | 'showcase';

export type Weekday = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface DailyThemeEntry {
  title: string;
  description: string;
  emoji: string;
  category: SpaceCategory;
  promptBody: string;
}

export const DAILY_THEMES: Record<Weekday, DailyThemeEntry> = {
  Monday: {
    title: 'AI Tool of the Week',
    description: 'Share and discover the AI tools the community is using right now.',
    emoji: '🔧',
    category: 'tools',
    promptBody: '🔧 What AI tool have you been using this week? Drop it below with what it does and why you rate it.',
  },
  Tuesday: {
    title: 'Ask Anything AI',
    description: 'No question too basic — ask the community anything about AI.',
    emoji: '🙋',
    category: 'ask',
    promptBody: '🙋 Got a question about AI, prompting, or building with LLMs? Ask it here — no question too basic.',
  },
  Wednesday: {
    title: 'Prompt Sharing',
    description: 'Trade the prompts that have been working for you.',
    emoji: '✨',
    category: 'prompts',
    promptBody: "✨ Share a prompt that's been working great for you lately — paste it below and tell us what it's for.",
  },
  Thursday: {
    title: 'Build in Public',
    description: 'Show your work in progress, big or small.',
    emoji: '🛠️',
    category: 'build',
    promptBody: '🛠️ What are you building this week? Share progress, screenshots, or a link — big or small.',
  },
  Friday: {
    title: 'Demo Day',
    description: 'Ship something this week? Show it off.',
    emoji: '🚀',
    category: 'showcase',
    promptBody: "🚀 It's Demo Day! Show off something you shipped this week — a link, a video, or a screenshot.",
  },
  Saturday: {
    title: 'AI News Discussion',
    description: 'Discuss the AI news that mattered this week.',
    emoji: '📰',
    category: 'news',
    promptBody: '📰 What AI news caught your eye this week? Drop a link and your take.',
  },
  Sunday: {
    title: 'Weekly Best Posts',
    description: "A look back at the community's top posts from the past week.",
    emoji: '🏆',
    category: 'news',
    promptBody: '🏆 Take a look back — what was your favorite post from the community this week?',
  },
};
