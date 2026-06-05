import { MessageCircle, Mail, Hammer, Loader2 } from 'lucide-react';
import { useProject } from '../../context/ProjectContext';
import { useProjects } from '../../hooks/useProjects';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

export default function TeamContacts() {
  const { selectedProject } = useProject();
  const { loading } = useProjects();
  const project = selectedProject;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  if (!project) return <EmptyState title="No project assigned" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Team & Contacts</h2>
        <p className="text-white/40 text-sm">Your assigned team and project communication channels</p>
      </div>

      {/* WhatsApp group */}
      {project.whatsappGroupUrl && (
        <a
          href={project.whatsappGroupUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/15 transition-all mb-6"
        >
          <MessageCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-white font-semibold text-sm">Project WhatsApp Group</p>
            <p className="text-white/50 text-xs">Tap to join your dedicated project channel</p>
          </div>
        </a>
      )}

      {/* GalaxaTech contact */}
      <div className="glass-card rounded-2xl p-5 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">GT</span>
          </div>
          <div>
            <p className="text-white font-semibold">GalaxaTech</p>
            <p className="text-white/40 text-xs">Project Manager</p>
          </div>
          <StatusBadge status="admin" />
        </div>
        <a href="mailto:mail.galaxatech@gmail.com" className="flex items-center gap-2 text-xs text-white/50 hover:text-primary transition-colors">
          <Mail className="w-3.5 h-3.5" /> mail.galaxatech@gmail.com
        </a>
      </div>

      {/* Builders */}
      {project.builders && project.builders.length > 0 ? (
        <div className="flex flex-col gap-3">
          {project.builders.map((b, i) => (
            <div key={b.uid ?? i} className="glass-card rounded-2xl p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-base flex-shrink-0">
                {b.name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold">{b.name}</p>
                {b.specialty && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Hammer className="w-3 h-3 text-emerald-400/60" />
                    <p className="text-white/40 text-xs">{b.specialty}</p>
                  </div>
                )}
                {b.email && (
                  <a href={`mailto:${b.email}`} className="flex items-center gap-1.5 mt-0.5 text-xs text-white/40 hover:text-primary transition-colors">
                    <Mail className="w-3 h-3" /> {b.email}
                  </a>
                )}
              </div>
              <StatusBadge status="builder" />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No builders assigned yet" description="GalaxaTech will assign your team shortly." />
      )}
    </div>
  );
}
