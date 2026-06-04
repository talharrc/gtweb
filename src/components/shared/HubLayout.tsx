import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Home, LogOut } from 'lucide-react';
import { logout } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import brandmarkLogo from '../../assets/images/galaxatech_revised_logo_1780005309031.png';
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
  const { userProfile, firebaseUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 flex flex-col
        bg-[#070d1e] border-r border-white/5
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative lg:z-auto
      `}>
        {/* Brand */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <img src={brandmarkLogo} alt="GalaxaTech" className="w-7 h-7 rounded-lg object-contain" />
          <div>
            <p className="text-white font-bold text-sm leading-none">GalaxaTech</p>
            <p className="text-white/40 text-[10px] font-mono mt-0.5">{title}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-white/40 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeSection === item.path;
            return (
              <button
                key={item.path}
                onClick={() => { onSectionChange(item.path); setSidebarOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1
                  text-sm font-medium transition-all text-left
                  ${isActive
                    ? 'bg-primary/15 text-primary border border-primary/20'
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

        {/* User + signout */}
        <div className="p-4 border-t border-white/5">
          {firebaseUser && (
            <div className="flex items-center gap-2.5 mb-3">
              {firebaseUser.photoURL ? (
                <img src={firebaseUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center text-primary text-xs font-bold">
                  {firebaseUser.displayName?.[0] ?? '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">{firebaseUser.displayName}</p>
                {userProfile && <StatusBadge status={userProfile.role} />}
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all"
            >
              <Home className="w-3.5 h-3.5" /> Home
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-xs transition-all"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#070d1e]/80 backdrop-blur-sm sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-white/60 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>
          <p className="text-white font-semibold text-sm">{title}</p>
          {firebaseUser?.photoURL && (
            <img src={firebaseUser.photoURL} alt="" className="w-7 h-7 rounded-full object-cover ml-auto" />
          )}
        </div>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
