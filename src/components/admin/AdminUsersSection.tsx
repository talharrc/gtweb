import { useState, useEffect } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { Loader2, Check, X, Users, Clock, Search } from 'lucide-react';
import { db } from '../../lib/firebase';
import { UserProfile } from '../../types';
import { approveUser, rejectUser } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import EmptyState from '../shared/EmptyState';

function timeAgo(ts: Timestamp | null | undefined): string {
  if (!ts) return '—';
  const diff = Date.now() - ts.seconds * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts.seconds * 1000).toLocaleDateString();
}

const ROLE_COLORS: Record<string, string> = {
  client: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  builder: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  visitor: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  admin: 'text-primary bg-primary/10 border-primary/20',
};

export default function AdminUsersSection() {
  const { isDemo, setIsDemo } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');
  const [search, setSearch] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    if (isDemo) {
      setUsers(mockDb.getUsers());
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile)));
      setLoading(false);
    }, (error) => {
      console.warn("Firestore error in AdminUsersSection, falling back to Demo Mode:", error);
      setIsDemo(true);
      setLoading(false);
    });
    return () => unsub();
  }, [isDemo]);

  const handleApprove = async (uid: string) => {
    setActing(uid);
    try {
      if (isDemo) {
        const mockUsers = mockDb.getUsers();
        const updated = mockUsers.map(u => u.uid === uid ? { ...u, status: 'approved' as const } : u);
        mockDb.saveUsers(updated);
        setUsers(updated);
      } else {
        await approveUser(uid);
      }
    } finally { setActing(null); }
  };

  const handleReject = async (uid: string, email: string) => {
    if (!window.confirm(`Reject and remove ${email}? Their Firestore account will be deleted.`)) return;
    setActing(uid);
    try {
      if (isDemo) {
        const mockUsers = mockDb.getUsers();
        const filtered = mockUsers.filter(u => u.uid !== uid);
        mockDb.saveUsers(filtered);
        setUsers(filtered);
      } else {
        await rejectUser(uid);
      }
    } finally { setActing(null); }
  };

  const pending = users.filter(u => u.status === 'pending');
  const approved = users.filter(u => u.status === 'approved');

  const filtered = (tab === 'pending' ? pending : approved).filter(u =>
    !search ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase()),
  );

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Users</h2>
        <p className="text-white/40 text-sm">{pending.length} pending · {approved.length} approved</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-5 bg-white/5 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'pending' ? 'bg-amber-500/20 text-amber-300' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Approvals
          {pending.length > 0 && (
            <span className="bg-amber-500 text-white rounded-full text-[10px] px-1.5 py-0.5 leading-none">{pending.length}</span>
          )}
        </button>
        <button
          onClick={() => setTab('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            tab === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'text-white/40 hover:text-white/70'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Approved Users
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="admin-input pl-9"
        />
      </div>

      {/* Pending Approvals */}
      {tab === 'pending' && (
        filtered.length === 0 ? (
          <EmptyState title="No pending approvals" description="New client and builder sign-ups will appear here." />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(u => (
              <div key={u.uid} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-sm font-bold flex-shrink-0">
                  {u.email?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold truncate">{u.email}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                      {u.role}
                    </span>
                    <span className="text-white/30 text-[10px] font-mono">{timeAgo(u.createdAt)}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleApprove(u.uid)}
                    disabled={acting === u.uid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    {acting === u.uid ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(u.uid, u.email ?? 'this user')}
                    disabled={acting === u.uid}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Approved Users */}
      {tab === 'approved' && (
        filtered.length === 0 ? (
          <EmptyState title="No approved users yet" description="Approve pending sign-ups to see them here." />
        ) : (
          <div className="glass-card rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3">User</th>
                  <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                  <th className="text-left px-4 py-3">Role</th>
                  <th className="text-left px-4 py-3 hidden md:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.uid} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                          {u.email?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="text-white font-medium text-xs truncate max-w-[120px]">
                          {u.displayName || u.email?.split('@')[0] || 'User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/50 text-xs hidden sm:table-cell truncate max-w-[180px]">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/30 text-xs font-mono hidden md:table-cell">{timeAgo(u.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
}
