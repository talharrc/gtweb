import { FormEvent, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Mail, Lock, Eye, EyeOff, Loader2, UserCheck,
} from 'lucide-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import brandmarkLogo from '../../assets/images/logo.png';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ?? 'mail.galaxatech@gmail.com';

type Tab = 'login' | 'signup';
type SignupRole = 'visitor' | 'client' | 'builder';

const ROLES: { value: SignupRole; label: string; desc: string; color: string }[] = [
  { value: 'visitor', label: 'Visitor', desc: 'Browse resources, prompts & insights.', color: 'pink' },
  { value: 'client', label: 'Client', desc: 'Track your project progress & documents.', color: 'cyan' },
  { value: 'builder', label: 'Builder', desc: 'Manage projects, payments & deliverables.', color: 'emerald' },
];

const ROLE_COLORS: Record<SignupRole, string> = {
  visitor: 'border-pink-500/60 bg-pink-500/10',
  client: 'border-cyan-500/60 bg-cyan-500/10',
  builder: 'border-emerald-500/60 bg-emerald-500/10',
};

function firebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<SignupRole>('visitor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!authModalOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setLoading(false);
      setShowPassword(false);
      setSelectedRole('visitor');
    }
  }, [authModalOpen]);

  const resetErrors = () => setError('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), password);
      closeAuthModal();
      if (result.user.email === ADMIN_EMAIL) {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(firebaseErrorMessage(err?.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const status = selectedRole === 'visitor' ? 'approved' : 'pending';
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: cred.user.email ?? email.trim(),
        role: selectedRole,
        status,
        displayName: email.trim().split('@')[0],
        photoURL: '',
        createdAt: serverTimestamp(),
      });
      closeAuthModal();
      if (selectedRole === 'visitor') navigate('/hub/visitor');
    } catch (err: any) {
      setError(firebaseErrorMessage(err?.code ?? ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={closeAuthModal}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-[101] flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="glass-card w-full max-w-sm rounded-2xl p-7 pointer-events-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <img src={brandmarkLogo} alt="GalaxaTech" className="w-7 h-7 rounded-lg object-contain" />
                  <span className="text-white font-bold text-sm">GalaxaTech</span>
                </div>
                <button
                  onClick={closeAuthModal}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
                {(['login', 'signup'] as Tab[]).map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); resetErrors(); }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      tab === t
                        ? 'bg-primary text-white shadow'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {t === 'login' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Login form */}
              {tab === 'login' && (
                <form onSubmit={handleLogin} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); resetErrors(); }}
                      placeholder="Email address"
                      autoComplete="email"
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); resetErrors(); }}
                      placeholder="Password"
                      autoComplete="current-password"
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
                    disabled={loading || !email.trim() || !password.trim()}
                    className="mt-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sign In
                  </button>

                  <p className="text-center text-white/30 text-xs mt-1">
                    No account?{' '}
                    <button
                      type="button"
                      onClick={() => { setTab('signup'); resetErrors(); }}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Sign up
                    </button>
                  </p>
                </form>
              )}

              {/* Signup form */}
              {tab === 'signup' && (
                <form onSubmit={handleSignup} className="flex flex-col gap-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); resetErrors(); }}
                      placeholder="Email address"
                      autoComplete="email"
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/25"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); resetErrors(); }}
                      placeholder="Password (min. 6 characters)"
                      autoComplete="new-password"
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

                  {/* Role picker */}
                  <div className="mt-1">
                    <div className="flex items-center gap-1.5 mb-2">
                      <UserCheck className="w-3.5 h-3.5 text-white/40" />
                      <p className="text-white/50 text-xs font-semibold">I am a…</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {ROLES.map(r => (
                        <label
                          key={r.value}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedRole === r.value
                              ? ROLE_COLORS[r.value]
                              : 'border-white/10 bg-white/[0.02] hover:border-white/20'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={r.value}
                            checked={selectedRole === r.value}
                            onChange={() => setSelectedRole(r.value)}
                            className="mt-0.5 accent-primary"
                          />
                          <div>
                            <p className="text-white font-semibold text-xs">{r.label}</p>
                            <p className="text-white/45 text-[11px] mt-0.5">{r.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-xs px-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading || !email.trim() || !password.trim()}
                    className="mt-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Account
                  </button>

                  <p className="text-center text-white/30 text-xs mt-1">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setTab('login'); resetErrors(); }}
                      className="text-primary hover:text-primary/80 font-semibold transition-colors"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
