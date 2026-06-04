import { FileText, ExternalLink, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useDocuments } from '../../hooks/useDocuments';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function AgreementsVault() {
  const { projects } = useProjects();
  const { documents, loading } = useDocuments(projects[0]?.id ?? null);
  const agreements = documents.filter(d => d.type === 'agreement');

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Agreements</h2>
        <p className="text-white/40 text-sm">Your builder agreements and revenue-share terms</p>
      </div>
      {agreements.length === 0 ? (
        <EmptyState title="No agreements on file" description="Agreements uploaded by admin will appear here." icon={<FileText className="w-5 h-5" />} />
      ) : (
        <div className="flex flex-col gap-2">
          {agreements.map(d => (
            <div key={d.id} className="glass-card rounded-xl px-4 py-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">{d.name}</p>
                <p className="text-white/40 text-xs">v{d.version} · {d.uploadedAt ? new Date(d.uploadedAt.seconds * 1000).toLocaleDateString() : '—'}</p>
              </div>
              {d.isLatest && <StatusBadge status="active" />}
              <a href={d.fileUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all">
                Open <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
