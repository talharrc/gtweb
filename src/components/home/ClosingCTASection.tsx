import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { VIEWPORT_DEFAULT } from './motion-tokens';

export default function ClosingCTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 sm:py-32 px-6 relative overflow-hidden bg-[#F2ECE6] text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-[#FF4D06]/4 blur-[110px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT_DEFAULT}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto relative z-10"
      >
        <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-4">08 — Let's Build</span>
        <h2 className="text-[#0B0B0B] text-4xl sm:text-5xl font-bold tracking-tight mb-6">
          Ready to <span className="text-[#FF4D06]">start?</span>
        </h2>
        <p className="text-zinc-600 text-base sm:text-lg max-w-md mx-auto mb-10 leading-relaxed">
          Tell us about your business in 5 minutes — we'll map out exactly how to grow your digital presence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/audit')}
            className="group flex items-center gap-4 py-3.5 px-8 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.03] active:scale-[0.98] w-full sm:w-auto justify-center shadow-xl bg-[#FF4D06] hover:bg-[#E03C00] text-white"
          >
            <span className="w-9 h-9 bg-white/10 text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500 flex-shrink-0">
              <ArrowUpRight className="w-4.5 h-4.5" />
            </span>
            <span className="text-sm font-semibold tracking-wider uppercase font-mono">Book an Audit</span>
          </button>
          <button
            onClick={() => navigate('/portfolio')}
            className="group flex items-center gap-3 text-zinc-800 hover:text-[#0B0B0B] font-semibold py-3.5 px-7 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-zinc-300 hover:border-zinc-400 bg-white/40 backdrop-blur-sm"
          >
            <span className="text-sm tracking-wide">See Our Work</span>
            <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
