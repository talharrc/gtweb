import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../types';
import { AUTH_DISABLED } from '../../config';
import { useDevRole } from '../../context/DevRoleContext';

const ROLE_NAV: Record<UserRole, string> = {
  visitor: '/',
  client: '/hub/client',
  builder: '/hub/builder',
  admin: '/admin',
};

const ROLES: { role: UserRole; label: string; cls: string }[] = [
  { role: 'visitor', label: 'Visitor', cls: 'border-pink-500/40 text-pink-300 bg-pink-500/10 hover:bg-pink-500/20' },
  { role: 'client',  label: 'Client',  cls: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20' },
  { role: 'builder', label: 'Builder', cls: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20' },
  { role: 'admin',   label: 'Admin',   cls: 'border-primary/40 text-primary bg-primary/10 hover:bg-primary/20' },
];

function DevRoleSwitcherInner() {
  const { devRole, setDevRole } = useDevRole();
  const navigate = useNavigate();

  useEffect(() => {
    console.warn(
      '[DevRoleSwitcher] DEV-ONLY: role switcher active. Set AUTH_DISABLED=false in src/config.ts before shipping.',
    );
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-1.5 pointer-events-none">
      <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Dev Role</span>
      <div className="flex gap-1 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl p-1.5 pointer-events-auto">
        {ROLES.map(({ role, label, cls }) => (
          <button
            key={role}
            onClick={() => { setDevRole(role); navigate(ROLE_NAV[role]); }}
            className={`px-3 py-1 rounded-lg border text-[11px] font-bold transition-all ${cls} ${
              devRole === role ? 'opacity-100 ring-1 ring-white/20' : 'opacity-40 hover:opacity-90'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Outer guard ensures this is never rendered when AUTH_DISABLED=false.
// The inner component holds all hooks so rules-of-hooks are satisfied.
export default function DevRoleSwitcher() {
  if (!AUTH_DISABLED) return null;
  return <DevRoleSwitcherInner />;
}
