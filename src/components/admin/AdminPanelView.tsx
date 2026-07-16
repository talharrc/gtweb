import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  FolderOpen, Inbox, Image, Store, Compass, GraduationCap, Settings,
} from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import AdminAuditSubmissions from './AdminAuditSubmissions';
import AdminProjectsSection from './AdminProjectsSection';
import AdminPortfolioSection from './AdminPortfolioSection';
import AdminBlankSection from './AdminBlankSection';
import AdminSiteSettings from './AdminSiteSettings';

const navItems: NavItem[] = [
  { label: 'Audit Requests',    path: 'audits',    icon: <Inbox className="w-4 h-4" /> },
  { label: 'Projects',          path: 'projects',  icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Portfolio Manager', path: 'portfolio', icon: <Image className="w-4 h-4" /> },
  { label: 'Galaxa Store',      path: 'store',     icon: <Store className="w-4 h-4" /> },
  { label: 'Galaxa Space',      path: 'space',     icon: <Compass className="w-4 h-4" /> },
  { label: "Galaxa Builder's Program", path: 'gbp', icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Settings',          path: 'settings',  icon: <Settings className="w-4 h-4" /> },
];

// Auth guard is handled by RequireRole in App.tsx — this component renders only for admins.
export default function AdminPanelView() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = location.pathname.split('/admin/')[1]?.split('/')[0] ?? 'audits';

  return (
    <HubLayout
      title="Admin Panel"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(s) => navigate(`/admin/${s}`)}
    >
      <Routes>
        <Route index element={<AdminAuditSubmissions />} />
        <Route path="audits"    element={<AdminAuditSubmissions />} />
        <Route path="projects"  element={<AdminProjectsSection />} />
        <Route path="portfolio" element={<AdminPortfolioSection />} />
        <Route path="store"     element={<AdminBlankSection title="Galaxa Store" />} />
        <Route path="space"     element={<AdminBlankSection title="Galaxa Space" />} />
        <Route path="gbp"       element={<AdminBlankSection title="Galaxa Builder's Program" />} />
        <Route path="settings"  element={<AdminSiteSettings />} />
      </Routes>
    </HubLayout>
  );
}
