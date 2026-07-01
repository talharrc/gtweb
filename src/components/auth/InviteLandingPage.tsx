import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type InviteState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'set-password'; email: string; role: string }
  | { status: 'login'; email: string; role: string }
  | { status: 'success' };

export default function InviteLandingPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { applySession } = useAuth();

  const [state, setState] = useState<InviteState>({ status: 'loading' });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setState({ status: 'error', message: 'Invalid invite link.' });
      return;
    }
    fetch(`/api/auth/invite/${token}`, { credentials: 'include' })
      .then(r => r.json())
      .then(async (data) => {
        if (data.error) {
          setState({ status: 'error', message: data.error });
        } else if (data.autoLogin) {
          await applySession({ role: data.role, email: data.email, projectId: data.projectId ?? null });
          setState({ status: 'success' });
          setTimeout(() => {
            navigate(data.role === 'client' ? '/hub/client' : '/hub/builder', { replace: true });
          }, 800);
        } else {
          setState({
            status: data.passwordSet ? 'login' : 'set-password',
            email: data.email,
            role: data.role,
          });
        }
      })
      .catch(() => setState({ status: 'error', message: 'Failed to load invite. Please try again.' }));
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !password.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      await applySession(
        { role: data.role, email: data.email, projectId: data.projectId ?? null },
        data.firebaseToken ?? null,
      );
      setState({ status: 'success' });
      setTimeout(() => {
        navigate(data.role === 'client' ? '/hub/client' : '/hub/builder', { replace: true });
      }, 800);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const isClient = (state as any)?.role === 'client';
  const accentColor = isClient ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = isClient ? 'bg-cyan-500/15' : 'bg-emerald-500/15';
  const accentBorder = isClient ? 'border-cyan-500/30' : 'border-emerald-500/30';
  const btnColor = isClient
    ? 'bg-cyan-500/80 hover:bg-cyan-500'
    : 'bg-emerald-500/80 hover:bg-emerald-500';

  if (state.status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl mb-2">Invite not found</h2>
          <p className="text-white/50 text-sm mb-6">{state.message}</p>
          <p className="text-white/30 text-xs">
            Contact GalaxaTech to receive a valid invite link.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl">Welcome!</h2>
          <p className="text-white/50 text-sm mt-2">Taking you to your hub…</p>
        </div>
      </div>
    );
  }

  const isFirstVisit = state.status === 'set-password';
  const hubLabel = state.role === 'client' ? "Client Hub" : "Builder Hub";

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 rounded-2xl">
        <div className="flex items-center gap-2.5 mb-6">
          <img src="/logo.png" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className={`text-[10px] font-mono mt-0.5 ${accentColor}`}>{hubLabel}</p>
          </div>
        </div>

        <div className={`w-11 h-11 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-center mb-4`}>
          <Lock className={`w-5 h-5 ${accentColor}`} />
        </div>

        <h2 className="text-white font-bold text-xl mb-1">
          {isFirstVisit ? 'Set your password' : 'Welcome back'}
        </h2>
        <p className="text-white/40 text-sm mb-1 font-mono">{state.email}</p>
        <p className="text-white/30 text-xs mb-6">
          {isFirstVisit
            ? 'Choose a password to secure your hub access.'
            : 'Enter your password to continue.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder={isFirstVisit ? 'Create a password (min. 6 chars)' : 'Your password'}
              autoComplete={isFirstVisit ? 'new-password' : 'current-password'}
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25"
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
            disabled={submitting || !password.trim()}
            className={`py-2.5 rounded-xl ${btnColor} text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1`}
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isFirstVisit ? 'Set Password & Enter' : 'Sign In'}
          </button>
        </form>

        <p className="text-white/25 text-[11px] text-center mt-5">
          Your invite link is personal — don't share it.
        </p>
      </div>
    </div>
  );
}
