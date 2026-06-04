import { useState } from 'react';
import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useDocuments } from '../../hooks/useDocuments';
import { GTDocument } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

const TYPE_COLORS: Record<GTDocument['type'], string> = {
  agreement: 'text-primary bg-primary/10',
  proposal: 'text-cyan-400 bg-cyan-500/10',
  invoice: 'text-amber-400 bg-amber-500/10',
  deliverable: 'text-emerald-400 bg-emerald-500/10',
  handover: 'text-secondary bg-secondary/10',
};

const DOC_TYPES: GTDocument['type'][] = ['agreement', 'proposal', 'invoice', 'deliverable', 'handover'];

export default function DocumentVault() {
  const { projects } = useProjects();
  const project = projects[0] ?? null;
  const { documents, loading } = useDocuments(project?.id ?? null);
  const [filter, setFilter] = useState<GTDocument['type'] | 'all'>('all');

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  const filtered = filter === 'all' ? documents : documents.filter(d => d.type === filter);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Documents & Files</h2>
        <p className="text-white/40 text-sm">All your project documents in one place</p>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', ...DOC_TYPES] as const).map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${filter === t ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No documents" description="Documents shared by your team will appear here." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(d => (
            <div key={d.id} className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${TYPE_COLORS[d.type]}`}>
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{d.name}</p>
                <p className="text-white/40 text-xs capitalize">
                  {d.type} · v{d.version}
                  {d.uploadedAt && ` · ${new Date(d.uploadedAt.seconds * 1000).toLocaleDateString()}`}
                </p>
              </div>
              {d.isLatest && <StatusBadge status="active" />}
              <a href={d.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all flex-shrink-0">
                Open <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
