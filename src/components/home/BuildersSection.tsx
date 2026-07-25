import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Mail, Lock, ArrowUpRight } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useContainBox, BlurredBackdrop } from './useContainBox';

const DARK_BG = '#0B0B0B';
const FRAME_ASPECT = 1600 / 900;

const GLASS_STYLE: React.CSSProperties = {
  background: 'linear-gradient(160deg, rgba(255,255,255,0.065), rgba(255,255,255,0.018))',
  border: '1px solid rgba(255,255,255,0.15)',
  backdropFilter: 'blur(22px) saturate(140%)',
  WebkitBackdropFilter: 'blur(22px) saturate(140%)',
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10), inset 0 0 28px rgba(255,77,6,0.05), 0 20px 60px rgba(0,0,0,0.50)',
};

export default function BuildersSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const box = useContainBox(containerRef, FRAME_ASPECT);
  const fs = (fraction: number) => Math.max(9, box.width * fraction);

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
    <section className="relative w-full h-screen" style={{ backgroundColor: DARK_BG }}>
      <div ref={containerRef} className="absolute inset-0 overflow-hidden">
        <BlurredBackdrop src="/home-scenes/home-6-builders.jpeg" tint={DARK_BG} />
        <img
          src="/home-scenes/home-6-builders.jpeg"
          alt="Galaxa Builder's Program — wanna join the Galaxa team?"
          className="absolute inset-0 w-full h-full object-contain"
        />

        {/* Patch the flat baked-in "STILL NOT / IN" toggle switch — a soft radial fade blends
            better than a hard-edged rectangle against this photographic (non-flat) backdrop. */}
        <div
          style={{
            position: 'absolute',
            left: box.left + box.width * 0.30,
            top: box.top + box.height * 0.895,
            width: box.width * 0.40,
            height: box.height * 0.11,
            background: `radial-gradient(ellipse at 50% 50%, ${DARK_BG} 55%, transparent 78%)`,
          }}
        />

        {/* Real, clickable toggle in its place */}
        <div style={{ position: 'absolute', left: box.left + box.width * 0.5, top: box.top + box.height * 0.925, transform: 'translateX(-50%)' }}>
          <div
            role="switch"
            aria-checked={toggled}
            aria-label="Join the Galaxa Builder's Program"
            onClick={handleToggle}
            className="relative flex items-center rounded-full cursor-pointer select-none hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            style={{
              width: fs(0.175),
              height: fs(0.0325),
              padding: fs(0.003),
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255, 77, 6, 0.25)',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: fs(0.003),
                left: fs(0.003),
                width: fs(0.083),
                height: fs(0.025),
                borderRadius: '999px',
                background: '#FF4D06',
                transform: toggled ? `translateX(${fs(0.086)}px)` : 'translateX(0px)',
                transition: '0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 4px 12px rgba(255, 77, 6, 0.3)',
              }}
            />
            <span style={{ fontSize: fs(0.0075), color: toggled ? 'rgba(255,255,255,0.4)' : '#0B0B0B' }} className="relative z-10 flex-1 text-center font-bold uppercase tracking-wider transition-colors duration-300 font-display">
              Still not
            </span>
            <span style={{ fontSize: fs(0.0075), color: toggled ? '#0B0B0B' : 'rgba(255,255,255,0.4)' }} className="relative z-10 flex-1 text-center font-bold uppercase tracking-wider transition-colors duration-300 font-display">
              In
            </span>
          </div>
        </div>
      </div>

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
                  <h3 className="text-white font-bold text-xl mb-1 font-display">Join the Galaxa Builders</h3>
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
