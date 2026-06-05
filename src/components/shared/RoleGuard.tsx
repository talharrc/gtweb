import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import GoogleSignInButton from './GoogleSignInButton';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
  requireAuth?: boolean;
}

export default function RoleGuard({ allowedRoles, children, requireAuth = true }: RoleGuardProps) {
  const { isSignedIn, role, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (requireAuth && !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 text-center rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">Access required</h2>
          <p className="text-white/50 text-sm mb-6">
            Enter your credentials to access this area.
          </p>
          <GoogleSignInButton />
        </div>
      </div>
    );
  }

  if (isSignedIn && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 text-center rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-secondary/15 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="text-white font-bold text-lg mb-2">No access yet</h2>
          <p className="text-white/50 text-sm mb-6">
            Your account doesn't have access to this area. Please contact GalaxaTech to be provisioned.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-sm transition-all"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
