import { useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot, orderBy, query, limit, Timestamp } from 'firebase/firestore';
import { FolderOpen, Users, CreditCard, Inbox, GraduationCap, MessageSquare, Loader2, Activity } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject } from '../../types';

interface StatCard {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent: string;
  badge?: number;
}

interface ActivityItem {
  id: string;
  type: string;
  summary: string;
  createdAt: Timestamp | null;
}

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return '';
  const diff = Date.now() - ts.seconds * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [auditCount, setAuditCount] = useState(0);
  const [gbpCount, setGbpCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubs = [
      onSnapshot(collection(db, 'projects'), s => {
        setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
        setLoading(false);
      }),
      onSnapshot(collection(db, 'audit_submissions'), s => setAuditCount(s.size)),
      onSnapshot(collection(db, 'gbp_applications'), s => setGbpCount(s.size)),
      onSnapshot(collection(db, 'contact_submissions'), s => setContactCount(s.size)),
      onSnapshot(collection(db, 'users'), s => setUserCount(s.size)),
    ];

    // Aggregate recent activity from updates + documents
    const unsubUpdates = onSnapshot(
      query(collection(db, 'updates'), orderBy('date', 'desc'), limit(5)),
      s => {
        const items: ActivityItem[] = s.docs.map(d => ({
          id: d.id,
          type: 'Update posted',
          summary: d.data().summary ?? 'New project update',
          createdAt: d.data().date ?? null,
        }));
        setRecentActivity(prev => {
          const docItems = prev.filter(a => a.type !== 'Update posted');
          return [...items, ...docItems].sort((a, b) =>
            (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0)
          ).slice(0, 10);
        });
      }
    );

    return () => { unsubs.forEach(u => u()); unsubUpdates(); };
  }, []);

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const totalBuilderUids = new Set(projects.flatMap(p => p.builderUids ?? [])).size;
  const totalClientUids = new Set(projects.map(p => p.clientUid).filter(Boolean)).size;

  const stats: StatCard[] = [
    {
      label: 'Total Projects',
      value: projects.length,
      sub: `${activeProjects} active · ${completedProjects} completed`,
      icon: <FolderOpen className="w-5 h-5" />,
      accent: 'text-primary',
    },
    {
      label: 'Active Clients',
      value: totalClientUids,
      sub: `${totalBuilderUids} builders`,
      icon: <Users className="w-5 h-5" />,
      accent: 'text-cyan-400',
    },
    {
      label: 'Registered Users',
      value: userCount,
      sub: 'across all hubs',
      icon: <CreditCard className="w-5 h-5" />,
      accent: 'text-emerald-400',
    },
    {
      label: 'Audit Submissions',
      value: auditCount,
      sub: 'awaiting review',
      icon: <Inbox className="w-5 h-5" />,
      accent: 'text-amber-400',
      badge: auditCount,
    },
    {
      label: 'GBP Applications',
      value: gbpCount,
      sub: 'total received',
      icon: <GraduationCap className="w-5 h-5" />,
      accent: 'text-secondary',
    },
    {
      label: 'Contact Messages',
      value: contactCount,
      sub: 'from public site',
      icon: <MessageSquare className="w-5 h-5" />,
      accent: 'text-tertiary',
    },
  ];

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-white font-bold text-2xl">Dashboard</h2>
        <p className="text-white/40 text-sm mt-1">Overview of GalaxaTech operations</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <span className={s.accent}>{s.icon}</span>
              {s.badge && s.badge > 0 ? (
                <span className="text-[10px] font-bold bg-red-500 text-white rounded-full px-1.5 py-0.5 leading-none">
                  {s.badge}
                </span>
              ) : null}
            </div>
            <p className="text-white font-bold text-2xl font-mono mb-0.5">{s.value}</p>
            <p className="text-white/60 text-xs font-medium">{s.label}</p>
            {s.sub && <p className="text-white/30 text-[10px] mt-0.5">{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Project status breakdown */}
      {projects.length > 0 && (
        <div className="glass-card rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Project Status
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['active', 'paused', 'completed', 'archived'] as const).map(status => {
              const count = projects.filter(p => p.status === status).length;
              const colors: Record<string, string> = {
                active: 'text-emerald-400 bg-emerald-500/10',
                paused: 'text-amber-400 bg-amber-500/10',
                completed: 'text-primary bg-primary/10',
                archived: 'text-white/30 bg-white/5',
              };
              return (
                <div key={status} className={`rounded-xl px-4 py-3 ${colors[status]}`}>
                  <p className="font-mono font-bold text-xl">{count}</p>
                  <p className="text-xs capitalize opacity-80">{status}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="glass-card rounded-2xl p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-6">No activity yet. Create a project to get started.</p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5">
            {recentActivity.map(a => (
              <div key={a.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/80 text-sm">{a.summary}</p>
                  <p className="text-white/30 text-[10px] font-mono mt-0.5">{a.type}</p>
                </div>
                <span className="text-white/25 text-[10px] font-mono whitespace-nowrap">{timeAgo(a.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
