import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, query, where, onSnapshot, addDoc, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import {
  LogOut, Loader2, FolderOpen, Send, ChevronDown, ChevronUp,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { GTProject } from '../../types';
import brandmarkLogo from '../../assets/images/logo.png';

const STATUS_COLORS: Record<string, string> = {
  Discovery:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'In Progress': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Review:       'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Completed:    'text-primary bg-primary/10 border-primary/20',
  active:       'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  completed:    'text-primary bg-primary/10 border-primary/20',
  paused:       'text-amber-400 bg-amber-500/10 border-amber-500/20',
  archived:     'text-white/30 bg-white/5 border-white/10',
};

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return '';
  const diff = Date.now() - ts.seconds * 1000;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Update {
  id: string;
  text: string;
  postedBy: string;
  timestamp: Timestamp | null;
}

function ProjectCard({ project, builderEmail }: { project: GTProject; builderEmail: string }) {
  const [expanded, setExpanded] = useState(false);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [updateText, setUpdateText] = useState('');
  const [posting, setPosting] = useState(false);
  const [updatesLoaded, setUpdatesLoaded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    setUpdatesLoaded(false);
    const q = query(
      collection(db, 'projects', project.id, 'updates'),
      where('postedBy', '==', builderEmail),
    );
    const unsub = onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Update));
      all.sort((a, b) => (b.timestamp?.seconds ?? 0) - (a.timestamp?.seconds ?? 0));
      setUpdates(all);
      setUpdatesLoaded(true);
    });
    return () => unsub();
  }, [expanded, project.id, builderEmail]);

  const handlePost = async (e: FormEvent) => {
    e.preventDefault();
    if (!updateText.trim()) return;
    setPosting(true);
    try {
      await addDoc(collection(db, 'projects', project.id, 'updates'), {
        text: updateText.trim(),
        postedBy: builderEmail,
        timestamp: serverTimestamp(),
      });
      // Also write to top-level updates for admin dashboard activity feed
      await addDoc(collection(db, 'updates'), {
        projectId: project.id,
        summary: updateText.trim().slice(0, 120),
        text: updateText.trim(),
        postedBy: builderEmail,
        date: serverTimestamp(),
        authorUid: '',
        attachments: [],
      });
      setUpdateText('');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-white font-semibold">{project.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[project.status] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
              {project.status}
            </span>
          </div>
          {project.description && <p className="text-white/40 text-xs">{project.description}</p>}
        </div>
        <button
          onClick={() => setExpanded(v => !v)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all flex-shrink-0"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress bar */}
      {project.progressPercent > 0 && (
        <div className="mt-3">
          <div className="h-1.5 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
          <p className="text-white/25 text-[10px] font-mono mt-1">{project.progressPercent}% complete</p>
        </div>
      )}

      {expanded && (
        <div className="mt-5 pt-5 border-t border-white/[0.07]">
          {/* Post update form */}
          <form onSubmit={handlePost} className="mb-5">
            <p className="text-white/40 text-xs font-semibold mb-2">Post an update to client</p>
            <textarea
              value={updateText}
              onChange={e => setUpdateText(e.target.value)}
              placeholder="Describe what you've worked on, completed, or any blockers…"
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.10] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 resize-none mb-2.5"
            />
            <button
              type="submit"
              disabled={posting || !updateText.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50"
            >
              {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Update
            </button>
          </form>

          {/* My recent updates on this project */}
          {!updatesLoaded ? (
            <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 text-primary animate-spin" /></div>
          ) : updates.length > 0 && (
            <div>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Your Updates</p>
              <div className="flex flex-col gap-3">
                {updates.map(u => (
                  <div key={u.id} className="flex gap-2.5 text-sm">
                    <div className="w-1.5 flex-shrink-0 flex flex-col items-center pt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0 pb-3 border-b border-white/[0.05] last:border-0 last:pb-0">
                      <p className="text-white/75 leading-relaxed whitespace-pre-wrap">{u.text}</p>
                      <p className="text-white/25 text-[10px] font-mono mt-1">{timeAgo(u.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BuilderHubView() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);

  const email = userProfile?.email ?? null;

  useEffect(() => {
    if (!email) return;
    const q = query(collection(db, 'projects'), where('builderEmails', 'array-contains', email));
    const unsub = onSnapshot(q, snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject));
      setProjects(list);
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [email]);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <img src={brandmarkLogo} alt="GalaxaTech" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-white font-bold text-sm">Builder Hub</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs hidden sm:block truncate max-w-[180px]">{email}</span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-semibold transition-all"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-2xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : projects.length === 0 ? (
          <div className="glass-card rounded-2xl p-8 text-center">
            <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h2 className="text-white font-bold text-lg mb-2">No projects assigned yet</h2>
            <p className="text-white/45 text-sm">Projects assigned to your email will appear here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-white font-bold text-xl">My Projects</h2>
              <p className="text-white/40 text-sm mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''} assigned</p>
            </div>
            {projects.map(p => (
              <React.Fragment key={p.id}><ProjectCard project={p} builderEmail={email!} /></React.Fragment>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
