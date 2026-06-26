import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection, query, where, onSnapshot, orderBy, Timestamp,
} from 'firebase/firestore';
import {
  LogOut, Loader2, FolderOpen, Radio, ChevronRight, Clock,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { GTProject } from '../../types';
import brandmarkLogo from '../../assets/images/logo.png';

interface Update {
  id: string;
  text: string;
  postedBy: string;
  timestamp: Timestamp | null;
}

const STATUS_STAGES = ['Discovery', 'In Progress', 'Review', 'Completed'] as const;
type Stage = typeof STATUS_STAGES[number];

const STAGE_COLORS: Record<Stage, string> = {
  Discovery:    'bg-purple-500/20 text-purple-300 border-purple-500/30',
  'In Progress': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  Review:       'bg-amber-500/20 text-amber-300 border-amber-500/30',
  Completed:    'bg-primary/20 text-primary border-primary/30',
};

function stageIndex(status: string): number {
  const idx = STATUS_STAGES.indexOf(status as Stage);
  return idx >= 0 ? idx : 0;
}

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

export default function ClientHubView() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<GTProject | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  const email = userProfile?.email ?? null;

  // Load project by clientEmail
  useEffect(() => {
    if (!email) return;
    const q = query(collection(db, 'projects'), where('clientEmail', '==', email));
    const unsub = onSnapshot(q, snap => {
      const first = snap.docs[0];
      setProject(first ? ({ id: first.id, ...first.data() } as GTProject) : null);
      setProjectLoading(false);
    }, () => setProjectLoading(false));
    return () => unsub();
  }, [email]);

  // Load updates from subcollection
  useEffect(() => {
    if (!project) { setUpdates([]); return; }
    setUpdatesLoading(true);
    const q = query(
      collection(db, 'projects', project.id, 'updates'),
      orderBy('timestamp', 'desc'),
    );
    const unsub = onSnapshot(q, snap => {
      setUpdates(snap.docs.map(d => ({ id: d.id, ...d.data() } as Update)));
      setUpdatesLoading(false);
    }, () => setUpdatesLoading(false));
    return () => unsub();
  }, [project?.id]);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const activeStageIdx = project ? stageIndex(project.status) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <img src={brandmarkLogo} alt="GalaxaTech" className="w-7 h-7 rounded-lg object-contain" />
          <span className="text-white font-bold text-sm">Client Hub</span>
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

        {projectLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : !project ? (
          /* No project yet */
          <div className="glass-card rounded-2xl p-8 text-center">
            <FolderOpen className="w-10 h-10 text-white/20 mx-auto mb-4" />
            <h2 className="text-white font-bold text-lg mb-2">No active project yet</h2>
            <p className="text-white/45 text-sm">We'll link your project soon. Check back shortly or reach out to your contact at GalaxaTech.</p>
          </div>
        ) : (
          <>
            {/* Project card */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-white font-bold text-xl mb-1">{project.name}</h2>
                  {project.description && <p className="text-white/45 text-sm">{project.description}</p>}
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-full border flex-shrink-0 ${STAGE_COLORS[project.status as Stage] ?? 'bg-white/5 text-white/40 border-white/10'}`}>
                  {project.status}
                </span>
              </div>

              {/* Stage progress track */}
              <div>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Project Progress</p>
                <div className="flex items-center gap-0">
                  {STATUS_STAGES.map((stage, i) => {
                    const done = i < activeStageIdx;
                    const active = i === activeStageIdx;
                    return (
                      <div key={stage} className="flex items-center flex-1 min-w-0">
                        <div className="flex flex-col items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            done   ? 'bg-primary border-primary text-white' :
                            active ? 'bg-primary/20 border-primary text-primary' :
                                     'bg-white/5 border-white/15 text-white/25'
                          }`}>
                            {done ? (
                              <ChevronRight className="w-3.5 h-3.5" />
                            ) : active ? (
                              <Radio className="w-3.5 h-3.5 animate-pulse" />
                            ) : (
                              <span className="text-[10px] font-mono">{i + 1}</span>
                            )}
                          </div>
                          <p className={`text-[9px] font-mono mt-1.5 text-center leading-tight ${active ? 'text-primary font-bold' : done ? 'text-white/50' : 'text-white/20'}`}>
                            {stage}
                          </p>
                        </div>
                        {i < STATUS_STAGES.length - 1 && (
                          <div className={`h-0.5 flex-1 mx-1 mb-4 rounded-full ${done ? 'bg-primary' : 'bg-white/10'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress bar */}
              {project.progressPercent > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/30 text-[10px] font-mono">Overall completion</span>
                    <span className="text-white/50 text-[10px] font-mono">{project.progressPercent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                      style={{ width: `${project.progressPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Updates feed */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-white font-semibold">Project Updates</h3>
              </div>

              {updatesLoading ? (
                <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
              ) : updates.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-6">No updates posted yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {updates.map(u => (
                    <div key={u.id} className="flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold flex-shrink-0 mt-0.5">
                        {u.postedBy?.[0]?.toUpperCase() ?? 'B'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-white/60 text-xs font-semibold truncate">{u.postedBy || 'Builder'}</span>
                          <span className="text-white/25 text-[10px] font-mono flex-shrink-0">{timeAgo(u.timestamp)}</span>
                        </div>
                        <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">{u.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
