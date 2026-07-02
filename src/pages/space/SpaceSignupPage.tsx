import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

const USERNAME_PATTERN = /^[a-z0-9_]{3,20}$/;

export default function SpaceSignupPage() {
  const navigate = useNavigate();
  const { signUpWithEmail, signInWithGoogle } = useSpaceAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !username || !displayName) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!USERNAME_PATTERN.test(username)) {
      setError('Username must be 3-20 characters: lowercase letters, numbers, underscores.');
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password, username, displayName);
      navigate('/space');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign up.');
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
      setError(err instanceof Error ? err.message : 'Could not sign up with Google.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto space-card p-8 mt-8">
      <h1 className="text-white font-bold text-2xl mb-1">Join GalaxaSpace</h1>
      <p className="text-space-text-secondary text-sm mb-6">Tools, prompts, builds &amp; AI news — together.</p>

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
        <input type="text" placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="admin-input" />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="admin-input" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="admin-input" />
        <input type="password" placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary-space py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50">
          {loading ? 'Creating account…' : 'Sign up'}
        </button>
      </form>

      <p className="text-space-text-muted text-xs mt-5 text-center">
        Already a member? <Link to="/space/login" className="text-[#22D3EE] hover:underline">Log in</Link>
      </p>
    </div>
  );
}
