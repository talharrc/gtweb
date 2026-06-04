import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import PortfolioView from './components/PortfolioView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import Footer from './components/Footer';
import VisitorHubView from './components/VisitorHubView';
import ClientHubView from './components/ClientHubView';
import BuildersProgramView from './components/BuildersProgramView';
import { PageType } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [inquiryPreset, setInquiryPreset] = useState<string>('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Dynamic Dhaka clock values
  const [dhakaTime, setDhakaTime] = useState<string>('Dhaka HQ');
  const [isDhakaOpen, setIsDhakaOpen] = useState<boolean>(true);

  // Monitor user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Dynamic real-time calculated ticker for Studio Status
  useEffect(() => {
    const tickDhakaClock = () => {
      try {
        const options: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Dhaka',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          weekday: 'short'
        };
        const formatter = new Intl.DateTimeFormat('en-US', options);
        setDhakaTime(formatter.format(new Date()));

        // Dhaka Time is UTC+6
        const dhakaDate = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
        const day = dhakaDate.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday
        const hours = dhakaDate.getHours();

        // Standard BD office hours: Sun to Thu, 10:00 AM - 6:00 PM (10 to 18)
        const workingDay = day >= 0 && day <= 4; 
        const workingHour = hours >= 10 && hours < 18;

        setIsDhakaOpen(workingDay && workingHour);
      } catch (e) {
        setDhakaTime('UTC+6 BD Standard');
        setIsDhakaOpen(true);
      }
    };

    tickDhakaClock();
    const clockInterval = setInterval(tickDhakaClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const handlePageSelect = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBookAudit = () => {
    setInquiryPreset('Hi, I want to book a free software audit for my digital brand.');
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      {/* Dynamic abstract grid mesh in background */}
      <div className="bg-mesh" />

      {/* Shared Float Nav Bar */}
      <Navbar 
        currentPage={currentPage}
        onPageChange={handlePageSelect}
        onBookAudit={handleBookAudit}
        dhakaTime={dhakaTime}
        isDhakaOpen={isDhakaOpen}
        currentUser={currentUser}
      />

      {/* Pages Viewports */}
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
          <ServicesView 
            onPageChange={handlePageSelect}
            onSetInquiryPreset={setInquiryPreset}
          />
        )}
        {currentPage === 'portfolio' && (
          <PortfolioView />
        )}
        {currentPage === 'about' && (
          <AboutView />
        )}
        {currentPage === 'contact' && (
          <ContactView 
            inquiryPreset={inquiryPreset}
            onClearPreset={() => setInquiryPreset('')}
          />
        )}
        {currentPage === 'visitor-hub' && (
          <VisitorHubView onPageChange={handlePageSelect} />
        )}
        {currentPage === 'client-hub' && (
          <ClientHubView currentUser={currentUser} onPageChange={handlePageSelect} />
        )}
        {currentPage === 'builders-program' && (
          <BuildersProgramView currentUser={currentUser} onPageChange={handlePageSelect} />
        )}
      </main>

      {/* Unified Brand Footer */}
      <Footer 
        onPageChange={handlePageSelect}
        dhakaTime={dhakaTime}
      />
    </div>
  );
}
