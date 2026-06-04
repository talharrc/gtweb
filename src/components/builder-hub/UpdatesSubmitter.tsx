import { useState, FormEvent } from 'react';
import { Send, Loader2, Paperclip, CheckCircle2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useAuth } from '../../context/AuthContext';
import { postUpdate } from '../../services/updateService';
import { useProjectUpdates } from '../../hooks/useProjectUpdates';
import EmptyState from '../shared/EmptyState';

export default function UpdatesSubmitter() {
  const { firebaseUser } = useAuth();
  const { projects } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id ?? '');
  const { updates } = useProjectUpdates(selectedProjectId || null);
  const [summary, setSummary] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!firebaseUser || !selectedProjectId || !summary.trim()) return;
    setSubmitting(true);
    setSuccess(false);
    try {
      await postUpdate(selectedProjectId, firebaseUser.uid, summary, files);
      setSummary('');
      setFiles([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Post Update</h2>
        <p className="text-white/40 text-sm">Share progress with your client</p>
      </div>

      <div className="glass-card rounded-2xl p-5 mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {projects.length > 1 && (
            <select value={selectedProjectId} onChange={e => setSelectedProjectId(e.target.value)} className="admin-input">
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          )}
          {projects.length === 1 && (
            <p className="text-white/50 text-sm font-semibold">{projects[0]?.name}</p>
          )}
          <textarea
            required
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="What did you work on? Share your progress…"
            rows={4}
            className="admin-input resize-none"
          />
          <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-dashed border-white/10 cursor-pointer hover:border-primary/30 transition-all">
            <Paperclip className="w-4 h-4 text-white/30" />
            <span className="text-white/40 text-sm">
              {files.length > 0 ? `${files.length} file(s) selected` : 'Attach files (optional)'}
            </span>
            <input type="file" multiple className="hidden" onChange={e => setFiles(Array.from(e.target.files ?? []))} />
          </label>
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Update posted successfully!
            </div>
          )}
          <button type="submit" disabled={submitting || !summary.trim() || !selectedProjectId} className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {submitting ? 'Posting…' : 'Post Update'}
          </button>
        </form>
      </div>

      {updates.length > 0 && (
        <div>
          <h3 className="text-white font-semibold text-sm mb-3">Recent updates</h3>
          <div className="flex flex-col gap-2">
            {updates.slice(0, 5).map(u => (
              <div key={u.id} className="glass-card rounded-xl px-4 py-3">
                <p className="text-white/70 text-sm">{u.summary}</p>
                <p className="text-white/30 text-xs mt-1">
                  {u.date ? new Date(u.date.seconds * 1000).toLocaleDateString() : ''}
                  {u.attachments?.length > 0 && ` · ${u.attachments.length} attachment(s)`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
