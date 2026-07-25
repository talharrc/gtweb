import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { FAQS } from './data';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function FAQSection() {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(0);

  return (
    <section className="py-20 px-6 relative overflow-hidden bg-[#F2ECE6] border-b border-zinc-200">
      <div className="absolute top-0 right-1/4 w-[350px] h-[350px] bg-white/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">07 — FAQ</span>
            <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
              <span className="block text-[#0B0B0B]">Common</span>
              <span className="pill-word-brand text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: '#FF4D06' }}>Questions.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7, delay: 0.2 }} className="text-zinc-600 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-zinc-200 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-zinc-300 sm:pl-6">
            Everything you need to know before working with us.
          </motion.p>
        </div>

        <div className="flex flex-col gap-2.5">
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
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: `1px solid ${isActive ? 'rgba(255,77,6,0.35)' : 'rgba(11,11,11,0.06)'}`,
                  transition: 'border-color 0.25s',
                }}
              >
                <button
                  onClick={() => setActiveFAQ(isActive ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left cursor-pointer focus:outline-none"
                >
                  <FaqIcon className="w-4 h-4 flex-shrink-0" style={{ color: isActive ? '#FF4D06' : 'rgba(255,77,6,0.55)' }} />
                  <span className="text-sm font-semibold flex-1 leading-snug" style={{ color: isActive ? '#0B0B0B' : 'rgba(11,11,11,0.75)' }}>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform duration-200" style={{ transform: isActive ? 'rotate(90deg)' : 'none', color: isActive ? '#FF4D06' : 'rgba(11,11,11,0.25)' }} />
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
                      <p className="text-zinc-600 text-sm leading-relaxed px-5 pb-5 pl-12 border-t border-zinc-200/40 pt-2">{faq.a}</p>
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
