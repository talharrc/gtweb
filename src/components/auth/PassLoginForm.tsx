import { FormEvent, useState } from 'react';
import { Key, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface PassLoginFormProps {
  role: 'client' | 'builder';
  title: string;
  endpoint: string;
  storageHintKey: string;
}

// Shared login form for /client and /builder — mirrors AdminLoginForm.tsx's
// design and flow exactly, but the credential is a per-project signed "pass"
// (a JWT minted by /api/admin/generate-passes) instead of a fixed password.
export default function PassLoginForm({ role, title, endpoint, storageHintKey }: PassLoginFormProps) {
  const { applySession } = useAuth();
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pass.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ pass: pass.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Login failed.');
        return;
      }
      localStorage.setItem(storageHintKey, '1');
      await applySession({ role, email: data.email ?? '', projectId: data.projectId ?? null, projectName: data.projectName ?? null });
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
          <img src="/logo.png" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className="text-[10px] font-mono mt-0.5 text-primary">{title}</p>
          </div>
        </div>

        <div className="w-11 h-11 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center mb-4">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>

        <h2 className="text-white font-bold text-xl mb-1">{title} access</h2>
        <p className="text-white/40 text-sm mb-6">Paste the access pass GalaxaTech sent you to continue.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="relative">
            <Key className="absolute left-3 top-3.5 w-4 h-4 text-white/30" />
            <textarea
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              placeholder="Paste your access pass"
              autoFocus
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white text-xs font-mono placeholder:text-white/30 placeholder:font-sans placeholder:text-sm focus:outline-none focus:border-white/25 resize-none"
            />
          </div>

          {error && <p className="text-red-400 text-xs px-1">{error}</p>}

          <button
            type="submit"
            disabled={loading || !pass.trim()}
            className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>

        <p className="text-white/20 text-[11px] text-center mt-5">
          Don't have a pass? Contact GalaxaTech for access.
        </p>
      </div>
    </div>
  );
}
