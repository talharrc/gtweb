import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>{title}</h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyView() {
  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Privacy Policy — GalaxaTech</title>
        <meta name="description" content="GalaxaTech privacy policy — how we collect, use, and protect your data." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-14">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: June 2026 · GalaxaTech, Dhaka, Bangladesh</p>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12">
          <Section title="Who We Are">
            <p>GalaxaTech is a creative tech agency based in Dhaka, Bangladesh. We build digital ecosystems for businesses across 6 countries. This Privacy Policy explains how we handle information when you visit our website or submit a form.</p>
            <p>If you have questions about this policy, contact us at <a href="mailto:mail.galaxatech@gmail.com" className="text-primary hover:underline">mail.galaxatech@gmail.com</a>.</p>
          </Section>

          <Section title="Information We Collect">
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Contact details (name, email, phone number)</li>
              <li>Business information (business name, industry, city)</li>
              <li>Audit request details (website URLs, social media profiles, business challenges)</li>
              <li>Application details (for the Galaxa Builders Program)</li>
              <li>Messages and inquiries submitted through our contact form</li>
            </ul>
            <p>We also collect basic usage data automatically (pages visited, browser type, device) via standard web analytics.</p>
          </Section>

          <Section title="How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Prepare and deliver audit reports you've requested</li>
              <li>Respond to your inquiries via email or WhatsApp</li>
              <li>Review applications to the Galaxa Builders Program</li>
              <li>Understand how our website is used so we can improve it</li>
            </ul>
            <p>We do not use your information for automated profiling or algorithmic decision-making that affects you.</p>
          </Section>

          <Section title="Data Storage and Processors">
            <p>Your form submissions are stored in Google Firebase Firestore, a cloud database service operated by Google LLC. Firebase is our primary data processor.</p>
            <p>We keep data as long as it is necessary for the purposes described in this policy, or as required to respond to your inquiry. You can request deletion at any time.</p>
          </Section>

          <Section title="Who We Share Your Data With">
            <p>We do not sell your personal data to any third party. We do not share your data with advertising networks or data brokers.</p>
            <p>We may share data with service providers who help us operate (such as Firebase / Google) — but only to the extent necessary for those services, and they are bound by their own privacy commitments.</p>
          </Section>

          <Section title="Cookies">
            <p>Our website uses a simple cookie consent preference stored in your browser's local storage. We may also use basic analytics cookies. You can decline these by not accepting our cookie banner — this will not affect your ability to use the site.</p>
          </Section>

          <Section title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access the information we hold about you</li>
              <li>Request correction of any inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p>To exercise any of these rights, contact us at <a href="mailto:mail.galaxatech@gmail.com" className="text-primary hover:underline">mail.galaxatech@gmail.com</a>. We will respond within 30 days.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top of this page. Continued use of our website after changes constitutes acceptance of the updated policy.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
