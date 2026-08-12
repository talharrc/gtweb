import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import HeroSection from './HeroSection';
import ServicesSection from './ServicesSection';
import BillboardSection from './BillboardSection';
import ProcessSection from './ProcessSection';
import PortfolioSection from './PortfolioSection';
import BuildersSection from './BuildersSection';
import HomeFooterSection from './HomeFooterSection';

interface Props {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

export default function HomeView({ isDhakaOpen, dhakaTime }: Props) {
  const [isPreloading, setIsPreloading] = useState(() => {
    // Only play preloader on first load of the session
    return !sessionStorage.getItem('gt-preloaded');
  });

  useEffect(() => {
    if (isPreloading) {
      const timer = setTimeout(() => {
        setIsPreloading(false);
        sessionStorage.setItem('gt-preloaded', 'true');
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isPreloading]);

  return (
    <div className="relative bg-[#F2ECE6] text-[#0B0B0B]">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands worldwide." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'GalaxaTech',
          url: 'https://gt-web-iota.vercel.app',
          description: 'Systems-driven creative tech agency',
          address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
        })}</script>
      </Helmet>

      {/* Preloader Overlay */}
      <AnimatePresence>
        {isPreloading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-[#F2ECE6] flex flex-col justify-center items-center pointer-events-none"
          >
            {/* Center-aligned logo and wordmark */}
            <div className="flex flex-col items-center gap-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Sun icon / logo */}
                <motion.img
                  layoutId="app-logo-image"
                  src="/logo-dark.png"
                  alt="GalaxaTech Logo"
                  className="w-20 h-20 object-contain"
                />
              </motion.div>
              <motion.span
                layoutId="app-logo-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="font-display text-3xl uppercase tracking-wider text-[#0B0B0B]"
              >
                GalaxaTech
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeInOut" }}
                className="w-16 h-[2px] bg-[#FF4D06] origin-center mt-2"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <HeroSection isDhakaOpen={isDhakaOpen} dhakaTime={dhakaTime} isPreloading={isPreloading} />
      <ServicesSection />
      <BillboardSection />
      <ProcessSection />
      <PortfolioSection />
      <BuildersSection />
      <HomeFooterSection />
    </div>
  );
}
