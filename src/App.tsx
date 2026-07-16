import { useEffect, useState, ReactNode } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, ChevronUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import PortfolioView from './components/PortfolioView';
import PortfolioCaseStudy from './components/PortfolioCaseStudy';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AuditView from './components/AuditView';
import StoreLayout from './components/store/StoreLayout';
import StoreHomeView from './pages/store/StoreHomeView';
import ProductDetailPage from './pages/store/ProductDetailPage';
import GBPView from './components/GBPView';
import PrivacyView from './components/PrivacyView';
import TermsView from './components/TermsView';
import NotFoundView from './components/NotFoundView';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import VisitorHubView from './components/visitor-hub/VisitorHubView';
import SpaceRoutes from './components/space/SpaceRoutes';
import ClientHubView from './components/client-hub/ClientHubView';
import BuilderHubView from './components/builder-hub/BuilderHubView';
import CustomerHubView from './components/customer-hub/CustomerHubView';
import AdminPanelView from './components/admin/AdminPanelView';
import AdminLoginForm from './components/admin/AdminLoginForm';
import TestAdminPanel from './components/admin/TestAdminPanel';
import CustomerAuthGate from './components/auth/CustomerAuthGate';
import PassLoginForm from './components/auth/PassLoginForm';
import { AuthProvider, useAuth } from './context/AuthContext';
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
  'visitor-hub': '/space',
  'client-hub': '/client',
  'builders-program': '/gbp',
};

// Roles that use the passcode pattern (never show a loading spinner — render
// the login form or the gated content instantly, using a localStorage hint to
// optimistically render the content for a returning, still-valid session
// while /api/auth/me silently reconfirms it in the background).
const NO_SPIN_HINT_KEYS: Partial<Record<UserRole | 'admin', string>> = {
  admin: 'gt_admin_ui',
  client: 'gt_client_ui',
  builder: 'gt_builder_ui',
};

// Route guard for hub and admin routes
function RequireRole({ requiredRole, children }: { requiredRole: UserRole | 'admin'; children: ReactNode }) {
  const { isLoading, isSignedIn, role } = useAuth();
  const location = useLocation();

  const isRoleSignedIn = isSignedIn && role === requiredRole;
  const hintKey = NO_SPIN_HINT_KEYS[requiredRole];

  // Once auth has settled and it turns out the session doesn't match this
  // role, drop the optimistic hint so a stale/expired session doesn't keep
  // flashing the gated content on reload.
  useEffect(() => {
    if (hintKey && !isLoading && !isRoleSignedIn) {
      localStorage.removeItem(hintKey);
    }
  }, [hintKey, isLoading, isRoleSignedIn]);

  // Allow demo bypass
  const queryParams = new URLSearchParams(location.search);
  if (queryParams.get('demo') === 'true') {
    return <>{children}</>;
  }

  // Admin gate: never spins. Renders the panel instantly if already signed in,
  // or optimistically while a prior login's hint is being silently reconfirmed
  // in the background; otherwise renders the login form instantly.
  if (requiredRole === 'admin') {
    const hasHint = localStorage.getItem('gt_admin_ui') === '1';
    const showPanel = isRoleSignedIn || (isLoading && hasHint);
    return showPanel ? <>{children}</> : <AdminLoginForm />;
  }

  // Client/builder gate: same never-spin passcode pattern as admin. Admin can
  // also walk straight into any hub once its own session has resolved.
  if (requiredRole === 'client' || requiredRole === 'builder') {
    const hasHint = hintKey ? localStorage.getItem(hintKey) === '1' : false;
    const isAdminOverride = isSignedIn && role === 'admin';
    const showHub = isRoleSignedIn || isAdminOverride || (isLoading && hasHint);
    if (showHub) return <>{children}</>;
    return (
      <PassLoginForm
        role={requiredRole}
        title={requiredRole === 'client' ? 'Client Hub' : 'Builder Hub'}
        endpoint={`/api/auth/${requiredRole}`}
        storageHintKey={hintKey!}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Customer gate: self-serve sign in/up instead of the invite-only screen
  if (requiredRole === 'customer') {
    if (!isSignedIn || role !== 'customer') return <CustomerAuthGate />;
    return <>{children}</>;
  }

  return <>{children}</>;
}

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          className="fixed bottom-24 right-4 sm:right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95"
          style={{
            background: 'rgba(10,7,23,0.75)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}
        >
          <ChevronUp className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/8801959209103"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-4 sm:right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-semibold text-sm transition-all hover:scale-105 active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #25d366 0%, #128c48 100%)',
        boxShadow: '0 4px 20px rgba(37,211,102,0.35)',
      }}
    >
      <MessageCircle className="w-4 h-4 flex-shrink-0" />
      <span className="hidden sm:inline">WhatsApp Us</span>
    </a>
  );
}

function AppInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, userProfile } = useAuth();
  const isTestAdminRoute = location.pathname.startsWith('/test-admin');
  const isHubRoute = location.pathname.startsWith('/hub') || location.pathname.startsWith('/admin')
    || location.pathname.startsWith('/client') || location.pathname.startsWith('/builder');
  const isStoreRoute = location.pathname.startsWith('/browse');
  const isSpaceRoute = location.pathname.startsWith('/space');

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

  if (isTestAdminRoute) {
    return <TestAdminPanel />;
  }

  if (isHubRoute) {
    return (
      <div className="min-h-screen relative">
        <div className="bg-mesh" />
        <div className="bg-grid-overlay" />
        <ScrollToTop />
        <Routes>
          <Route path="/hub/visitor/*" element={<VisitorHubView />} />
          <Route path="/client/*" element={
            <RequireRole requiredRole="client">
              <ClientHubView />
            </RequireRole>
          } />
          <Route path="/builder/*" element={
            <RequireRole requiredRole="builder">
              <BuilderHubView />
            </RequireRole>
          } />
          <Route path="/hub/customer/*" element={
            <RequireRole requiredRole="customer">
              <CustomerHubView />
            </RequireRole>
          } />
          <Route path="/admin/*" element={
            <RequireRole requiredRole="admin">
              <AdminPanelView />
            </RequireRole>
          } />
        </Routes>
      </div>
    );
  }

  if (isStoreRoute) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/browse" element={<StoreHomeView />} />
            <Route path="/browse/product/:slug" element={<ProductDetailPage />} />
          </Route>
        </Routes>
      </>
    );
  }

  if (isSpaceRoute) {
    return (
      <>
        <ScrollToTop />
        <SpaceRoutes />
      </>
    );
  }

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      <div className="bg-mesh" />
      <div className="bg-grid-overlay" />
      <div className="grain-overlay" />
      <ScrollToTop />
      <Navbar
        onPageChange={handlePageSelect}
        dhakaTime={dhakaTime}
        isDhakaOpen={isDhakaOpen}
        currentUser={
          email && userProfile
            ? { displayName: userProfile.displayName, photoURL: '', email }
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
      <ScrollToTopButton />
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MotionConfig reducedMotion="user">
        <AppInner />
      </MotionConfig>
    </AuthProvider>
  );
}
