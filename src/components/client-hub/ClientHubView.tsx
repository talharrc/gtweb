import { LogOut, FolderOpen, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Deliberately minimal — no Firestore reads, nothing that can hang or spin.
// Everything shown here comes straight from the session (set at login time
// via the pass), so this hub renders instantly. Real project data, chat,
// documents etc. can be layered back in later.
export default function ClientHubView() {
  const { email, projectName, signOut } = useAuth();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="glass-card max-w-md w-full p-6 sm:p-8 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(34,211,238,0.15)]">
          <ShieldCheck className="w-5 h-5 text-cyan-400" />
        </div>

        <h1 className="text-white font-bold text-xl sm:text-2xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Client Hub</h1>
        <p className="text-white/40 text-sm mb-6 break-all">{email}</p>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4 flex items-center gap-3 mb-6 text-left">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white/35 text-[10px] uppercase tracking-wider font-mono mb-0.5">Project</p>
            <p className="text-white text-sm font-semibold truncate">{projectName ?? 'Not set'}</p>
          </div>
        </div>

        <p className="text-white/30 text-xs leading-relaxed mb-6">
          Your dashboard is being built out. Check back soon for project updates, documents, and messages.
        </p>

        <button
          onClick={signOut}
          className="w-full py-3 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
