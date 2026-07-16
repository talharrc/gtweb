import { motion } from 'motion/react';
import { Zap, DollarSign, RefreshCw, TrendingUp, Shield, Gauge, Eye, MousePointerClick, FileCheck, Ban, FileSignature } from 'lucide-react';
import SpotlightCard from '../shared/SpotlightCard';

export default function WhyChooseUs() {
  return (
    <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(14,31,20,0.28) 50%, transparent 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#16C95A]/7 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#0FD65E]/[0.06] blur-[130px] rounded-full pointer-events-none" />
      <div className="specular-beam absolute top-0 right-0 w-full h-[140%] rotate-[8deg]" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }} className="relative">
            <span className="text-[10px] font-mono text-primary/70 tracking-[0.3em] uppercase block mb-3">01 — Why Choose Us</span>
            <h2 className="display-sora text-4xl sm:text-5xl md:text-6xl mb-6">
              <span className="block text-white">Why Choose</span>
              <span className="pill-word-accent text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: 'linear-gradient(135deg, #2BFF6E, #7CFFC2)' }}>Us.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            Five reasons clients trust GalaxaTech to build their digital future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Card 1: Faster Delivery — icon-only, trust the copy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-4 min-h-[220px]"
          >
            <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/8 text-primary border border-primary/15 flex-shrink-0 font-bold font-mono text-[10px]">
                    01
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d text-[#EFFFF5] [&>svg]:relative [&>svg]:z-10">
                    <Zap className="w-5.5 h-5.5" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#7CFFC2]/80 uppercase tracking-widest bg-[#2BFF6E]/10 px-2.5 py-0.5 rounded-full border border-[#2BFF6E]/20">
                  Speed
                </span>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-6 items-end justify-between">
                <div className="max-w-md">
                  <h3 className="text-white font-bold text-base mb-2 font-display">Faster Delivery</h3>
                  <p className="text-white/60 text-xs leading-relaxed">Most projects go live in days, not weeks. Our AI-assisted workflows cut down turnaround times dramatically.</p>
                </div>
                {/* Plain 3-stage label row, no invented dates */}
                <div className="flex items-center gap-2.5 bg-white/[0.02] border border-white/5 px-4 py-2.5 select-none text-[10px] font-mono text-white/55 rounded-2xl">
                  <span className="font-bold text-white">Kickoff</span>
                  <span className="text-[#7CFFC2]">→</span>
                  <span className="font-bold text-white">Build</span>
                  <span className="text-[#7CFFC2]">→</span>
                  <span className="font-bold text-white">Ship</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Card 2: More Affordable — policy bullet list, no invented percentages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.06 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-2 min-h-[220px]"
          >
            <div className="w-full h-full flex flex-col justify-between p-7 rounded-3xl icy-card border border-[#2BFF6E]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#2BFF6E]/10 text-[#16C95A] border border-[#2BFF6E]/20 flex-shrink-0 font-bold font-mono text-[10px]">
                    02
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-[#2BFF6E] [&>svg]:relative [&>svg]:z-10">
                    <DollarSign className="w-5.5 h-5.5" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#16C95A]/80 uppercase tracking-widest bg-[#2BFF6E]/10 px-2.5 py-0.5 rounded-full border border-[#2BFF6E]/20">
                  Policy
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-900 font-bold text-base mb-2 font-display">More Affordable</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-4">AI cuts development hours, so you pay less for a high-performance system.</p>

                <ul className="flex flex-col gap-1.5 text-[11px] text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><Ban className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> No scope-creep billing</li>
                  <li className="flex items-center gap-2"><FileSignature className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> Fixed-price proposals</li>
                  <li className="flex items-center gap-2"><FileCheck className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> Written quote, every time</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Unlimited Revisions — chat mockup kept as-is (illustrative, not a data claim) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-2 min-h-[220px]"
          >
            <div className="w-full h-full flex flex-col justify-between p-7 rounded-3xl icy-card border border-[#2BFF6E]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#2BFF6E]/10 text-[#16C95A] border border-[#2BFF6E]/20 flex-shrink-0 font-bold font-mono text-[10px]">
                    03
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-[#2BFF6E] [&>svg]:relative [&>svg]:z-10">
                    <RefreshCw className="w-5.5 h-5.5" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#16C95A]/80 uppercase tracking-widest bg-[#2BFF6E]/10 px-2.5 py-0.5 rounded-full border border-[#2BFF6E]/20">
                  Use Case
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-900 font-bold text-base mb-2 font-display">Unlimited Revisions</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">Request as many changes as you need during development. No hidden fees or limits.</p>

                <div className="flex flex-col gap-2 rounded-2xl p-2.5 bg-[#050806]/5 border border-[#2BFF6E]/10 select-none text-[9px] font-sans w-full">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-white rounded-2xl rounded-tl-sm px-2.5 py-1 text-slate-600 border border-[#2BFF6E]/15 leading-normal shadow-sm">
                      Can we adjust the header layout?
                    </div>
                  </div>
                  <div className="flex flex-col items-end w-full">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl rounded-tr-sm px-2.5 py-1 text-white leading-normal font-semibold shadow-sm">
                      Done — v14 is live.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Built to Convert — category focus list, no invented metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.18 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-2 min-h-[220px]"
          >
            <div className="w-full h-full flex flex-col justify-between p-7 rounded-3xl icy-card border border-[#2BFF6E]/20 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#2BFF6E]/10 text-[#16C95A] border border-[#2BFF6E]/20 flex-shrink-0 font-bold font-mono text-[10px]">
                    04
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-light text-[#2BFF6E] [&>svg]:relative [&>svg]:z-10">
                    <TrendingUp className="w-5.5 h-5.5" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#16C95A]/80 uppercase tracking-widest bg-[#2BFF6E]/10 px-2.5 py-0.5 rounded-full border border-[#2BFF6E]/20">
                  Focus
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-slate-900 font-bold text-base mb-2 font-display">Built to Convert</h3>
                <p className="text-slate-600 text-xs leading-relaxed mb-3">We design digital systems optimized to attract customers and generate results.</p>

                <ul className="flex flex-col gap-1.5 text-[11px] text-slate-600 font-medium">
                  <li className="flex items-center gap-2"><Gauge className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> Core Web Vitals</li>
                  <li className="flex items-center gap-2"><Eye className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> Accessibility</li>
                  <li className="flex items-center gap-2"><MousePointerClick className="w-3 h-3 text-[#16C95A] flex-shrink-0" /> Conversion paths</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Long-Term Support — static label, no fake live-status pulse */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="md:col-span-2 min-h-[220px]"
          >
            <SpotlightCard className="w-full h-full flex flex-col justify-between p-7 rounded-3xl glass-card-premium border border-white/10 group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/8 text-primary border border-primary/15 flex-shrink-0 font-bold font-mono text-[10px]">
                    05
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center glass-icon-3d-violet float-idle-slow text-[#F0EBFF] [&>svg]:relative [&>svg]:z-10">
                    <Shield className="w-5.5 h-5.5" />
                  </div>
                </div>
                <span className="text-[8px] font-mono font-bold text-[#C9BFFF]/80 uppercase tracking-widest bg-[#0FD65E]/10 px-2.5 py-0.5 rounded-full border border-[#0FD65E]/20">
                  Ongoing
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-white font-bold text-base mb-2 font-display">Long-Term Support</h3>
                <p className="text-white/60 text-xs leading-relaxed mb-3">We don't disappear after delivery. We offer continuous updates and maintenance.</p>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-1 rounded-full bg-white/10 text-[#7CFFC2] font-bold text-[9px] font-mono uppercase">Maintenance included</span>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
