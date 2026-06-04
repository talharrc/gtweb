import { Calendar, Users } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useProject } from '../../context/ProjectContext';
import StatusBadge from '../shared/StatusBadge';
import ProgressBar from '../shared/ProgressBar';
import EmptyState from '../shared/EmptyState';

export default function MyProjects() {
  const { projects, loading } = useProjects();
  const { selectedProjectId, setSelectedProjectId, setSelectedProject } = useProject();

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Loading…</div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">My Projects</h2>
        <p className="text-white/40 text-sm">{projects.length} assigned</p>
      </div>
      {projects.length === 0 ? (
        <EmptyState title="No projects assigned" description="You'll see your projects here once assigned by the admin." />
      ) : (
        <div className="grid gap-4">
          {projects.map(p => {
            const deadline = p.deadline ? new Date(p.deadline.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline';
            const isSelected = selectedProjectId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => { setSelectedProjectId(p.id); setSelectedProject(p); }}
                className={`glass-card rounded-2xl p-5 text-left transition-all ${isSelected ? 'border-primary/40 bg-primary/5' : 'hover:border-white/15'}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold truncate">{p.name}</h3>
                      <StatusBadge status={p.status} />
                      {isSelected && <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Active</span>}
                    </div>
                    <p className="text-white/40 text-xs truncate">{p.description}</p>
                  </div>
                </div>
                <ProgressBar percent={p.progressPercent} />
                <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {deadline}</span>
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.builderUids?.length ?? 1} builder{p.builderUids?.length !== 1 ? 's' : ''}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
