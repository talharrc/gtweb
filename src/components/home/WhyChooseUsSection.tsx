import { motion } from 'motion/react';
import { ArrowUpRight, DollarSign, RefreshCw, TrendingUp, Shield, Zap } from 'lucide-react';
import { VIEWPORT_DEFAULT } from './motion-tokens';

function handleCardTiltMove(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const xc = rect.width / 2;
  const yc = rect.height / 2;
  const tiltX = (yc - y) / 12;
  const tiltY = (x - xc) / 12;
  card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.01, 1.01, 1.01)`;
}

function handleCardTiltLeave(e: React.MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

export default function WhyChooseUsSection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden bg-[#F2ECE6]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-white/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7 }} className="relative">
            <span className="text-[10px] font-mono text-[#FF4D06] tracking-[0.3em] uppercase block mb-3">02 — Why Choose Us</span>
            <h2 className="display-poster text-4xl sm:text-5xl md:text-6xl mb-6">
              <span className="block text-[#0B0B0B]">Why</span>
              <span className="block my-2 text-[#0B0B0B]">Choose</span>
              <span className="pill-word-brand text-white text-2xl sm:text-3xl md:text-4xl mt-2 inline-block" style={{ background: '#FF4D06' }}>Us.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.7, delay: 0.2 }} className="text-zinc-600 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-zinc-200 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-zinc-300 sm:pl-6">
            Five reasons clients trust GalaxaTech to build their digital future.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
          {/* Card 1: Faster Delivery */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6 }} className="md:col-span-4 min-h-[220px] tilt-card-container">
            <div onMouseMove={handleCardTiltMove} onMouseLeave={handleCardTiltLeave} className="w-full h-full flex flex-col justify-between p-7 rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-sm shadow-zinc-200/10 text-left tilt-card cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06] border border-[#FF4D06]/15 flex-shrink-0 font-bold font-mono text-[10px]">01</div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06]">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-zinc-100/80 border border-zinc-200/60 px-4 py-2.5 relative overflow-hidden select-none text-[10px] font-mono text-zinc-600 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[#0B0B0B]">DAY 1</span>
                      <span className="text-[8px] text-zinc-400">Setup</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-[#FF4D06]" />
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[#0B0B0B]">DAY 3</span>
                      <span className="text-[8px] text-zinc-400">v1 Live</span>
                    </div>
                    <ArrowUpRight className="w-3 h-3 text-[#FF4D06]" />
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-[#0B0B0B]">DAY 5</span>
                      <span className="text-[8px] text-zinc-400">Launch</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-zinc-300 mx-2" />
                  <div className="flex flex-col text-[8px] leading-tight">
                    <span className="line-through text-zinc-400">Agency: 4–6 wks</span>
                    <span className="text-white font-bold bg-[#FF4D06] px-1 py-0.5 rounded mt-0.5">GalaxaTech: days</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-6 items-end justify-between">
                <div className="max-w-md">
                  <h3 className="text-[#0B0B0B] font-bold text-base mb-2 font-display">Faster Delivery</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed">Most projects go live in days, not weeks. Our AI-assisted workflows cut down turnaround times dramatically.</p>
                </div>
                <div className="flex flex-col gap-1 w-full sm:w-auto font-mono text-[9px] text-zinc-550 bg-zinc-100/80 border border-zinc-200/60 p-2.5 rounded-xl">
                  <div className="flex justify-between gap-4"><span>Pipeline:</span><span className="text-[#0B0B0B] font-bold">Active</span></div>
                  <div className="flex justify-between gap-4"><span>Launch time:</span><span className="text-[#0B0B0B] font-bold">Days</span></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: More Affordable */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6, delay: 0.06 }} className="md:col-span-2 min-h-[220px] tilt-card-container">
            <div onMouseMove={handleCardTiltMove} onMouseLeave={handleCardTiltLeave} className="w-full h-full flex flex-col justify-between p-7 rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-sm shadow-zinc-200/10 text-left tilt-card cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06] border border-[#FF4D06]/15 flex-shrink-0 font-bold font-mono text-[10px]">02</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06]">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-[#0B0B0B] font-bold text-base mb-2 font-display">More Affordable</h3>
                <p className="text-zinc-600 text-xs leading-relaxed mb-4">AI cuts development hours, so you pay less for a high-performance system.</p>
                <div className="flex flex-col gap-2.5 w-full bg-zinc-100/80 border border-zinc-200/60 p-3 font-mono text-[9px] text-zinc-600 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span>TRADITIONAL</span>
                    <div className="w-[50%] bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 1 }} style={{ originX: 0 }} className="h-full bg-zinc-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>WITH GALAXA</span>
                    <div className="w-[50%] bg-zinc-200 rounded-full h-1.5 overflow-hidden">
                      <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 0.6 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 1, delay: 0.2 }} style={{ originX: 0 }} className="h-full bg-[#FF4D06] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Unlimited Revisions */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6, delay: 0.12 }} className="md:col-span-2 min-h-[220px] tilt-card-container">
            <div onMouseMove={handleCardTiltMove} onMouseLeave={handleCardTiltLeave} className="w-full h-full flex flex-col justify-between p-7 rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-sm shadow-zinc-200/10 text-left tilt-card cursor-pointer group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06] border border-[#FF4D06]/15 flex-shrink-0 font-bold font-mono text-[10px]">03</div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06]">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-[#0B0B0B] font-bold text-base mb-2 font-display">Unlimited Revisions</h3>
                <p className="text-zinc-600 text-xs leading-relaxed mb-3">Request as many changes as you need during development. No limits.</p>
                <div className="flex flex-col gap-2 rounded-xl p-2.5 bg-zinc-100/80 border border-zinc-200/60 select-none text-[9px] font-sans w-full">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <div className="bg-zinc-200 rounded-xl rounded-tl-sm px-2.5 py-1 text-zinc-700 border border-zinc-300 leading-normal">
                      Can we adjust the header layout?
                    </div>
                  </div>
                  <div className="flex flex-col items-end w-full">
                    <div className="bg-[#FF4D06] rounded-xl rounded-tr-sm px-2.5 py-1 text-[#0B0B0B] leading-normal font-semibold shadow-sm">
                      Done — v14 is live.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Built to Convert */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6, delay: 0.18 }} className="md:col-span-2 min-h-[220px] tilt-card-container">
            <div onMouseMove={handleCardTiltMove} onMouseLeave={handleCardTiltLeave} className="w-full h-full flex flex-col justify-between p-7 rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-sm shadow-zinc-200/10 text-left tilt-card cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06] border border-[#FF4D06]/15 flex-shrink-0 font-bold font-mono text-[10px]">04</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-[#0B0B0B] font-bold text-base mb-2 font-display">Built to Convert</h3>
                <p className="text-zinc-600 text-xs leading-relaxed mb-3">We design digital systems optimized to attract customers and generate results, not just look pretty.</p>
                <div className="flex flex-col gap-1.5 bg-zinc-100/80 border border-zinc-200/60 p-2.5 font-mono text-[9px] w-full text-zinc-600 rounded-xl">
                  <div className="flex justify-between items-center">
                    <span>VISITS → LEADS</span>
                    <span className="text-[#FF4D06] font-bold">+38%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>PAGESPEED</span>
                    <span className="text-white font-bold bg-[#FF4D06] px-1 rounded">98/100</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 5: Long-Term Support */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={VIEWPORT_DEFAULT} transition={{ duration: 0.6, delay: 0.24 }} className="md:col-span-2 min-h-[220px] tilt-card-container">
            <div onMouseMove={handleCardTiltMove} onMouseLeave={handleCardTiltLeave} className="w-full h-full flex flex-col justify-between p-7 rounded-2xl border border-zinc-200/50 bg-white/50 backdrop-blur-md shadow-sm shadow-zinc-200/10 text-left tilt-card cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#FF4D06]/10 text-[#FF4D06] border border-[#FF4D06]/15 flex-shrink-0 font-bold font-mono text-[10px]">05</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#FF4D06]/10 border border-[#FF4D06]/20 text-[#FF4D06]">
                  <Shield className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-[#0B0B0B] font-bold text-base mb-2 font-display">Long-Term Support</h3>
                <p className="text-zinc-600 text-xs leading-relaxed mb-3">We don't disappear after delivery. We offer continuous updates and maintenance.</p>
                <div className="flex flex-col gap-2 bg-zinc-100/80 border border-zinc-200/60 p-2.5 font-mono text-[9px] w-full text-zinc-600 rounded-xl">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[#FF4D06] font-bold text-[8px]">MAINTAIN</span>
                    <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-[#FF4D06] font-bold text-[8px]">SCALE</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[8px] text-zinc-400 uppercase">Support:</span>
                    <span className="flex items-center gap-1 text-[8px] font-bold text-[#22c55e] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
