import React from 'react';
import { Calendar, CheckCircle2, Clock, Circle } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import StatusBadge from '../shared/StatusBadge';
import ProgressBar from '../shared/ProgressBar';
import EmptyState from '../shared/EmptyState';
import { Milestone } from '../../types';

function MilestoneRow({ m }: { key?: React.Key; m: Milestone }) {
  const icon = m.status === 'completed'
    ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    : m.status === 'active'
      ? <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
      : <Circle className="w-4 h-4 text-white/20" />;
  return (
    <div className={`flex items-center gap-3 py-2.5 px-3 rounded-xl ${m.status === 'active' ? 'bg-amber-500/5 border border-amber-500/20' : 'bg-white/[0.02]'}`}>
      {icon}
      <span className={`text-sm ${m.status === 'completed' ? 'text-white/40 line-through' : m.status === 'active' ? 'text-white font-semibold' : 'text-white/60'}`}>
        {m.title}
      </span>
      {m.status !== 'pending' && <StatusBadge status={m.status} />}
    </div>
  );
}

export default function ProjectOverview() {
  const { projects, loading } = useProjects();
  const project = projects[0] ?? null;

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Loading…</div>;
  if (!project) return <EmptyState title="No project assigned" description="Contact GalaxaTech to get your project set up." />;

  const deadline = project.deadline
    ? new Date(project.deadline.seconds * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not set';

  const daysLeft = project.deadline
    ? Math.ceil((project.deadline.seconds * 1000 - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-white font-bold text-2xl">{project.name}</h2>
          <StatusBadge status={project.status} size="md" />
        </div>
        <p className="text-white/50 text-sm">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Progress</p>
          <p className="text-white font-bold text-3xl font-mono">{project.progressPercent}%</p>
          <div className="mt-2"><ProgressBar percent={project.progressPercent} showValue={false} /></div>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Deadline</p>
          <p className="text-white font-bold text-sm">{deadline}</p>
          {daysLeft !== null && (
            <p className={`text-xs mt-1 ${daysLeft < 7 ? 'text-red-400' : daysLeft < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue'}
            </p>
          )}
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Milestones</p>
          <p className="text-white font-bold text-3xl font-mono">
            {project.milestones?.filter(m => m.status === 'completed').length ?? 0}
            <span className="text-white/30 text-lg">/{project.milestones?.length ?? 0}</span>
          </p>
          <p className="text-white/40 text-xs mt-1">completed</p>
        </div>
      </div>

      {project.milestones?.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="text-white font-semibold text-sm mb-3">Milestones</h3>
          <div className="flex flex-col gap-1.5">
            {project.milestones.map(m => <MilestoneRow key={m.id} m={m} />)}
          </div>
        </div>
      )}
    </div>
  );
}
