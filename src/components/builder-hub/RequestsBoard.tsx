import { useState, FormEvent } from 'react';
import { Plus, Loader2, X } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useRequests } from '../../hooks/useRequests';
import { useAuth } from '../../context/AuthContext';
import { createRequest } from '../../services/requestService';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

const REQUEST_TYPES = ['Assets / Files', 'Credentials / Access', 'Content / Copy', 'Feedback / Approval', 'Client Information', 'Other'];

export default function RequestsBoard() {
  const { firebaseUser } = useAuth();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const { requests, loading } = useRequests(selectedProjectId || null);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState(REQUEST_TYPES[0]);
  const [detail, setDetail] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !selectedProjectId) return;
    setSaving(true);
    try {
      await createRequest({ projectId: selectedProjectId, builderUid: firebaseUser.uid, type, detail, status: 'open' });
      setDetail('');
      setShowForm(false);
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-2xl mb-1">Requests</h2>
          <p className="text-white/40 text-sm">Request assets, access, or information from clients</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {projects.length > 1 && (
        <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="admin-input mb-4 max-w-xs">
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      )}

      {requests.length === 0 ? (
        <EmptyState title="No requests yet" description="Create a request to get assets or information from your client." />
      ) : (
        <div className="flex flex-col gap-3">
          {requests.map(r => (
            <div key={r.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="text-white font-semibold text-sm">{r.type}</p>
                  <p className="text-white/50 text-xs mt-0.5">{r.detail}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <p className="text-white/30 text-xs">
                {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : '—'}
              </p>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">New Request</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              {projects.length > 1 && (
                <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="admin-input">
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
              <select value={type} onChange={e => setType(e.target.value)} className="admin-input">
                {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <textarea required value={detail} onChange={e => setDetail(e.target.value)} placeholder="Describe what you need…" rows={3} className="admin-input resize-none" />
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
