import { FormEvent, useState } from 'react';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginForm() {
  const { applySession } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed.');
        return;
      }
      await applySession(
        { role: 'admin', email: data.email ?? 'mail.galaxatech@gmail.com', projectId: null },
        data.firebaseToken ?? null,
      );
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 rounded-2xl">
        <div className="flex items-center gap-2.5 mb-6">
          <img src="/gtnew.jpeg" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className="text-[10px] font-mono mt-0.5 text-primary">Admin Panel</p>
          </div>
        </div>

        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>

        <h2 className="text-white font-bold text-xl mb-1">Admin access</h2>
        <p className="text-white/40 text-sm mb-6">Enter your admin password to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Admin password"
              autoComplete="current-password"
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
            disabled={loading || !password.trim()}
            className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-white/20 text-[11px] text-center mt-5">
          This panel is not publicly linked anywhere.
        </p>
      </div>
    </div>
  );
}
