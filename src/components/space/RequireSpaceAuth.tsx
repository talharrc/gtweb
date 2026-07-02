import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

export default function RequireSpaceAuth({ children }: { children: ReactNode }) {
  const { isLoading, isSignedIn } = useSpaceAuth();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/space/login" replace />;
  }

  return <>{children}</>;
}
