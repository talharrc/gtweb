import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { LogOut, Loader2, FolderOpen, Radio, ChevronRight, Clock, FileText, CheckCircle2, AlertCircle, Compass, Shield, ArrowUpRight } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { GTProject } from '../../types';
import brandmarkLogo from '../../assets/images/gt-logo-new.png';

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

const MOCK_UPDATES = [
  { id: '1', text: 'Completed Stripe Checkout webhook integration and verified payment logs.', postedBy: 'Talha (Lead)', timestamp: { seconds: Date.now() / 1000 - 3600 } },
  { id: '2', text: 'Uploaded full interactive Figma design prototype workspace.', postedBy: 'Abrar (Design)', timestamp: { seconds: Date.now() / 1000 - 86400 } },
  { id: '3', text: 'Provisioned PostgreSQL database on AWS RDS and established secure connection pooling.', postedBy: 'Talha (Lead)', timestamp: { seconds: Date.now() / 1000 - 172800 } },
];

export default function ClientHubView() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [project, setProject] = useState<GTProject | null>(null);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [updatesLoading, setUpdatesLoading] = useState(false);

  const email = userProfile?.email ?? null;
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true' || !email;

  // Load project by clientEmail (if not in Demo mode)
  useEffect(() => {
    if (isDemo || !email) {
      // Mock Demo Project Data
      setProject({
        id: 'demo_proj',
        name: 'Ecosystem Scale v2',
        clientEmail: 'client@demo.com',
        description: 'Complete visual redesign and workflow automation integration for Alpha Brands Inc.',
        status: 'In Progress',
        progressPercent: 76,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);
      setProjectLoading(false);
      return;
    }

    const q = query(collection(db, 'projects'), where('clientEmail', '==', email));
    const unsub = onSnapshot(q, snap => {
      const first = snap.docs[0];
      setProject(first ? ({ id: first.id, ...first.data() } as GTProject) : null);
      setProjectLoading(false);
    }, () => setProjectLoading(false));
    return () => unsub();
  }, [email, isDemo]);

  // Load updates (if not in Demo mode)
  useEffect(() => {
    if (isDemo) {
      setUpdates(MOCK_UPDATES as any);
      return;
    }
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
  }, [project?.id, isDemo]);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const activeStageIdx = project ? stageIndex(project.status) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0717]">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/')} className="hover:scale-105 transition-transform flex items-center gap-2">
            <img src={brandmarkLogo} alt="GalaxaTech" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-white font-bold text-sm font-display">Client Hub</span>
          </button>
          {isDemo && (
            <span className="text-[9px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
              Sandbox Preview
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs hidden sm:block truncate max-w-[180px] font-mono">
            {isDemo ? 'alpha-brands@client.com' : email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {projectLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : !project ? (
          <div className="glass-card-premium rounded-3xl p-10 text-center border border-white/10">
            <FolderOpen className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h2 className="text-white font-bold text-lg mb-2">No active project linked yet</h2>
            <p className="text-white/45 text-sm">We'll connect your active dashboard workspace shortly. Reach out via WhatsApp to trigger initialization.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Progress & Updates (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6 w-full">
              {/* Project Progress */}
              <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-white font-bold text-xl font-display">{project.name}</h2>
                    {project.description && <p className="text-white/45 text-xs mt-1 leading-relaxed">{project.description}</p>}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border flex-shrink-0 ${STAGE_COLORS[project.status as Stage] ?? 'bg-white/5 text-white/40 border-white/10'}`}>
                    {project.status}
                  </span>
                </div>

                {/* Stage timeline track */}
                <div className="mb-6">
                  <p className="text-white/30 text-[9px] font-mono uppercase tracking-wider mb-4">Pipeline Milestones</p>
                  <div className="flex items-center gap-0 w-full">
                    {STATUS_STAGES.map((stage, i) => {
                      const done = i < activeStageIdx;
                      const active = i === activeStageIdx;
                      return (
                        <div key={stage} className="flex items-center flex-1 min-w-0">
                          <div className="flex flex-col items-center flex-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                              done   ? 'bg-primary border-primary text-white' :
                              active ? 'bg-primary/20 border-primary text-primary shadow-[0_0_12px_rgba(236,30,142,0.3)]' :
                                       'bg-white/5 border-white/10 text-white/20'
                            }`}>
                              {done ? (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              ) : active ? (
                                <Radio className="w-3.5 h-3.5 animate-pulse" />
                              ) : (
                                <span className="text-[10px] font-mono">{i + 1}</span>
                              )}
                            </div>
                            <p className={`text-[9px] font-bold mt-2 text-center leading-tight ${active ? 'text-primary' : done ? 'text-white/50' : 'text-white/20'}`}>
                              {stage}
                            </p>
                          </div>
                          {i < STATUS_STAGES.length - 1 && (
                            <div className={`h-px flex-1 mx-1 mb-4 rounded-full ${done ? 'bg-primary' : 'bg-white/10'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar percentage */}
                {project.progressPercent > 0 && (
                  <div className="border-t border-white/5 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Project Integrity Scale</span>
                      <span className="text-white/50 text-xs font-mono font-bold">{project.progressPercent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700 shadow-[0_0_8px_rgba(236,30,142,0.4)]"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Updates feed */}
              <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-primary" />
                    <h3 className="text-white font-bold font-display">System Action Logs</h3>
                  </div>
                  <span className="text-[9px] font-mono text-white/30">Auto-syncing active</span>
                </div>

                {updatesLoading ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 text-primary animate-spin" /></div>
                ) : updates.length === 0 ? (
                  <p className="text-white/30 text-xs text-center py-6">No action updates posted yet.</p>
                ) : (
                  <div className="flex flex-col gap-4">
                    {updates.map(u => (
                      <div key={u.id} className="flex gap-3 bg-white/[0.01] border border-white/[0.03] p-4 rounded-2xl">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5 font-mono">
                          {u.postedBy?.[0]?.toUpperCase() ?? 'G'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <span className="text-white/70 text-xs font-semibold truncate">{u.postedBy || 'Galaxa Architect'}</span>
                            <span className="text-white/25 text-[9px] font-mono flex-shrink-0">
                              {u.timestamp ? new Date(u.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                          <p className="text-white/60 text-xs leading-relaxed whitespace-pre-wrap">{u.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Assets & Integrations (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 w-full">
              {/* Deliverable Assets Vault */}
              <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Deliverables Vault
                </h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { name: 'Systems Architecture Map.pdf', size: '2.4 MB' },
                    { name: 'Galaxa Brand Guidelines.fig', size: '18.5 MB' },
                    { name: 'PostgreSQL RDS Setup.txt', size: '12 KB' },
                  ].map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer">
                      <div className="overflow-hidden mr-2">
                        <p className="text-white/80 text-xs font-medium truncate">{doc.name}</p>
                        <p className="text-white/35 text-[9px] font-mono mt-0.5">{doc.size}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Live System Integration Monitor */}
              <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" /> Integration Monitor
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Stripe API Gateway', status: 'Synchronized', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                    { label: 'PostgreSQL RDS database', status: 'Active (3 pools)', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                    { label: 'Tailwind/Framer Redesign', status: '76% Complete', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
                    { label: 'Vercel Staging Deploy', status: 'Online', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                  ].map((sys, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-white/55 text-xs">{sys.label}</span>
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 border rounded ${sys.color}`}>
                        {sys.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
