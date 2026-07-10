import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { SpaceAuthProvider } from '../../context/SpaceAuthContext';
import SpaceHeader from './SpaceHeader';
import SpaceSidebar from './SpaceSidebar';

function SpaceLayoutInner() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen text-space-text flex" style={{ colorScheme: 'dark' }}>
      <div className="space-bg-mesh" />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-[#0B0714]/95 border-r border-white/5
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:relative lg:z-auto
        `}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <span className="font-display font-black text-base text-space-gradient">GalaxaSpace</span>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <SpaceSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <SpaceHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function SpaceLayout() {
  return (
    <SpaceAuthProvider>
      <SpaceLayoutInner />
    </SpaceAuthProvider>
  );
}
