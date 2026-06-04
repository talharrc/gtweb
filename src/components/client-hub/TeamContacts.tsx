import React from 'react';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useUserProfile } from '../../hooks/useUserProfile';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

function BuilderCard({ uid }: { key?: React.Key; uid: string }) {
  const { profile } = useUserProfile(uid);
  if (!profile) return null;
  return (
    <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
      {profile.photoURL ? (
        <img src={profile.photoURL} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
          {profile.displayName?.[0] ?? '?'}
        </div>
      )}
      <div className="flex-1">
        <p className="text-white font-semibold">{profile.displayName}</p>
        <p className="text-white/40 text-sm">{profile.email}</p>
      </div>
      <StatusBadge status="builder" size="md" />
    </div>
  );
}

export default function TeamContacts() {
  const { projects, loading } = useProjects();
  const project = projects[0] ?? null;

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;
  if (!project) return <EmptyState title="No project assigned" />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Team & Contacts</h2>
        <p className="text-white/40 text-sm">Your assigned builders and project communication</p>
      </div>

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

      {project.builderUids?.length === 0 ? (
        <EmptyState title="No builders assigned yet" description="GalaxaTech will assign your team shortly." />
      ) : (
        <div className="flex flex-col gap-3">
          {project.builderUids.map(uid => <BuilderCard key={uid} uid={uid} />)}
        </div>
      )}
    </div>
  );
}
