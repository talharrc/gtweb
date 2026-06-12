import { useState, FormEvent } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Lock, FolderOpen, Users, CreditCard, FileText, ClipboardList,
  BookOpen, LayoutDashboard, Inbox, GraduationCap, UserSearch,
  Settings, Loader2, LogOut, Chrome,
} from 'lucide-react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import HubLayout, { NavItem } from '../shared/HubLayout';
import AdminDashboard from './AdminDashboard';
import AdminProjectsSection from './AdminProjectsSection';
import AdminUsersSection from './AdminUsersSection';
import AdminPaymentsSection from './AdminPaymentsSection';
import AdminDocumentsSection from './AdminDocumentsSection';
import AdminFormsSection from './AdminFormsSection';
import AdminContentSection from './AdminContentSection';
import AdminAuditSubmissions from './AdminAuditSubmissions';
import AdminGBPApplications from './AdminGBPApplications';
import AdminLeads from './AdminLeads';
import AdminSiteSettings from './AdminSiteSettings';

const PASSCODE = 'gtgonnarock';
const ADMIN_EMAIL = 'mail.galaxatech@gmail.com';

const navItems: NavItem[] = [
  { label: 'Dashboard',    path: 'dashboard',  icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: 'Projects',     path: 'projects',   icon: <FolderOpen className="w-4 h-4" /> },
  { label: 'Users',        path: 'users',       icon: <Users className="w-4 h-4" /> },
  { label: 'Payments',     path: 'payments',   icon: <CreditCard className="w-4 h-4" /> },
  { label: 'Documents',    path: 'documents',  icon: <FileText className="w-4 h-4" /> },
  { label: 'Forms',        path: 'forms',       icon: <ClipboardList className="w-4 h-4" /> },
  { label: 'Content',      path: 'content',    icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Audits',       path: 'audits',     icon: <Inbox className="w-4 h-4" /> },
  { label: 'GBP Apps',    path: 'gbp',         icon: <GraduationCap className="w-4 h-4" /> },
  { label: 'Leads',        path: 'leads',       icon: <UserSearch className="w-4 h-4" /> },
  { label: 'Site Settings',path: 'settings',   icon: <Settings className="w-4 h-4" /> },
];

export default function AdminPanelView() {
  const { isAdmin, isLoading } = useAuth();
  const [passcodeUnlocked, setPasscodeUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const activeSection = location.pathname.split('/admin/')[1]?.split('/')[0] ?? 'dashboard';

  const handlePasscode = (e: FormEvent) => {
    e.preventDefault();
    if (passcodeInput === PASSCODE) {
      setPasscodeUnlocked(true);
      setPasscodeError('');
    } else {
      setPasscodeError('Incorrect passcode.');
      setPasscodeInput('');
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setGoogleError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        setGoogleError(`Access denied. Only ${ADMIN_EMAIL} can access this panel.`);
        setPasscodeUnlocked(false);
      }
    } catch (err: any) {
      setGoogleError(err?.message ?? 'Sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Step 1: Passcode gate
  if (!passcodeUnlocked && !isAdmin) {
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
              value={passcodeInput}
              onChange={e => { setPasscodeInput(e.target.value); setPasscodeError(''); }}
              placeholder="Passcode"
              autoFocus
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/50 text-center tracking-widest"
            />
            {passcodeError && <p className="text-red-400 text-xs">{passcodeError}</p>}
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

  // Step 2: Google Sign-In (after passcode)
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-white font-bold text-xl mb-1">Verify Identity</h2>
          <p className="text-white/40 text-sm mb-6">
            Sign in with the admin Google account to continue.
          </p>
          {googleError && (
            <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
              {googleError}
            </p>
          )}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 rounded-xl bg-white text-[#05030F] text-sm font-bold transition-all flex items-center justify-center gap-2 hover:bg-white/90 disabled:opacity-60"
          >
            {googleLoading
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : <Chrome className="w-4 h-4" />
            }
            Sign in with Google
          </button>
          <button
            onClick={() => setPasscodeUnlocked(false)}
            className="mt-3 text-white/30 text-xs hover:text-white/60 transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  // Authenticated admin panel
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
        <Route path="projects" element={<AdminProjectsSection />} />
        <Route path="users"    element={<AdminUsersSection />} />
        <Route path="payments" element={<AdminPaymentsSection />} />
        <Route path="documents" element={<AdminDocumentsSection />} />
        <Route path="forms"    element={<AdminFormsSection />} />
        <Route path="content"  element={<AdminContentSection />} />
        <Route path="audits"   element={<AdminAuditSubmissions />} />
        <Route path="gbp"      element={<AdminGBPApplications />} />
        <Route path="leads"    element={<AdminLeads />} />
        <Route path="settings" element={<AdminSiteSettings />} />
      </Routes>
    </HubLayout>
  );
}
