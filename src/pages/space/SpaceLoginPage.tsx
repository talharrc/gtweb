import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

export default function SpaceLoginPage() {
  const navigate = useNavigate();
  const { signInWithEmail, signInWithGoogle } = useSpaceAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Enter your email and password.'); return; }
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      navigate('/space');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/space');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-card p-8 mt-8">
      <h1 className="text-white font-bold text-2xl mb-1">Log in to GalaxaSpace</h1>
      <p className="text-space-text-secondary text-sm mb-6">Join the community feed, post, and comment.</p>

      <button
        onClick={handleGoogle}
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all mb-4 disabled:opacity-50"
      >
        Continue with Google
      </button>

      <div className="flex items-center gap-3 my-4">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-space-text-muted text-xs">or</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="admin-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="admin-input"
        />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary-space py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50">
          {loading ? 'Signing in…' : 'Log in'}
        </button>
      </form>

      <p className="text-space-text-muted text-xs mt-5 text-center">
        No account yet? <Link to="/space/signup" className="text-[#22D3EE] hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
