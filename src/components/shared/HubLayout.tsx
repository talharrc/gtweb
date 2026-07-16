import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from './StatusBadge';

export interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

interface HubLayoutProps {
  title: string;
  navItems: NavItem[];
  activeSection: string;
  onSectionChange: (section: string) => void;
  children: ReactNode;
}

export default function HubLayout({ title, navItems, activeSection, onSectionChange, children }: HubLayoutProps) {
  const navigate = useNavigate();
  const { email, userProfile, signOut, isDemo } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = userProfile?.displayName ?? email?.split('@')[0] ?? null;
  const photoURL: string | null = null;
  const hasUser = email !== null;

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex relative">
      <div className="bg-mesh" />
      <div className="bg-grid-overlay" />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-72 max-w-[85vw] z-40 flex flex-col
        bg-[#0A0717]/90 backdrop-blur-xl border-r border-white/10
        shadow-[8px_0_40px_rgba(0,0,0,0.5)]
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto lg:w-64 lg:max-w-none lg:shadow-none
      `}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <img src="/logo.png" alt="GalaxaTech" className="w-8 h-8 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className="text-primary text-[10px] font-mono mt-1">{title}</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { onSectionChange(item.path); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 lg:py-2.5 rounded-xl mb-1
                  text-sm font-medium transition-all text-left
                  ${isActive
                    ? 'bg-primary/15 text-primary border border-primary/25 shadow-[0_0_20px_rgba(0,82,255,0.15)]'
                    : 'text-white/55 hover:text-white hover:bg-white/5 border border-transparent'
                  }
                `}
              >
                <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          {hasUser && (
            <div className="flex items-center gap-2.5 mb-3">
              {photoURL ? (
                <img src={photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/60 to-secondary/60 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {displayName?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{displayName ?? 'User'}</p>
                {userProfile && <StatusBadge status={userProfile.role} />}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 lg:py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 lg:py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-[#0A0717]/70 backdrop-blur-md sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white p-1 -ml-1">
            <Menu className="w-5 h-5" />
          </button>
          <img src="/logo.png" alt="" className="w-5 h-5 rounded object-contain" />
          <p className="text-white font-semibold text-sm">{title}</p>
          {photoURL && <img src={photoURL} alt="" className="w-7 h-7 rounded-full object-cover ml-auto" />}
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          {isDemo && (
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
              <span className="text-amber-400 text-base">💡</span>
              <div>
                <p className="text-amber-400 text-sm font-semibold">Running in Demo Mode (Local Mock Database)</p>
                <p className="text-white/60 text-xs mt-0.5">
                  Firestore database is not provisioned or failed to connect. Actions you perform will persist locally in your browser. Configure Firestore in <code>.env.local</code> to enable real cloud sync.
                </p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
