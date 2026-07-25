import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mail, Lock, ArrowUpRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { VIEWPORT_DEFAULT } from './motion-tokens';

const GLASS_STYLE: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(255,77,6,0.05), 0 20px 60px rgba(0,0,0,0.50)',
};

export default function BuildersSection() {
  const navigate = useNavigate();
  const [toggled, setToggled] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = () => {
    const next = !toggled;
    setToggled(next);
    if (next) setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'newsletter_subscribers'), { email: email.trim(), joinedAt: serverTimestamp(), source: 'builders_program' });
      setSubmitted(true);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-[#0B0B0B]">
      <div className="absolute top-0 right-0 w-[32%] h-[3px] bg-[#FF4D06]" />
      <span className="barcode-strip absolute bottom-8 right-8 text-white/25 pointer-events-none" />
      <Sparkles className="absolute w-5 h-5 text-[#FF4D06]/25 pointer-events-none" style={{ left: '7%', top: '14%' }} />
      <Sparkles className="absolute w-3.5 h-3.5 text-[#FF4D06]/20 pointer-events-none" style={{ left: '85%', top: '20%' }} />
      <Sparkles className="absolute w-4 h-4 text-[#FF4D06]/20 pointer-events-none" style={{ left: '10%', top: '72%' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black select-none pointer-events-none leading-none whitespace-nowrap" style={{ fontSize: 'clamp(80px, 20vw, 180px)', color: 'rgba(255,77,6,0.04)', fontFamily: 'var(--font-condensed)', letterSpacing: '-0.05em' }}>JOIN</div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_DEFAULT}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto relative z-10"
      >
        <div className="bg-gradient-to-b from-[#151515] via-[#0C0C0C] to-[#050505] rounded-2xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-zinc-800 shadow-black/80 text-center">
          <div className="absolute inset-x-0 top-0 h-px bg-white/5 pointer-events-none" />

          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF4D06]/25 bg-[#FF4D06]/5">
              <Sparkles className="w-3.5 h-3.5 text-[#FF4D06]/70" />
              <span className="text-[10px] font-mono tracking-[0.25em] text-white/80 uppercase font-bold">Introducing</span>
            </div>
          </div>

          <h2 className="display-poster text-white text-4xl sm:text-5xl md:text-7xl mb-2 leading-none">
            Galaxa<br />
            <span style={{ WebkitTextStroke: '2px #FF4D06', color: 'transparent' }}>Builder's</span>{' '}
            <span className="pill-word-brand text-[#0B0B0B] inline-block" style={{ background: '#FF4D06', textShadow: 'none' }}>Program</span>
          </h2>
          <p className="text-[#FF4D06] font-mono text-sm sm:text-base uppercase tracking-[0.2em] mb-6">AI Guru?</p>
          <p className="text-white/60 text-sm sm:text-base mb-10 leading-relaxed max-w-md mx-auto">
            Wanna join the Galaxa team? Flip the switch to join our builders community and be the first to hear about every opportunity.
          </p>

          <div className="flex flex-col items-center gap-4">
            <div
              role="switch"
              aria-checked={toggled}
              aria-label="Join the Galaxa Builder's Program"
              className="relative flex items-center rounded-full p-1 cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
              style={{
                width: '280px',
                height: '52px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255, 77, 6, 0.25)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.2)',
              }}
              onClick={handleToggle}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '5px',
                  left: '5px',
                  width: '132px',
                  height: '40px',
                  borderRadius: '999px',
                  background: '#FF4D06',
                  transform: toggled ? 'translateX(138px)' : 'translateX(0px)',
                  transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 4px 12px rgba(255, 77, 6, 0.3)',
                }}
              />
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? 'rgba(255,255,255,0.4)' : '#0B0B0B' }}>Still not</span>
              <span className="relative z-10 flex-1 text-center text-xs font-bold uppercase tracking-wider transition-colors duration-300 font-display" style={{ color: toggled ? '#0B0B0B' : 'rgba(255,255,255,0.4)' }}>In</span>
            </div>
            <button
              onClick={() => navigate('/gbp')}
              className="text-white/40 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
            >
              Learn more about GBP
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-sm p-5 sm:p-8"
              style={{ ...GLASS_STYLE, borderRadius: '24px', borderColor: 'rgba(255,77,6,0.45)', boxShadow: '0 0 80px rgba(255,77,6,0.30), inset 0 1px 0 rgba(255,255,255,0.1)' }}
            >
              <button
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <X className="w-4 h-4 text-white/60" />
              </button>

              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <Sparkles className="w-8 h-8" style={{ color: '#FF4D06' }} />
                  <p className="text-white font-bold text-lg font-display">You're in the circle.</p>
                  <p className="text-white/40 text-sm">We'll reach out with opportunities first.</p>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full border border-[#FF4D06]/20 flex items-center justify-center mb-5" style={{ background: 'rgba(255,77,6,0.08)' }}>
                    <Mail className="w-5 h-5 text-[#FF4D06]" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-1 font-display">
                    Join the <span className="pill-word-brand text-white inline-block px-1.5 py-0.5 rounded text-sm sm:text-base font-semibold" style={{ background: '#FF4D06' }}>Galaxa</span> Builders
                  </h3>
                  <p className="text-white/45 text-sm mb-5 leading-relaxed">Get early access, opportunities, and builder-only updates.</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label htmlFor="builders-email" className="sr-only">Email address</label>
                    <input
                      id="builders-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                      style={{ background: submitting ? 'rgba(255,77,6,0.5)' : '#FF4D06', color: '#0B0B0B', boxShadow: '0 8px 30px rgba(255,77,6,0.35)' }}
                    >
                      {submitting ? 'Sending…' : <>Join the circle <ArrowUpRight className="w-4 h-4" /></>}
                    </button>
                    <p className="text-white/25 text-[11px] text-center flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" /> No spam. Unsubscribe anytime.
                    </p>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
