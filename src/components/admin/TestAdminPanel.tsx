import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Lock, ShieldCheck } from 'lucide-react';

// Fully self-contained diagnostic page: no AuthContext, no RequireRole, no
// HubLayout, no Firestore. Talks only to /api/test-admin (a standalone
// serverless function, not the big api/index.ts one) to isolate whether that
// function is the reason the real admin login hangs in production.
export default function TestAdminPanel() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/test-admin', { credentials: 'include' })
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/test-admin', {
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
      setAuthed(true);
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/test-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ logout: true }),
      });
    } catch {}
    setAuthed(false);
    setPassword('');
  };

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0717' }}>
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0717', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
        <ShieldCheck className="w-10 h-10 text-primary" />
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Test Admin Panel</h1>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>You're in. This dashboard is intentionally empty — diagnostic only.</p>
        <button
          onClick={handleSignOut}
          style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer' }}
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0717', padding: '1.5rem' }}>
      <div style={{ maxWidth: '24rem', width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '2rem' }}>
        <h2 style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.25rem' }}>Test admin access</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Diagnostic-only panel. Enter the passcode.</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Lock style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '1rem', height: '1rem', color: 'rgba(255,255,255,0.3)' }} />
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              placeholder="Passcode"
              autoFocus
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.6rem 0.75rem 0.6rem 2.25rem', color: 'white', fontSize: '0.875rem' }}
            />
          </div>
          {error && <p style={{ color: '#f87171', fontSize: '0.75rem' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            style={{ padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(59,130,246,0.8)', color: 'white', fontWeight: 600, fontSize: '0.875rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading || !password.trim() ? 0.5 : 1 }}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
