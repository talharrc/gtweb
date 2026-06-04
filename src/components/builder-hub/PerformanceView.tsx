import { Activity, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { usePayments } from '../../hooks/usePayments';
import { calcBuilderEligibility } from '../../services/paymentService';

export default function PerformanceView() {
  const { projects } = useProjects();
  const { payments } = usePayments();

  const active = projects.filter(p => p.status === 'active').length;
  const completed = projects.filter(p => p.status === 'completed').length;
  const totalEarnings = payments.reduce((sum, p) => {
    const { builderEligible } = calcBuilderEligibility(p);
    return sum + builderEligible;
  }, 0);

  const stats = [
    { label: 'Active Projects', value: active, icon: <Activity className="w-5 h-5 text-primary" />, color: 'border-primary/20 bg-primary/5' },
    { label: 'Completed', value: completed, icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />, color: 'border-emerald-500/20 bg-emerald-500/5' },
    { label: 'Total Projects', value: projects.length, icon: <Clock className="w-5 h-5 text-cyan-400" />, color: 'border-cyan-500/20 bg-cyan-500/5' },
    { label: 'Total Unlocked', value: `৳${totalEarnings.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5 text-amber-400" />, color: 'border-amber-500/20 bg-amber-500/5' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Performance</h2>
        <p className="text-white/40 text-sm">Your activity at a glance</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`glass-card rounded-2xl p-5 border ${s.color}`}>
            <div className="mb-3">{s.icon}</div>
            <p className="text-white font-bold text-2xl font-mono">{s.value}</p>
            <p className="text-white/40 text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-2xl p-6 text-center">
        <p className="text-white/30 text-sm">Ratings & reviews coming soon</p>
        <p className="text-white/20 text-xs mt-1">Client feedback will appear here after project delivery</p>
      </div>
    </div>
  );
}
