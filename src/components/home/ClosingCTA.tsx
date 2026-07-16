import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowUpRight, Lock } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function ClosingCTA() {
  const [subEmail, setSubEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email: subEmail.trim(), joinedAt: serverTimestamp() });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(14,31,20,0.30) 50%, transparent 100%)' }}>
      {/* Single restrained atmospheric glow */}
      <div className="breathe-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#16C95A]/6 blur-[160px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto relative z-10"
      >
        <div className="bg-gradient-to-b from-[#070B1F] via-[#050806] to-[#010208] rounded-[36px] p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-primary/20 shadow-primary/10 text-center">
          {/* Inset top highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-white/5 pointer-events-none" />

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/25 bg-primary/5">
              <Sparkles className="w-3.5 h-3.5 text-primary/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-bold">Builders Community</span>
            </div>
          </div>

          <h2 className="display-sora text-white text-3xl sm:text-4xl md:text-5xl mb-4 leading-tight">
            Join the{' '}
            <span className="pill-word-accent text-white inline-block" style={{ background: 'linear-gradient(135deg, #2BFF6E, #7CFFC2)' }}>Galaxa</span>{' '}
            circle
          </h2>
          <p className="text-white/60 text-sm sm:text-base mb-8 leading-relaxed max-w-md mx-auto">
            Get early access, opportunities, and builder-only updates from the team.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Sparkles className="w-8 h-8" style={{ color: '#2BFF6E' }} />
              <p className="text-white font-bold text-lg font-display">You're in the circle.</p>
              <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
              <label htmlFor="circle-email" className="sr-only">Email address</label>
              <input
                id="circle-email"
                type="email"
                placeholder="you@example.com"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                required
                autoComplete="email"
                className="flex-1 px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
              />
              <button
                type="submit"
                disabled={submitting}
                className="btn-shine flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
                style={{ background: submitting ? 'rgba(43,255,110,0.5)' : 'linear-gradient(135deg, #2BFF6E, #7CFFC2)', boxShadow: '0 8px 30px rgba(43,255,110,0.35)' }}
              >
                {submitting ? 'Sending…' : <>Join <ArrowUpRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}
          {!submitted && (
            <p className="text-white/25 text-[11px] text-center flex items-center justify-center gap-1 mt-4">
              <Lock className="w-3 h-3" /> No spam. Unsubscribe anytime.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
