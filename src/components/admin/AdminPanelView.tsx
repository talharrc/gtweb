import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  FolderOpen, Users, CreditCard, FileText, ClipboardList,
  BookOpen, LayoutDashboard, Inbox, GraduationCap, UserSearch,
  Settings, Store, ShoppingCart,
} from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import AdminDashboard from './AdminDashboard';
import AdminProjectsSection from './AdminProjectsSection';
import AdminUsersSection from './AdminUsersSection';
import AdminPaymentsSection from './AdminPaymentsSection';
import AdminProductsSection from './AdminProductsSection';
import AdminOrdersSection from './AdminOrdersSection';
import AdminDocumentsSection from './AdminDocumentsSection';
import AdminFormsSection from './AdminFormsSection';
import AdminContentSection from './AdminContentSection';
import AdminAuditSubmissions from './AdminAuditSubmissions';
import AdminGBPApplications from './AdminGBPApplications';
import AdminLeads from './AdminLeads';
import AdminSiteSettings from './AdminSiteSettings';

const navItems: NavItem[] = [
  { label: 'Dashboard',    path: 'dashboard',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Projects',     path: 'projects',   icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Users',        path: 'users',       icon: <Users className="w-4 h-4" /> },
  { label: 'Payments',     path: 'payments',   icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Store Products', path: 'store-products', icon: <Store className="w-4 h-4" /> },
  { label: 'Store Orders',   path: 'store-orders',   icon: <ShoppingCart className="w-4 h-4" /> },
  { label: 'Documents',    path: 'documents',  icon: <FileText className="w-4 h-4" /> },
  { label: 'Forms',        path: 'forms',       icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Content',      path: 'content',    icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Audits',       path: 'audits',     icon: <Inbox className="w-4 h-4" /> },
  { label: 'GBP Apps',    path: 'gbp',         icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Leads',        path: 'leads',       icon: <UserSearch className="w-4 h-4" /> },
  { label: 'Site Settings',path: 'settings',   icon: <Settings className="w-4 h-4" /> },
];

// Auth guard is handled by RequireRole in App.tsx — this component renders only for admins.
export default function AdminPanelView() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = location.pathname.split('/admin/')[1]?.split('/')[0] ?? 'dashboard';

  return (
    <HubLayout
      title="Admin Panel"
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(s) => navigate(`/admin/${s}`)}
    >
      <Routes>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects"  element={<AdminProjectsSection />} />
        <Route path="users"     element={<AdminUsersSection />} />
        <Route path="payments"  element={<AdminPaymentsSection />} />
        <Route path="store-products" element={<AdminProductsSection />} />
        <Route path="store-orders"   element={<AdminOrdersSection />} />
        <Route path="documents" element={<AdminDocumentsSection />} />
        <Route path="forms"     element={<AdminFormsSection />} />
        <Route path="content"   element={<AdminContentSection />} />
        <Route path="audits"    element={<AdminAuditSubmissions />} />
        <Route path="gbp"       element={<AdminGBPApplications />} />
        <Route path="leads"     element={<AdminLeads />} />
        <Route path="settings"  element={<AdminSiteSettings />} />
      </Routes>
    </HubLayout>
  );
}
