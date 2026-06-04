interface ProgressBarProps {
  percent: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'secondary' | 'cyan' | 'emerald';
}

const colorMap = {
  primary: 'from-primary to-secondary',
  secondary: 'from-secondary to-primary',
  cyan: 'from-cyan-500 to-primary',
  emerald: 'from-emerald-500 to-cyan-500',
};

export default function ProgressBar({ percent, label, showValue = true, color = 'primary' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          {label && <span className="text-white/60">{label}</span>}
          {showValue && <span className="text-white font-semibold font-mono">{clamped}%</span>}
        </div>
      )}
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]} transition-all duration-700`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
