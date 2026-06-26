import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import brandmarkLogo from '../../assets/images/logo.png';

export default function PendingScreen() {
  const { signOut, userProfile } = useAuth();

  const roleLabel = userProfile?.role === 'client' ? 'Client' : 'Builder';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
        <img
          src={brandmarkLogo}
          alt="GalaxaTech"
          className="w-10 h-10 rounded-xl object-contain mx-auto mb-5"
        />

        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-5">
          <Clock className="w-7 h-7 text-amber-400" />
        </div>

        <h2 className="text-white font-bold text-xl mb-2">Pending Verification</h2>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          Your {roleLabel} account is pending verification.
          We'll notify you once approved — usually within 24 hours.
        </p>

        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 mb-6">
          <p className="text-amber-300/70 text-xs leading-relaxed">
            Signed in as{' '}
            <span className="font-mono text-amber-300">{userProfile?.email}</span>
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
