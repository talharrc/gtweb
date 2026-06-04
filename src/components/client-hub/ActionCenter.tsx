import { useNavigate } from 'react-router-dom';
import { Zap, ClipboardList, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useForms } from '../../hooks/useForms';
import { useProjects } from '../../hooks/useProjects';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function ActionCenter() {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const project = projects[0] ?? null;
  const { forms } = useForms(project?.id ?? null);
  const pendingForms = forms.filter(f => f.status === 'pending');
  const submittedForms = forms.filter(f => f.status === 'submitted');

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Action Center</h2>
        <p className="text-white/40 text-sm">Items that need your attention right now</p>
      </div>

      {pendingForms.length === 0 && (
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4 mb-6 border border-emerald-500/20 bg-emerald-500/5">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold">You're all caught up!</p>
            <p className="text-white/50 text-sm">No pending actions at this time.</p>
          </div>
        </div>
      )}

      {pendingForms.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-semibold text-sm">Pending Forms ({pendingForms.length})</h3>
          </div>
          <div className="flex flex-col gap-2">
            {pendingForms.map(f => (
              <div key={f.id} className="glass-card rounded-xl px-4 py-4 flex items-center gap-4 border border-amber-500/20 bg-amber-500/5">
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-white/40 text-xs">{f.fields.length} fields to fill</p>
                </div>
                <StatusBadge status="pending" />
                <button
                  onClick={() => navigate('/hub/client/forms')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-all"
                >
                  Fill <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {submittedForms.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-white font-semibold text-sm">Completed ({submittedForms.length})</h3>
          </div>
          <div className="flex flex-col gap-2">
            {submittedForms.map(f => (
              <div key={f.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3 opacity-60">
                <p className="text-white/70 text-sm flex-1">{f.title}</p>
                <StatusBadge status="submitted" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
