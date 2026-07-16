import { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';
import { Loader2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

interface AuditSubmission {
  id: string;
  type?: string;
  formData?: Record<string, any>;
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  submittedAt?: Timestamp;
  status?: 'new' | 'in-progress' | 'sent';
}

const STATUS_FLOW: Record<string, string> = {
  new: 'in-progress',
  'in-progress': 'sent',
};

function SubmissionDetail({ sub, onClose }: { sub: AuditSubmission; onClose: () => void }) {
  const fd = sub.formData ?? {};

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="glass-card w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-white font-bold">{sub.type ?? 'Audit'} Submission</h3>
            <p className="text-white/40 text-xs mt-0.5">
              {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleString() : 'Unknown date'}
            </p>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-white/50" /></button>
        </div>

        <div className="grid gap-3">
          {Object.entries(fd).map(([key, val]) => (
            <div key={key} className="bg-white/5 rounded-xl p-3">
              <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-1">{key.replace(/_/g, ' ')}</p>
              <p className="text-white/80 text-sm break-words">{String(val ?? '—')}</p>
            </div>
          ))}
          {Object.keys(fd).length === 0 && (
            <p className="text-white/30 text-sm">No form data captured.</p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-white/5 flex gap-2 justify-end">
          {sub.status !== 'sent' && STATUS_FLOW[sub.status ?? 'new'] && (
            <button
              onClick={async () => {
                await updateDoc(doc(db, 'audit_submissions', sub.id), {
                  status: STATUS_FLOW[sub.status ?? 'new'],
                });
              }}
              className="px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all"
            >
              Mark as {STATUS_FLOW[sub.status ?? 'new'] === 'in-progress' ? 'In Progress' : 'Sent'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminAuditSubmissions() {
  const { isDemo, setIsDemo } = useAuth();
  const [submissions, setSubmissions] = useState<AuditSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AuditSubmission | null>(null);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (isDemo) {
      const mapped = mockDb.getAudits().map(a => ({
        id: a.id,
        type: 'SEO/Performance',
        businessName: a.fullName + ' Store',
        contactEmail: a.email,
        contactPhone: a.whatsappNumber,
        status: a.status === 'pending' ? 'new' : a.status === 'in_progress' ? 'in-progress' : 'sent',
        submittedAt: a.submittedAt as any,
        formData: {
          websiteUrl: a.websiteUrl,
          fullName: a.fullName,
          whatsappNumber: a.whatsappNumber,
        }
      }));
      setSubmissions(mapped as any);
      setLoading(false);
      return;
    }

    const handleError = (error: any) => {
      console.warn("Firestore error in AdminAuditSubmissions, falling back to Demo Mode:", error);
      setIsDemo(true);
      setLoading(false);
    };

    const q = query(collection(db, 'audit_submissions'), orderBy('submittedAt', 'desc'));
    const unsub = onSnapshot(q, s => {
      setSubmissions(s.docs.map(d => ({ id: d.id, ...d.data() } as AuditSubmission)));
      setLoading(false);
    }, handleError);
    return () => unsub();
  }, [isDemo]);

  const filtered = filterStatus ? submissions.filter(s => s.status === filterStatus) : submissions;

  const advanceStatus = async (sub: AuditSubmission) => {
    const nextStatus = STATUS_FLOW[sub.status ?? 'new'];
    if (!nextStatus) return;

    if (isDemo) {
      const mockAudits = mockDb.getAudits();
      const dbStatus = nextStatus === 'new' ? 'pending' : nextStatus === 'in-progress' ? 'in_progress' : 'completed';
      const updated = mockAudits.map(a => a.id === sub.id ? { ...a, status: dbStatus as any } : a);
      mockDb.saveAudits(updated);
      setSubmissions(subs => subs.map(s => s.id === sub.id ? { ...s, status: nextStatus as any } : s));
    } else {
      await updateDoc(doc(db, 'audit_submissions', sub.id), {
        status: nextStatus,
      });
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Audit Submissions</h2>
          <p className="text-white/40 text-sm">{submissions.length} total from public form</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="admin-input max-w-[160px]">
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No submissions" description="Audit form submissions from the public site will appear here." />
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-white/40 text-[10px] uppercase tracking-wider">
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Contact</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(sub => (
                <tr key={sub.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelected(sub)}>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {sub.submittedAt ? new Date(sub.submittedAt.seconds * 1000).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 text-white/70 text-xs hidden sm:table-cell">{sub.type ?? 'Audit'}</td>
                  <td className="px-4 py-3 text-white/50 text-xs hidden md:table-cell">
                    {sub.formData?.email ?? sub.contactEmail ?? '—'}
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    <StatusBadge status={sub.status ?? 'new'} />
                  </td>
                  <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                    {sub.status !== 'sent' && (
                      <button
                        onClick={() => advanceStatus(sub)}
                        className="text-[10px] text-primary hover:text-white px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 transition-all"
                      >
                        {STATUS_FLOW[sub.status ?? 'new'] === 'in-progress' ? '→ In Progress' : '→ Sent'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && <SubmissionDetail sub={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
