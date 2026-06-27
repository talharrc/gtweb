import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { GTProject } from '../../types';
import { LogOut, Loader2, FolderOpen, Clock, Code2, Users, DollarSign, CheckCircle2, ChevronRight, Send, HelpCircle, Laptop } from 'lucide-react';
import brandmarkLogo from '../../assets/images/gt-logo-new.svg';

interface SprintTask {
  id: string;
  name: string;
  project: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
}

const MOCK_TASKS: SprintTask[] = [
  { id: '1', name: 'Refactor 3D Globe mobile touch hijacking prevention', project: 'GalaxaTech HQ', status: 'in_progress', priority: 'high' },
  { id: '2', name: 'Develop checkout billing workflow & Stripe webhooks', project: 'Alpha Brands', status: 'done', priority: 'high' },
  { id: '3', name: 'Redesign tactile Join Team switch utilizing display font', project: 'GalaxaTech HQ', status: 'done', priority: 'medium' },
  { id: '4', name: 'Assemble Browse tech storefront routes & cards', project: 'GalaxaTech HQ', status: 'done', priority: 'high' },
];

export default function BuilderHubView() {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [sprintTasks, setSprintTasks] = useState<SprintTask[]>([]);
  const [logText, setLogText] = useState('');
  const [logStatus, setLogStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const email = userProfile?.email ?? null;
  const isDemo = new URLSearchParams(location.search).get('demo') === 'true' || !email;

  // Load project assignments
  useEffect(() => {
    if (isDemo) {
      setProjects([
        { id: 'p1', name: 'GalaxaTech Platform v2', status: 'In Progress', progressPercent: 92 },
        { id: 'p2', name: 'Alpha Brands Inc.', status: 'In Progress', progressPercent: 76 }
      ] as any);
      setSprintTasks(MOCK_TASKS);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'projects'));
    const unsub = onSnapshot(q, snap => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [email, isDemo]);

  const handleSignOut = async () => { await signOut(); navigate('/'); };

  const handleSubmitLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logText.trim()) return;
    setLogStatus('submitting');
    setTimeout(() => {
      setLogStatus('success');
      setLogText('');
      setTimeout(() => setLogStatus('idle'), 2500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0717]">
      {/* Topbar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <button onClick={() => navigate('/')} className="hover:scale-105 transition-transform flex items-center gap-2">
            <img src={brandmarkLogo} alt="GalaxaTech" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-white font-bold text-sm font-display">Builder Hub</span>
          </button>
          {isDemo && (
            <span className="text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              Builder Sandbox
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white/40 text-xs hidden sm:block truncate max-w-[180px] font-mono">
            {isDemo ? 'architect-talha@galaxatech.com' : email}
          </span>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/10 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Close
          </button>
        </div>
      </header>

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left: Sprint tasks & Commit logger (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6 w-full">
              {/* Active Sprint Board */}
              <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-bold text-lg font-display flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" /> Active Sprints
                  </h3>
                  <span className="text-[10px] font-mono bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase">
                    Sprint #12 Active
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  {sprintTasks.map(t => (
                    <div key={t.id} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/[0.03] hover:border-primary/20 transition-all">
                      <div>
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <span className="text-[9px] font-mono text-white/30 uppercase">{t.project}</span>
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                            t.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                        <p className="text-white/80 text-xs font-semibold">{t.name}</p>
                      </div>

                      <div className="flex-shrink-0">
                        {t.status === 'done' ? (
                          <span className="text-[9px] font-mono font-bold bg-green-500/15 text-green-400 border border-green-500/20 px-2.5 py-1 rounded">
                            Done
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold bg-primary/15 text-primary border border-primary/20 px-2.5 py-1 rounded">
                            In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commit and Action Log submitter */}
              <div className="glass-card-premium rounded-3xl p-7 border border-white/10">
                <h3 className="text-white font-bold text-lg font-display mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-secondary" /> Submit Work Log
                </h3>
                <p className="text-white/50 text-xs mb-5">Broadcast daily updates directly to the client dashboard feed and sync deployment state.</p>

                <form onSubmit={handleSubmitLog} className="flex flex-col gap-4">
                  <textarea
                    value={logText}
                    onChange={e => setLogText(e.target.value)}
                    rows={3}
                    placeholder="e.g. Completed integration tests on PostgreSQL node and established Vercel preview routes..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-xs placeholder-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={logStatus === 'submitting' || !logText.trim()}
                    className="py-3 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer self-start flex items-center gap-1.5 min-h-[42px]"
                  >
                    {logStatus === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Synchronizing Commit...
                      </>
                    ) : logStatus === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-400" /> Committed Successfully!
                      </>
                    ) : (
                      <>
                        Submit Log <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Metrics & Payout tracker (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6 w-full">
              {/* Builder performance KPI */}
              <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" /> Builder Metrics
                </h3>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/40 text-[10px] font-mono uppercase">Delivery Precision</span>
                      <span className="text-emerald-400 text-xs font-mono font-bold">98%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-400" style={{ width: '98%' }} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-white/40 text-[10px] font-mono uppercase">Sprint Accuracy</span>
                      <span className="text-primary text-xs font-mono font-bold">92%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout & Financial Records */}
              <div className="glass-card-premium rounded-3xl p-6 border border-white/10">
                <h3 className="text-white font-bold font-display mb-4 text-sm flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" /> Financial Ledger
                </h3>

                <div className="flex flex-col gap-2.5">
                  {[
                    { id: '1042', amount: '$1,250', status: 'Paid', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
                    { id: '1043', amount: '$3,250', status: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  ].map((inv, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                      <div>
                        <p className="text-white text-xs font-medium font-mono">Invoice #{inv.id}</p>
                        <p className="text-white/35 text-[9px] font-mono mt-0.5">Sprint Execution Payout</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-xs">{inv.amount}</p>
                        <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 border rounded ${inv.color} mt-1 inline-block`}>
                          {inv.status}
                        </span>
                      </div>
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
