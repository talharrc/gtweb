import React from 'react';
import { Paperclip, ExternalLink, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useProjectUpdates } from '../../hooks/useProjectUpdates';
import { useUserProfile } from '../../hooks/useUserProfile';
import EmptyState from '../shared/EmptyState';

function UpdateCard({ update }: { key?: React.Key; update: any }) {
  const { profile } = useUserProfile(update.authorUid);
  const date = update.date ? new Date(update.date.seconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-3">
        {profile?.photoURL ? (
          <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
            {profile?.displayName?.[0] ?? 'G'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-white font-semibold text-sm">{profile?.displayName ?? 'Team GalaxaTech'}</p>
            <p className="text-white/30 text-xs">{date}</p>
          </div>
          <p className="text-white/70 text-sm mt-1 leading-relaxed">{update.summary}</p>
        </div>
      </div>
      {update.attachments?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-white/5">
          {update.attachments.map((url: string, i: number) => (
            <a key={i} href={url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all">
              <Paperclip className="w-3 h-3" />
              Attachment {i + 1}
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UpdatesFeed() {
  const { projects } = useProjects();
  const project = projects[0] ?? null;
  const { updates, loading } = useProjectUpdates(project?.id ?? null);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Project Updates</h2>
        <p className="text-white/40 text-sm">Latest from your team</p>
      </div>
      {updates.length === 0 ? (
        <EmptyState title="No updates yet" description="Your team will post updates here as work progresses." />
      ) : (
        <div className="flex flex-col gap-3">
          {updates.map(u => <UpdateCard key={u.id} update={u} />)}
        </div>
      )}
    </div>
  );
}
