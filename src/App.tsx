import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import PortfolioView from './components/PortfolioView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import Footer from './components/Footer';
import BuildersProgramView from './components/BuildersProgramView';
import VisitorHubView from './components/visitor-hub/VisitorHubView';
import ClientHubView from './components/client-hub/ClientHubView';
import BuilderHubView from './components/builder-hub/BuilderHubView';
import AdminPanelView from './components/admin/AdminPanelView';
import { AuthProvider } from './context/AuthContext';
import { PageType } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHubRoute = location.pathname.startsWith('/hub') || location.pathname.startsWith('/admin');

  // ── Marketing site state (unchanged) ──────────────────────────────────────
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [inquiryPreset, setInquiryPreset] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dhakaTime, setDhakaTime] = useState<string>('Dhaka HQ');
  const [isDhakaOpen, setIsDhakaOpen] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return () => unsub();
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
    // Hub types redirect to proper routes rather than rendering inline
    if (page === 'visitor-hub') { navigate('/hub/visitor'); return; }
    if (page === 'client-hub') { navigate('/hub/client'); return; }
    if (page === 'builders-program') { navigate('/hub/builder'); return; }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAudit = () => {
    setInquiryPreset('Hi, I want to book a free software audit for my digital brand.');
    setCurrentPage('contact');
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
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageSelect}
          onBookAudit={handleBookAudit}
          dhakaTime={dhakaTime}
          isDhakaOpen={isDhakaOpen}
          currentUser={currentUser}
        />
        <main className="flex-grow">
          {currentPage === 'home' && (
            <HomeView
              onPageChange={handlePageSelect}
              isDhakaOpen={isDhakaOpen}
              dhakaTime={dhakaTime}
              currentUser={currentUser}
              onSetInquiryPreset={setInquiryPreset}
            />
          )}
          {currentPage === 'services' && (
            <ServicesView onPageChange={handlePageSelect} onSetInquiryPreset={setInquiryPreset} />
          )}
          {currentPage === 'portfolio' && <PortfolioView />}
          {currentPage === 'about' && <AboutView />}
          {currentPage === 'contact' && (
            <ContactView inquiryPreset={inquiryPreset} onClearPreset={() => setInquiryPreset('')} />
          )}
          {/* builders-program kept as public marketing/recruitment page */}
          {currentPage === 'builders-program' && (
            <BuildersProgramView currentUser={currentUser} onPageChange={handlePageSelect} />
          )}
        </main>
        <Footer onPageChange={handlePageSelect} dhakaTime={dhakaTime} />
      </div>
    </AuthProvider>
  );
}
