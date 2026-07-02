import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Search, Menu, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';

export default function SpaceHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isSignedIn, spaceProfile, signOutSpace } = useSpaceAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const searchQuery = searchParams.get('q') ?? '';

  const onSearchChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('q', value); else next.delete('q');
    setSearchParams(next, { replace: true });
  };

  const handleSignOut = async () => {
    await signOutSpace();
    setMenuOpen(false);
    navigate('/space');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#05030A]/90 backdrop-blur-md border-b border-white/5">
      <div className="px-4 py-3 flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden text-white/60 hover:text-white">
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/space" className="flex items-center gap-2 flex-shrink-0">
          <span className="font-display font-black text-lg tracking-tight text-space-gradient">GalaxaSpace</span>
        </Link>

        <div className="relative flex-1 max-w-md ml-2 hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search tools, prompts, posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7C3AED]/50 focus:ring-1 focus:ring-[#7C3AED]/20 transition-all"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {isSignedIn ? (
            <>
              <button
                onClick={() => navigate('/space/create')}
                className="btn-primary-space flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> <span className="hidden sm:inline">New Post</span>
              </button>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white overflow-hidden"
                >
                  {spaceProfile?.avatarUrl ? (
                    <img src={spaceProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{spaceProfile?.displayName?.[0]?.toUpperCase() ?? '?'}</span>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-11 w-44 space-card p-1.5 z-50">
                    {spaceProfile && (
                      <Link
                        to={`/space/profile/${spaceProfile.username}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
                      >
                        <UserIcon className="w-4 h-4" /> Profile
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/70 hover:text-white hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/space/login')}
                className="px-3 py-2 rounded-full text-white/70 hover:text-white text-xs font-semibold transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/space/signup')}
                className="btn-primary-space px-4 py-2 rounded-full text-white text-xs font-bold"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </div>

      <div className="sm:hidden px-4 pb-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            placeholder="Search tools, prompts, posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#7C3AED]/50 transition-all"
          />
        </div>
      </div>
    </header>
  );
}
