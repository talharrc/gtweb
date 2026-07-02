import { useSpaceDailyTheme } from '../../hooks/useSpaceDailyTheme';

export default function DailyThemeBanner() {
  const { theme } = useSpaceDailyTheme();

  if (!theme) return null;

  return (
    <div className="space-card p-5 mb-6 flex items-center gap-4">
      <span className="text-3xl flex-shrink-0">{theme.emoji}</span>
      <div>
        <p className="text-space-text-muted text-[11px] font-mono uppercase tracking-widest mb-0.5">
          Today's Ritual · {theme.day}
        </p>
        <h2 className="text-white font-bold text-lg leading-tight">{theme.title}</h2>
        <p className="text-space-text-secondary text-sm mt-1">{theme.description}</p>
      </div>
    </div>
  );
}
