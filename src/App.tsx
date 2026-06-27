import { useEffect, useState, ReactNode } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import PortfolioView from './components/PortfolioView';
import PortfolioCaseStudy from './components/PortfolioCaseStudy';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AuditView from './components/AuditView';
import GBPView from './components/GBPView';
import PrivacyView from './components/PrivacyView';
import TermsView from './components/TermsView';
import NotFoundView from './components/NotFoundView';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import VisitorHubView from './components/visitor-hub/VisitorHubView';
import ClientHubView from './components/client-hub/ClientHubView';
import BuilderHubView from './components/builder-hub/BuilderHubView';
import AdminPanelView from './components/admin/AdminPanelView';
import AuthModal from './components/auth/AuthModal';
import PendingScreen from './components/auth/PendingScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DevRoleProvider } from './context/DevRoleContext';
import DevRoleSwitcher from './components/dev/DevRoleSwitcher';
import { PageType, UserRole } from './types';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const PAGE_ROUTES: Record<PageType, string> = {
  home: '/',
  services: '/services',
  portfolio: '/portfolio',
  about: '/about',
  contact: '/contact',
  audit: '/audit',
  gbp: '/gbp',
  privacy: '/privacy',
  terms: '/terms',
  'visitor-hub': '/hub/visitor',
  'client-hub': '/hub/client',
  'builders-program': '/gbp',
};

// Route guard: checks auth, role, and status before rendering children
function RequireRole({ requiredRole, children }: { requiredRole: UserRole | 'admin'; children: ReactNode }) {
  const { isLoading, isSignedIn, role, userProfile, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isSignedIn) {
      openAuthModal();
      navigate('/', { replace: true });
      return;
    }

    if (requiredRole === 'admin' && role !== 'admin') {
      navigate('/', { replace: true });
      return;
    }

    if (requiredRole !== 'admin' && role !== requiredRole && role !== 'admin') {
      navigate('/', { replace: true });
    }
  }, [isLoading, isSignedIn, role, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return null;

  // Admin bypasses all hub guards
  if (role === 'admin' && requiredRole !== 'admin') return <>{children}</>;

  if (requiredRole !== 'admin' && role !== requiredRole) return null;

  // Pending approval screen for client/builder
  if (
    (requiredRole === 'client' || requiredRole === 'builder') &&
    userProfile?.status === 'pending'
  ) {
    return <PendingScreen />;
  }

  return <>{children}</>;
}

function AppInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { firebaseUser, userProfile } = useAuth();
  const isHubRoute = location.pathname.startsWith('/hub') || location.pathname.startsWith('/admin');

  const [dhakaTime, setDhakaTime] = useState<string>('Dhaka HQ');
  const [isDhakaOpen, setIsDhakaOpen] = useState<boolean>(true);

  useEffect(() => {
    const tick = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit',
          second: '2-digit', hour12: true, weekday: 'short',
        };
        setDhakaTime(new Intl.DateTimeFormat('en-US', options).format(new Date()));
        const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
        setIsDhakaOpen(d.getDay() >= 0 && d.getDay() <= 4 && d.getHours() >= 10 && d.getHours() < 18);
      } catch { setDhakaTime('UTC+6 BD Standard'); setIsDhakaOpen(true); }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handlePageSelect = (page: PageType) => {
    const route = PAGE_ROUTES[page] || '/';
    navigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isHubRoute) {
    return (
      <div className="min-h-screen relative">
        <div className="bg-mesh" />
        <div className="bg-grid-overlay" />
        <ScrollToTop />
        <Routes>
          <Route path="/hub/visitor/*" element={
            <RequireRole requiredRole="visitor">
              <VisitorHubView />
            </RequireRole>
          } />
          <Route path="/hub/client/*" element={
            <RequireRole requiredRole="client">
              <ClientHubView />
            </RequireRole>
          } />
          <Route path="/hub/builder/*" element={
            <RequireRole requiredRole="builder">
              <BuilderHubView />
            </RequireRole>
          } />
          <Route path="/admin/*" element={
            <RequireRole requiredRole="admin">
              <AdminPanelView />
            </RequireRole>
          } />
        </Routes>
        <AuthModal />
        <DevRoleSwitcher />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      <div className="bg-mesh" />
      <div className="bg-grid-overlay" />
      <ScrollToTop />
      <Navbar
        onPageChange={handlePageSelect}
        dhakaTime={dhakaTime}
        isDhakaOpen={isDhakaOpen}
        currentUser={
          firebaseUser && userProfile
            ? { displayName: userProfile.displayName, photoURL: userProfile.photoURL, email: userProfile.email }
            : null
        }
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomeView isDhakaOpen={isDhakaOpen} dhakaTime={dhakaTime} currentUser={null} />} />
          <Route path="/services"          element={<ServicesView />} />
          <Route path="/portfolio"         element={<PortfolioView />} />
          <Route path="/portfolio/:slug"   element={<PortfolioCaseStudy />} />
          <Route path="/about"             element={<AboutView />} />
          <Route path="/contact"           element={<ContactView />} />
          <Route path="/audit"             element={<AuditView />} />
          <Route path="/gbp"               element={<GBPView />} />
          <Route path="/builders-program"  element={<Navigate to="/gbp" replace />} />
          <Route path="/privacy"           element={<PrivacyView />} />
          <Route path="/terms"             element={<TermsView />} />
          <Route path="*"                  element={<NotFoundView />} />
        </Routes>
      </main>
      <Footer onPageChange={handlePageSelect} dhakaTime={dhakaTime} />
      <CookieBanner />
      <AuthModal />
      <DevRoleSwitcher />
    </div>
  );
}

export default function App() {
  return (
    <DevRoleProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </DevRoleProvider>
  );
}
