import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';
import { Loader2, X, CheckCircle2, XCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

interface GBPApp {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  institution?: string;
  track?: string;
  why?: string;
  portfolioUrl?: string;
  submittedAt?: Timestamp;
  status?: 'new' | 'reviewed' | 'accepted' | 'declined';
  adminNote?: string;
}

function AppDetail({ app, onClose, onUpdate }: { app: GBPApp; onClose: () => void; onUpdate?: () => void }) {
  const { isDemo } = useAuth();
  const [note, setNote] = useState(app.adminNote ?? '');
  const [saving, setSaving] = useState(false);

  const updateStatus = async (status: GBPApp['status']) => {
    setSaving(true);
    try {
      if (isDemo) {
        const mockApps = mockDb.getGbpApps();
        const dbStatus = status === 'accepted' ? 'approved' : status === 'declined' ? 'declined' : 'pending';
        const updated = mockApps.map(a => a.id === app.id ? { ...a, status: dbStatus as any } : a);
        mockDb.saveGbpApps(updated);
        app.status = status;
        app.adminNote = note;
        if (onUpdate) onUpdate();
      } else {
        await updateDoc(doc(db, 'gbp_applications', app.id), { status, adminNote: note });
      }
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold">{app.name}</h3>
            <p className="text-white/40 text-xs">{app.track} · {app.institution}</p>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-white/50" /></button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {[
            { label: 'Email', val: app.email },
            { label: 'Phone', val: app.phone },
            { label: 'Track', val: app.track },
            { label: 'Institution', val: app.institution },
          ].map(f => (
            <div key={f.label} className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-1">{f.label}</p>
              <p className="text-white/80 text-sm">{f.val ?? '—'}</p>
            </div>
          ))}
        </div>

        {app.why && (
          <div className="bg-white/5 rounded-xl p-4 mb-4">
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-2">Why they want to join</p>
            <p className="text-white/70 text-sm leading-relaxed">{app.why}</p>
          </div>
        )}

        {app.portfolioUrl && (
          <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="block text-primary text-sm mb-4 hover:underline truncate">
            Portfolio: {app.portfolioUrl}
          </a>
        )}

        <div className="mb-4">
          <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-2">Admin Note (private)</p>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            placeholder="Internal notes for Rihad's reference…"
            className="admin-input w-full resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={() => updateStatus('reviewed')} disabled={saving}
            className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all disabled:opacity-60">
            Mark Reviewed
          </button>
          <button onClick={() => updateStatus('accepted')} disabled={saving}
            className="flex-1 py-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Accept
          </button>
          <button onClick={() => updateStatus('declined')} disabled={saving}
            className="flex-1 py-2 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-1.5">
            <XCircle className="w-4 h-4" /> Decline
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminGBPApplications() {
  const { isDemo, setIsDemo } = useAuth();
  const [apps, setApps] = useState<GBPApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<GBPApp | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  const loadApps = () => {
    if (isDemo) {
      const mapped = mockDb.getGbpApps().map(a => ({
        id: a.id,
        name: a.fullName,
        email: a.email,
        phone: '+8801700000000',
        institution: 'University of Dhaka',
        track: a.skills.join(', '),
        why: 'I want to build premium galactic web experiences.',
        portfolioUrl: a.portfolioUrl,
        submittedAt: a.submittedAt as any,
        status: a.status === 'approved' ? 'accepted' : a.status === 'declined' ? 'declined' : 'new',
        adminNote: '',
      }));
      setApps(mapped as any);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDemo) {
      loadApps();
      return;
    }

    const handleError = (error: any) => {
      console.warn("Firestore error in AdminGBPApplications, falling back to Demo Mode:", error);
      setIsDemo(true);
      setLoading(false);
    };

    const q = query(collection(db, 'gbp_applications'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(q, s => {
      setApps(s.docs.map(d => ({ id: d.id, ...d.data() } as GBPApp)));
      setLoading(false);
    }, handleError);
    return () => unsub();
  }, [isDemo]);

  const filtered = filterStatus ? apps.filter(a => a.status === filterStatus) : apps;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">GBP Applications</h2>
          <p className="text-white/40 text-sm">{apps.length} total applications</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin-input max-w-[160px]">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="reviewed">Reviewed</option>
          <option value="accepted">Accepted</option>
          <option value="declined">Declined</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No applications" description="GBP applications from the public site will appear here." />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase tracking-wider">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Track</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Institution</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelected(app)}>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {app.submittedAt ? new Date(app.submittedAt.seconds * 1000).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-white font-medium text-sm">{app.name ?? '—'}</td>
                  <td className="px-4 py-3 text-white/60 text-xs hidden sm:table-cell">{app.track ?? '—'}</td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden md:table-cell">{app.institution ?? '—'}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.status ?? 'new'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <AppDetail app={selected} onClose={() => setSelected(null)} onUpdate={loadApps} />}
    </div>
  );
}
