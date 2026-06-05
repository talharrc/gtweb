import React from 'react';
import { Calendar, CheckCircle2, Clock, Circle, Building2, Tag } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
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
      <span className={`text-sm flex-1 ${m.status === 'completed' ? 'text-white/40 line-through' : m.status === 'active' ? 'text-white font-semibold' : 'text-white/60'}`}>
        {m.title}
      </span>
      {m.status !== 'pending' && <StatusBadge status={m.status} />}
    </div>
  );
}

export default function ProjectOverview() {
  const { selectedProject } = useProject();
  const { loading } = useProjects();
  const project = selectedProject;

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
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h2 className="text-white font-bold text-2xl">{project.name}</h2>
          <StatusBadge status={project.status} size="md" />
        </div>
        {project.category && (
          <div className="flex items-center gap-1.5 mb-2">
            <Tag className="w-3.5 h-3.5 text-primary/60" />
            <span className="text-primary/70 text-xs font-mono">{project.category}</span>
          </div>
        )}
        <p className="text-white/50 text-sm">{project.description}</p>
      </div>

      {/* Client info strip */}
      {project.clientInfo && (
        <div className="glass-card rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm">{project.clientInfo.name}</p>
            <p className="text-white/40 text-xs truncate">
              {[project.clientInfo.company, project.clientInfo.email, project.clientInfo.phone].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Progress</p>
          <p className="text-white font-bold text-3xl font-mono">{project.progressPercent}%</p>
          <div className="mt-2"><ProgressBar percent={project.progressPercent} showValue={false} /></div>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Deadline</p>
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-white/40" />
            <p className="text-white font-bold text-sm">{deadline}</p>
          </div>
          {daysLeft !== null && (
            <p className={`text-xs ${daysLeft < 7 ? 'text-red-400' : daysLeft < 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
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
