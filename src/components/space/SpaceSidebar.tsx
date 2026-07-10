import { NavLink } from 'react-router-dom';
import { LayoutGrid, TrendingUp, Bookmark, ShieldCheck } from 'lucide-react';
import { SPACE_CATEGORIES } from '../../types/space';
import { CATEGORY_META } from './CategoryIcon';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

interface SidebarLinkProps {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

function SidebarLink({ to, label, icon, end }: SidebarLinkProps) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all ${
          isActive ? 'space-nav-active' : 'text-white/55 hover:text-white hover:bg-white/5 border border-transparent'
        }`
      }
    >
      <span className="w-4 h-4 flex-shrink-0">{icon}</span>
      {label}
    </NavLink>
  );
}

export default function SpaceSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { isSignedIn, isAdmin } = useSpaceAuth();

  return (
    <nav className="flex-1 py-4 px-3 overflow-y-auto no-scrollbar" onClick={onNavigate}>
      <SidebarLink to="/space" end label="All Posts" icon={<LayoutGrid className="w-4 h-4" />} />
      <SidebarLink to="/space?sort=trending" label="Trending" icon={<TrendingUp className="w-4 h-4" />} />
      {isSignedIn && (
        <SidebarLink to="/space/bookmarks" label="Bookmarks" icon={<Bookmark className="w-4 h-4" />} />
      )}

      <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest px-3 mt-6 mb-2">Categories</p>
      {SPACE_CATEGORIES.map((cat) => {
        const meta = CATEGORY_META[cat];
        const Icon = meta.icon;
        return (
          <SidebarLink key={cat} to={`/space/${cat}`} label={meta.label} icon={<Icon className="w-4 h-4" />} />
        );
      })}

      {isAdmin && (
        <>
          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest px-3 mt-6 mb-2">Admin</p>
          <SidebarLink to="/space/admin" label="Moderation" icon={<ShieldCheck className="w-4 h-4" />} />
        </>
      )}
    </nav>
  );
}
