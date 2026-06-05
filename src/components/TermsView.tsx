import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>{title}</h2>
      <div className="text-white/60 text-sm leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function TermsView() {
  return (
    <div className="relative pt-32 pb-24">
      <Helmet>
        <title>Terms of Service — GalaxaTech</title>
        <meta name="description" content="GalaxaTech terms of service — website use, intellectual property, and limitation of liability." />
      </Helmet>

      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-14">
          <h1 className="text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: June 2026 · GalaxaTech, Dhaka, Bangladesh</p>
        </div>

        <div className="glass-card rounded-2xl p-8 md:p-12">
          <Section title="Acceptance of Terms">
            <p>By accessing or using the GalaxaTech website (gt-web-iota.vercel.app), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.</p>
            <p>GalaxaTech reserves the right to modify these terms at any time. Continued use of the website after any modification constitutes your acceptance of the new terms.</p>
          </Section>

          <Section title="Use of the Website">
            <p>You may use our website for lawful purposes only. You agree not to:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Use the website in any way that violates applicable local, national, or international laws or regulations</li>
              <li>Transmit any unsolicited or unauthorized advertising or promotional material</li>
              <li>Attempt to gain unauthorized access to any part of the website or its systems</li>
              <li>Use the website to transmit harmful, offensive, or misleading content</li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            <p>All content on this website — including but not limited to text, graphics, logos, images, design elements, and code — is the property of GalaxaTech and is protected by applicable intellectual property laws.</p>
            <p>You may not reproduce, distribute, modify, or create derivative works from any content on this website without our prior written permission.</p>
            <p>Work delivered to clients as part of a paid project is subject to the terms of the individual project agreement, which supersedes these general terms for that specific work.</p>
          </Section>

          <Section title="Audit Reports — Informational Only">
            <p>Audit reports prepared and delivered by GalaxaTech are provided for informational purposes only. They represent our professional assessment at a point in time, based on information available to us.</p>
            <p>GalaxaTech does not guarantee any specific outcomes, results, or improvements as a result of audit recommendations. Implementation of recommendations is solely at the client's discretion and risk.</p>
            <p>Audit reports are not to be construed as legal, financial, or regulatory advice.</p>
          </Section>

          <Section title="Limitation of Liability">
            <p>To the fullest extent permitted by applicable law, GalaxaTech and its team members shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of this website or any services described on it.</p>
            <p>GalaxaTech's total liability for any claims arising out of or related to your use of the website shall not exceed the amount paid by you to GalaxaTech in the twelve months preceding the claim, if any.</p>
          </Section>

          <Section title="Third-Party Links">
            <p>Our website may contain links to third-party websites. GalaxaTech is not responsible for the content, privacy practices, or terms of any third-party websites. Links are provided for convenience only and do not constitute an endorsement.</p>
          </Section>

          <Section title="Governing Law">
            <p>These terms are governed by the laws of Bangladesh. Any disputes arising from these terms or your use of the website shall be subject to the exclusive jurisdiction of the courts of Dhaka, Bangladesh.</p>
          </Section>

          <Section title="Contact">
            <p>If you have any questions about these Terms of Service, contact us at <a href="mailto:mail.galaxatech@gmail.com" className="text-primary hover:underline">mail.galaxatech@gmail.com</a>.</p>
          </Section>
        </div>
      </div>
    </div>
  );
}
