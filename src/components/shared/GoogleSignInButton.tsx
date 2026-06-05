import React, { useState } from 'react';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';
import { getCredentialByUsername } from '../../services/credentialService';
import { signInLocalWithUid } from '../../lib/localAuth';

interface CredentialLoginProps {
  label?: string;
  className?: string;
}

export default function CredentialLogin({ label = 'Log In', className = '' }: CredentialLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setLoading(true);
    setError('');
    try {
      const cred = await getCredentialByUsername(username.trim().toLowerCase());
      if (!cred || cred.password !== password) {
        setError('Invalid username or password.');
        return;
      }
      signInLocalWithUid(cred.uid, cred.username, cred.displayName, cred.role, cred.projectId);
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 w-full ${className}`}>
      <input
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
        autoComplete="username"
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        autoComplete="current-password"
        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50"
      />
      {error && (
        <p className="text-red-400 text-xs flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading || !username.trim() || !password.trim()}
        className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white font-semibold text-sm transition-all disabled:opacity-40 cursor-pointer"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
        {label}
      </button>
    </form>
  );
}
