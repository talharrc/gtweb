import { useEffect, useState, ReactNode } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit, Timestamp } from 'firebase/firestore';
import { FolderOpen, Users, Clock, Hammer, Loader2, Activity } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';

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
  const { isDemo, setIsDemo } = useAuth();
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [clientCount, setClientCount] = useState(0);
  const [builderCount, setBuilderCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemo) {
      const mockProjects = mockDb.getProjects();
      const mockUsers = mockDb.getUsers();
      setProjects(mockProjects);
      setPendingCount(mockUsers.filter(u => u.status === 'pending').length);
      setClientCount(mockUsers.filter(u => u.role === 'client' && u.status === 'approved').length);
      setBuilderCount(mockUsers.filter(u => u.role === 'builder' && u.status === 'approved').length);
      
      const activity: ActivityItem[] = [];
      mockProjects.forEach(p => {
        activity.push({
          id: `act-p-${p.id}`,
          type: 'Project updated',
          summary: `Project "${p.name}" status set to ${p.status}`,
          createdAt: p.createdAt as any,
        });
      });
      setRecentActivity(activity.slice(0, 10));
      setLoading(false);
      return;
    }

    const handleError = (error: any) => {
      console.warn("Firestore error in AdminDashboard, falling back to Demo Mode:", error);
      setIsDemo(true);
      setLoading(false);
    };

    const unsubs = [
      onSnapshot(collection(db, 'projects'), s => {
        setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
        setLoading(false);
      }, handleError),
      onSnapshot(
        query(collection(db, 'users'), where('status', '==', 'pending')),
        s => setPendingCount(s.size),
        handleError
      ),
      onSnapshot(
        query(collection(db, 'users'), where('role', '==', 'client'), where('status', '==', 'approved')),
        s => setClientCount(s.size),
        handleError
      ),
      onSnapshot(
        query(collection(db, 'users'), where('role', '==', 'builder'), where('status', '==', 'approved')),
        s => setBuilderCount(s.size),
        handleError
      ),
    ];

    const unsubUpdates = onSnapshot(
      query(collection(db, 'updates'), orderBy('date', 'desc'), limit(10)),
      s => {
        setRecentActivity(s.docs.map(d => ({
          id: d.id,
          type: 'Update posted',
          summary: d.data().summary ?? d.data().text ?? 'New project update',
          createdAt: d.data().date ?? null,
        })));
      },
      handleError
    );

    return () => {
      unsubs.forEach(u => {
        try { u(); } catch {}
      });
      try { unsubUpdates(); } catch {}
    };
  }, [isDemo]);

  const discoveryCount = projects.filter(p => p.status === 'Discovery').length;
  const inProgressCount = projects.filter(p => p.status === 'In Progress' || p.status === 'active').length;
  const reviewCount = projects.filter(p => p.status === 'Review').length;
  const completedCount = projects.filter(p => p.status === 'Completed' || p.status === 'completed').length;

  const stats: StatCard[] = [
    {
      label: 'Pending Approvals',
      value: pendingCount,
      sub: 'awaiting review',
      icon: <Clock className="w-5 h-5" />,
      accent: 'text-amber-400',
      badge: pendingCount,
    },
    {
      label: 'Total Projects',
      value: projects.length,
      sub: `${inProgressCount} in progress · ${completedCount} completed`,
      icon: <FolderOpen className="w-5 h-5" />,
      accent: 'text-primary',
    },
    {
      label: 'Approved Clients',
      value: clientCount,
      sub: 'with hub access',
      icon: <Users className="w-5 h-5" />,
      accent: 'text-cyan-400',
    },
    {
      label: 'Approved Builders',
      value: builderCount,
      sub: 'with hub access',
      icon: <Hammer className="w-5 h-5" />,
      accent: 'text-emerald-400',
    },
  ];

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-7">
        <h2 className="text-white font-bold text-2xl">Dashboard</h2>
        <p className="text-white/40 text-sm mt-1">Overview of GalaxaTech operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="glass-card rounded-2xl p-5 relative overflow-hidden">
            <div className="flex items-start justify-between mb-3">
              <span className={s.accent}>{s.icon}</span>
              {s.badge != null && s.badge > 0 ? (
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

      {/* Project phase breakdown */}
      {projects.length > 0 && (
        <div className="glass-card rounded-2xl p-5 mb-6">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" /> Project Phases
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Discovery', count: discoveryCount, color: 'text-purple-400 bg-purple-500/10' },
              { label: 'In Progress', count: inProgressCount, color: 'text-emerald-400 bg-emerald-500/10' },
              { label: 'Review', count: reviewCount, color: 'text-amber-400 bg-amber-500/10' },
              { label: 'Completed', count: completedCount, color: 'text-primary bg-primary/10' },
            ].map(({ label, count, color }) => (
              <div key={label} className={`rounded-xl px-4 py-3 ${color}`}>
                <p className="font-mono font-bold text-xl">{count}</p>
                <p className="text-xs opacity-80">{label}</p>
              </div>
            ))}
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
