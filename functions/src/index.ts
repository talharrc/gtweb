import { onSchedule } from 'firebase-functions/v2/scheduler';
import { runDailyRitual } from './weeklyRitual';

// Cron: every day at 00:00 Asia/Dhaka. Writes the day's theme to
// space_settings/dailyTheme, creates a pinned prompt post, and — on Sundays —
// additionally creates the "Weekly Best Posts" summary post.
export const dailyRitual = onSchedule(
  { schedule: '0 0 * * *', timeZone: 'Asia/Dhaka' },
  async () => {
    await runDailyRitual();
  },
);
