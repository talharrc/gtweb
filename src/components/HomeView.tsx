import { Helmet } from 'react-helmet-async';
import useIsMobile from '../hooks/useIsMobile';
import Hero from './home/Hero';
import GlobalPresence from './home/GlobalPresence';
import WhyChooseUs from './home/WhyChooseUs';
import WhatWeBuild from './home/WhatWeBuild';
import HowWeWork from './home/HowWeWork';
import SelectedWork from './home/SelectedWork';
import FAQ from './home/FAQ';
import ClosingCTA from './home/ClosingCTA';

interface HomeViewProps {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

export default function HomeView({}: HomeViewProps) {
  const isMobile = useIsMobile();

  return (
    <div className="relative bg-[#0B0710]">
      <Helmet>
        <title>GalaxaTech — Ecosystems, Optimized</title>
        <meta name="description" content="GalaxaTech is a systems-driven creative tech agency from Dhaka, building digital ecosystems for brands worldwide." />
        <meta property="og:title" content="GalaxaTech — Ecosystems, Optimized" />
        <meta property="og:description" content="Systems-driven creative tech agency. Web, App, Social, AI, Brand, and Consulting." />
        <script type="application/ld+json">{JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", "name": "GalaxaTech", "url": "https://gt-web-iota.vercel.app", "description": "Systems-driven creative tech agency", "address": { "@type": "PostalAddress", "addressLocality": "Dhaka", "addressCountry": "BD" } })}</script>
      </Helmet>

      <Hero isMobile={isMobile} />
      <GlobalPresence isMobile={isMobile} />
      <WhyChooseUs />
      <WhatWeBuild isMobile={isMobile} />
      <HowWeWork />
      <SelectedWork isMobile={isMobile} />
      <FAQ />
      <ClosingCTA />
    </div>
  );
}
