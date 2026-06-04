import { useState, FormEvent } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Lock, FolderOpen, Users, CreditCard, FileText, ClipboardList, BookOpen, Shield } from 'lucide-react';
import HubLayout, { NavItem } from '../shared/HubLayout';
import RoleGuard from '../shared/RoleGuard';
import AdminProjectsSection from './AdminProjectsSection';
import AdminUsersSection from './AdminUsersSection';
import AdminPaymentsSection from './AdminPaymentsSection';
import AdminDocumentsSection from './AdminDocumentsSection';
import AdminFormsSection from './AdminFormsSection';
import AdminContentSection from './AdminContentSection';

const PASSCODE = 'gtgonnarock';

const navItems: NavItem[] = [
  { label: 'Projects', path: 'projects', icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Users', path: 'users', icon: <Users className="w-4 h-4" /> },
  { label: 'Payments', path: 'payments', icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Documents', path: 'documents', icon: <FileText className="w-4 h-4" /> },
  { label: 'Forms', path: 'forms', icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Content', path: 'content', icon: <BookOpen className="w-4 h-4" /> },
];

export default function AdminPanelView() {
  const [unlocked, setUnlocked] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = location.pathname.split('/admin/')[1]?.split('/')[0] ?? 'projects';

  const handlePasscode = (e: FormEvent) => {
    e.preventDefault();
    if (input === PASSCODE) {
      setUnlocked(true);
    } else {
      setError('Incorrect passcode.');
      setInput('');
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-white font-bold text-xl mb-1">Admin Panel</h2>
          <p className="text-white/40 text-sm mb-6">Enter your access code to continue.</p>
          <form onSubmit={handlePasscode} className="flex flex-col gap-3">
            <input
              type="password"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
              placeholder="Passcode"
              autoFocus
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-center tracking-widest"
            />
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin']}>
      <HubLayout
        title="Admin Panel"
        navItems={navItems}
        activeSection={activeSection}
        onSectionChange={(s) => navigate(`/admin/${s}`)}
      >
        <Routes>
          <Route index element={<AdminProjectsSection />} />
          <Route path="projects" element={<AdminProjectsSection />} />
          <Route path="users" element={<AdminUsersSection />} />
          <Route path="payments" element={<AdminPaymentsSection />} />
          <Route path="documents" element={<AdminDocumentsSection />} />
          <Route path="forms" element={<AdminFormsSection />} />
          <Route path="content" element={<AdminContentSection />} />
        </Routes>
      </HubLayout>
    </RoleGuard>
  );
}
