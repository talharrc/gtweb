import { LogOut, FolderOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Deliberately minimal — no Firestore reads, nothing that can hang or spin.
// Everything shown here comes straight from the session (set at login time
// via the pass), so this hub renders instantly. Real project data, chat,
// documents etc. can be layered back in later.
export default function ClientHubView() {
  const { email, projectName, signOut } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-md w-full p-8 rounded-2xl text-center">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>

        <h1 className="text-white font-bold text-xl mb-1">Client Hub</h1>
        <p className="text-white/40 text-sm mb-6">{email}</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 mb-6 text-left">
          <FolderOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider font-mono mb-0.5">Project</p>
            <p className="text-white text-sm font-semibold">{projectName ?? 'Not set'}</p>
          </div>
        </div>

        <p className="text-white/30 text-xs mb-6">
          Your dashboard is being built out. Check back soon for project updates, documents, and messages.
        </p>

        <button
          onClick={signOut}
          className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
