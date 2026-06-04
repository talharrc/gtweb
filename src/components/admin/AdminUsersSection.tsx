import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Loader2, Search } from 'lucide-react';
import { db } from '../../lib/firebase';
import { UserProfile, UserRole } from '../../types';
import { provisionUser } from '../../services/userService';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function AdminUsersSection() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleRoleChange = async (uid: string, role: UserRole) => {
    setSaving(uid);
    try { await provisionUser(uid, role); } finally { setSaving(null); }
  };

  const filtered = users.filter(u =>
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.displayName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-xl mb-1">Users</h2>
        <p className="text-white/40 text-sm">{users.length} registered • Assign roles to provision hub access</p>
      </div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="admin-input pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No users found" description="Users appear here after their first sign-in." />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.uid} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {u.photoURL ? (
                        <img src={u.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                          {u.displayName?.[0] ?? '?'}
                        </div>
                      )}
                      <span className="text-white font-medium text-xs truncate max-w-[120px]">
                        {u.displayName || 'Unnamed'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden sm:table-cell truncate max-w-[180px]">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.uid, e.target.value as UserRole)}
                      disabled={saving === u.uid}
                      className="admin-input text-xs py-1 w-28"
                    >
                      {(['visitor', 'client', 'builder', 'admin'] as UserRole[]).map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
