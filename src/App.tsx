import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
import { AuthProvider } from './context/AuthContext';
import { PageType } from './types';
import { getLocalSession, LocalSession } from './lib/localAuth';

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

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHubRoute = location.pathname.startsWith('/hub') || location.pathname.startsWith('/admin');

  const [currentUser, setCurrentUser] = useState<LocalSession | null>(() => getLocalSession());
  const [dhakaTime, setDhakaTime] = useState<string>('Dhaka HQ');
  const [isDhakaOpen, setIsDhakaOpen] = useState<boolean>(true);

  useEffect(() => {
    const handle = () => setCurrentUser(getLocalSession());
    window.addEventListener('gt-auth-change', handle);
    return () => window.removeEventListener('gt-auth-change', handle);
  }, []);

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

  // ── Hub / Admin routes ─────────────────────────────────────────────────────
  if (isHubRoute) {
    return (
      <AuthProvider>
        <div className="min-h-screen relative">
          <div className="bg-mesh" />
          <ScrollToTop />
          <Routes>
            <Route path="/hub/visitor/*" element={<VisitorHubView />} />
            <Route path="/hub/client/*" element={<ClientHubView />} />
            <Route path="/hub/builder/*" element={<BuilderHubView />} />
            <Route path="/admin/*" element={<AdminPanelView />} />
          </Routes>
        </div>
      </AuthProvider>
    );
  }

  // ── Marketing site ─────────────────────────────────────────────────────────
  return (
    <AuthProvider>
      <div className="min-h-screen relative flex flex-col justify-between">
        <div className="bg-mesh" />
        <ScrollToTop />
        <Navbar
          onPageChange={handlePageSelect}
          dhakaTime={dhakaTime}
          isDhakaOpen={isDhakaOpen}
          currentUser={currentUser}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomeView isDhakaOpen={isDhakaOpen} dhakaTime={dhakaTime} currentUser={currentUser} />} />
            <Route path="/services" element={<ServicesView />} />
            <Route path="/portfolio" element={<PortfolioView />} />
            <Route path="/portfolio/:slug" element={<PortfolioCaseStudy />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/contact" element={<ContactView />} />
            <Route path="/audit" element={<AuditView />} />
            <Route path="/gbp" element={<GBPView />} />
            <Route path="/builders-program" element={<Navigate to="/gbp" replace />} />
            <Route path="/privacy" element={<PrivacyView />} />
            <Route path="/terms" element={<TermsView />} />
            <Route path="*" element={<NotFoundView />} />
          </Routes>
        </main>
        <Footer onPageChange={handlePageSelect} dhakaTime={dhakaTime} />
        <CookieBanner />
      </div>
    </AuthProvider>
  );
}
