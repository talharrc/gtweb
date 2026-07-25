import { Helmet } from 'react-helmet-async';
import HeroSection from './HeroSection';
import GlobalPresenceSection from './GlobalPresenceSection';
import WhyChooseUsSection from './WhyChooseUsSection';
import ServicesSection from './ServicesSection';
import BillboardSection from './BillboardSection';
import ProcessSection from './ProcessSection';
import PortfolioSection from './PortfolioSection';
import FAQSection from './FAQSection';
import BuildersSection from './BuildersSection';
import ClosingCTASection from './ClosingCTASection';

interface Props {
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
}

export default function HomeView({ isDhakaOpen, dhakaTime }: Props) {
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

      <HeroSection isDhakaOpen={isDhakaOpen} dhakaTime={dhakaTime} />
      <GlobalPresenceSection />
      <WhyChooseUsSection />
      <ServicesSection />
      <BillboardSection />
      <ProcessSection />
      <PortfolioSection />
      <FAQSection />
      <BuildersSection />
      <ClosingCTASection />
    </div>
  );
}
