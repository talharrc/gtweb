import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Users, Clock, DollarSign, BookOpen, Monitor, PhoneCall } from 'lucide-react';

const FAQS = [
  { icon: Users, q: 'What kind of businesses do you work with?', a: 'We work with startups, SMEs, and established businesses across multiple countries, primarily in tech, e-commerce, and service industries.' },
  { icon: Clock, q: 'How long does a typical project take?', a: 'Timelines vary by scope. A website takes 2–4 weeks; a full app can take 6–10 weeks. We agree on timelines upfront.' },
  { icon: DollarSign, q: 'How does pricing work?', a: 'Projects are quoted individually based on scope. We provide a detailed proposal before any agreement is signed.' },
  { icon: BookOpen, q: 'What is the Galaxa Builders Program?', a: 'GBP is our execution ecosystem for students. Real projects, real tasks, real output. Not a course — an experience.' },
  { icon: Monitor, q: 'How do I track my project?', a: 'Every client gets access to a dedicated Client Hub — a private dashboard with live progress, updates, documents, and direct team contact.' },
  { icon: PhoneCall, q: 'Can I book a free consultation?', a: "Yes. Book an audit or reach out via WhatsApp. We'll respond within 24 hours." },
];

export default function FAQ() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  return (
    <section className="py-10 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(14,31,20,0.20) 60%, transparent 100%)' }}>
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-[#2BFF6E]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-primary/75 tracking-[0.3em] uppercase block mb-3">05 — FAQ</span>
            <h2 className="display-sora text-4xl sm:text-5xl md:text-6xl mb-6">
              <span className="block text-white">Common</span>
              <span className="pill-word-accent text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: 'linear-gradient(135deg, #2BFF6E, #7CFFC2)' }}>Questions.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            Everything you need to know before working with us.
          </motion.p>
        </div>

        <div className="flex flex-col gap-2">
          {FAQS.map((faq, i) => {
            const FaqIcon = faq.icon;
            const isActive = activeFAQ === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className="faq-item rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(238,255,246, 0.95)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,1)',
                  border: `1px solid ${isActive ? 'rgba(43,255,110,0.55)' : 'rgba(124,255,194,0.22)'}`,
                  transition: 'border-color 0.25s',
                }}
              >
                <button
                  onClick={() => setActiveFAQ(isActive ? null : i)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left cursor-pointer"
                >
                  <FaqIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ color: '#2BFF6E', transform: isActive ? 'scale(1.15)' : 'scale(1)' }} />
                  <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: isActive ? '#050806' : '#334155' }}>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ transform: isActive ? 'rotate(90deg)' : 'none', color: isActive ? '#2BFF6E' : 'rgba(43,255,110,0.35)' }} />
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-slate-600 text-sm leading-relaxed px-4 pb-4 pl-11">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
