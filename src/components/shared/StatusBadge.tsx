interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const colorMap: Record<string, string> = {
  active: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  paused: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  archived: 'bg-white/10 text-white/40 border-white/15',
  pending: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  submitted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  open: 'bg-primary/15 text-primary border-primary/30',
  'in-review': 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  admin: 'bg-primary/15 text-primary border-primary/30',
  client: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  builder: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  visitor: 'bg-white/10 text-white/50 border-white/15',
  pending_payment: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  verified: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
  fulfilled: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/15 text-red-400 border-red-500/30',
  cancelled: 'bg-white/10 text-white/40 border-white/15',
};

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const colors = colorMap[status] ?? 'bg-white/10 text-white/50 border-white/15';
  const sz = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';
  return (
    <span className={`${colors} ${sz} rounded-full border font-semibold uppercase tracking-wider`}>
      {status}
    </span>
  );
}
