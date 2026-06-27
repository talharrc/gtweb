import { ReactNode, FormEvent, useState } from 'react';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { AUTH_DISABLED } from '../../config';
import brandmarkLogo from '../../assets/images/logo.png';

interface CredentialsLoginGuardProps {
  role: 'client' | 'builder';
  children: ReactNode;
}

export default function CredentialsLoginGuard({ role, children }: CredentialsLoginGuardProps) {
  const { isSignedIn, role: currentRole, isLoading, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (AUTH_DISABLED) return <>{children}</>;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Admin can access any hub
  if (isSignedIn && currentRole === 'admin') return <>{children}</>;

  // Correct role for this hub
  if (isSignedIn && currentRole === role) return <>{children}</>;

  // Signed in but wrong role
  if (isSignedIn && currentRole !== role && currentRole !== 'visitor') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
          <Lock className="w-8 h-8 text-red-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-lg mb-2">Access Denied</h2>
          <p className="text-white/50 text-sm mb-6">
            Your account does not have access to the {role === 'client' ? "Client's" : "Builder's"} Hub.
          </p>
          <button
            onClick={signOut}
            className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all"
          >
            Sign out and try another account
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Firebase Auth: username@gt.hub convention
      await signInWithEmailAndPassword(auth, `${username.trim().toLowerCase()}@gt.hub`, password);
      // AuthContext onAuthStateChanged will fire and load role from Firestore
    } catch (err: any) {
      const code = err?.code ?? '';
      if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setError('Username or password is incorrect.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again in a few minutes.');
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const hubLabel = role === 'client' ? "Client's Hub" : "Builder's Hub";
  const accentColor = role === 'client' ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = role === 'client' ? 'bg-cyan-500/15' : 'bg-emerald-500/15';
  const accentBorder = role === 'client' ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const btnColor = role === 'client'
    ? 'bg-cyan-500/80 hover:bg-cyan-500'
    : 'bg-emerald-500/80 hover:bg-emerald-500';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 rounded-2xl">
        <div className="flex items-center gap-2.5 mb-6">
          <img src={brandmarkLogo} alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className={`text-[10px] font-mono mt-0.5 ${accentColor}`}>{hubLabel}</p>
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-center mb-4`}>
          <Lock className={`w-5 h-5 ${accentColor}`} />
        </div>
        <h2 className="text-white font-bold text-xl mb-1">Sign in</h2>
        <p className="text-white/40 text-sm mb-6">
          Enter the credentials provided by GalaxaTech to access your hub.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            value={username}
            onChange={e => { setUsername(e.target.value); setError(''); }}
            placeholder="Username"
            autoComplete="username"
            autoFocus
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 font-mono"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !username.trim() || !password.trim()}
            className={`py-2.5 rounded-xl ${btnColor} text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1`}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-white/25 text-[11px] text-center mt-5">
          Don't have credentials? Contact GalaxaTech.
        </p>
      </div>
    </div>
  );
}
