import { ReactNode } from 'react';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

export default function AdminGate({ children }: { children: ReactNode }) {
  const { isLoading, isAdmin } = useSpaceAuth();

  if (isLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#7C3AED] animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-card max-w-sm mx-auto p-8 text-center mt-12">
        <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-5 h-5 text-red-400" />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Admins only</h2>
        <p className="text-white/50 text-sm">This area is restricted to GalaxaSpace admins.</p>
      </div>
    );
  }

  return <>{children}</>;
}
