import { useEffect, useState, ReactNode } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Loader2, ChevronUp, MessageCircle, Link } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
import AdminLoginForm from './components/admin/AdminLoginForm';
import InviteLandingPage from './components/auth/InviteLandingPage';
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
  'visitor-hub': '/hub/visitor',
  'client-hub': '/hub/client',
  'builders-program': '/gbp',
};

// Shown when a hub route is accessed without a valid JWT session
function HubAccessDenied({ hubRole }: { hubRole: 'client' | 'builder' }) {
  const isClient = hubRole === 'client';
  const accentColor = isClient ? 'text-cyan-400' : 'text-emerald-400';
  const accentBg = isClient ? 'bg-cyan-500/15' : 'bg-emerald-500/15';
  const accentBorder = isClient ? 'border-cyan-500/30' : 'border-emerald-500/30';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 rounded-2xl text-center">
        <div className={`w-11 h-11 rounded-xl ${accentBg} border ${accentBorder} flex items-center justify-center mx-auto mb-4`}>
          <Link className={`w-5 h-5 ${accentColor}`} />
        </div>
        <h2 className="text-white font-bold text-xl mb-2">Enter your invite link</h2>
        <p className="text-white/50 text-sm mb-2">
          Access to the {isClient ? 'Client' : 'Builder'} Hub is by invite only.
        </p>
        <p className="text-white/30 text-xs">
          Check your email for the invite link sent by GalaxaTech, or contact us to get one.
        </p>
      </div>
    </div>
  );
}

// Route guard for hub and admin routes
function RequireRole({ requiredRole, children }: { requiredRole: UserRole | 'admin'; children: ReactNode }) {
  const { isLoading, isSignedIn, role } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Admin gate: show login form instead of redirecting
  if (requiredRole === 'admin') {
    if (!isSignedIn || role !== 'admin') return <AdminLoginForm />;
    return <>{children}</>;
  }

  // Admin can access any hub
  if (isSignedIn && role === 'admin') return <>{children}</>;

  if (!isSignedIn || role !== requiredRole) {
    const hubRole = (requiredRole === 'client' || requiredRole === 'builder') ? requiredRole : 'client';
    return <HubAccessDenied hubRole={hubRole} />;
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
          <Route path="/hub/invite/:token" element={<InviteLandingPage />} />
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
<<<<<<< HEAD
      <AuthModal />
      <DevRoleSwitcher />
      <ScrollToTopButton />
      <WhatsAppButton />
=======
>>>>>>> 5e444eb (feat: replace Firebase Auth with invite-link based custom auth system)
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
