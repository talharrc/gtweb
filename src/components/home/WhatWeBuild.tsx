import { useState, useRef, type PointerEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowUpRight, ChevronLeft, ChevronRight,
  Laptop, Smartphone, MessageCircle, Cpu, Brush, Workflow,
} from 'lucide-react';

const SERVICES = [
  { num: '01', icon: Laptop, label: 'Web Development', desc: 'Fast, secure, and scalable websites built for performance and growth.', anchor: 'web-development', color: '#00C2FF' },
  { num: '02', icon: Smartphone, label: 'App Development', desc: 'High-performance mobile and web apps tailored to user needs and business goals.', anchor: 'app-development', color: '#7C5CFF' },
  { num: '03', icon: MessageCircle, label: 'Social Media & Content', desc: 'Engaging content and social strategies that build brand presence and loyalty.', anchor: 'social-media', color: '#FF3DA6' },
  { num: '04', icon: Cpu, label: 'AI & Automation', desc: 'Intelligent automation that streamlines workflows and boosts productivity.', anchor: 'ai-automation', color: '#0059FF' },
  { num: '05', icon: Brush, label: 'Brand Identity & Design', desc: 'Distinctive visuals and brand experiences that leave a lasting impression.', anchor: 'brand-identity', color: '#FFB020' },
  { num: '06', icon: Workflow, label: 'Systems Consulting', desc: 'Strategic guidance and system architectures that drive sustainable growth.', anchor: 'systems-consulting', color: '#7C5CFF' },
];

function getCarouselOffset(i: number, active: number, total: number): number {
  let offset = i - active;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;
  return offset;
}

interface WhatWeBuildProps {
  isMobile: boolean;
}

export default function WhatWeBuild({ isMobile }: WhatWeBuildProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCarouselIndex, setHoveredCarouselIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef<{ startX: number; moved: boolean } | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);

  const carouselPrev = () => setActiveIndex(p => (p - 1 + SERVICES.length) % SERVICES.length);
  const carouselNext = () => setActiveIndex(p => (p + 1) % SERVICES.length);

  const handleCarouselPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: e.clientX, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const handleCarouselPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const d = e.clientX - dragRef.current.startX;
    if (Math.abs(d) > 6) dragRef.current.moved = true;
    setDragOffset(d);
  };
  const handleCarouselPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const d = e.clientX - dragRef.current.startX;
    const xStep = isMobile ? 155 : 245;
    if (Math.abs(d) > xStep * 0.2) {
      if (d < 0) carouselNext(); else carouselPrev();
    }
    setDragOffset(0);
    dragRef.current = null;
  };

  return (
    <section className="py-16 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(11,36,112,0.26) 50%, transparent 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#0059FF]/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-[#FF3DA6]/[0.05] blur-[130px] rounded-full pointer-events-none" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-cyan-400/75 tracking-[0.3em] uppercase block mb-3">02 — Services</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              What<br />
              <span style={{ WebkitTextStroke: '1.5px rgba(0,194,255,0.85)', color: 'transparent' }}>We</span><br />
              <span className="pill-word-brand-ghost">Build.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[320px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            We architect high-performance digital ecosystems, custom AI pipelines, and bespoke brand platforms built for scale.
          </motion.p>
        </div>

        {/* 3D Carousel */}
        <div className="relative">
          <div
            className="relative select-none"
            ref={carouselContainerRef}
            style={{ perspective: isMobile ? '800px' : '1400px', height: isMobile ? '300px' : '450px', touchAction: 'pan-y' }}
            onPointerDown={handleCarouselPointerDown}
            onPointerMove={handleCarouselPointerMove}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={() => { dragRef.current = null; setDragOffset(0); }}
          >
            {SERVICES.map((svc, i) => {
              const offset = getCarouselOffset(i, activeIndex, SERVICES.length);
              const xStep = isMobile ? 155 : 330;

              const apparentOffset = offset + (dragOffset / xStep);
              const absOff = Math.abs(apparentOffset);

              const visible = isMobile ? absOff <= 1.8 : absOff <= 2.8;

              const x = offset * xStep + dragOffset;
              const rotY = isMobile ? apparentOffset * 10 : apparentOffset * 15;
              const z = -absOff * (isMobile ? 70 : 120);
              const scale = 1 - absOff * 0.08;

              const opacity = visible ? Math.max(0, 1 - absOff * 0.32) : 0;
              const isActive = absOff < 0.5;
              const cardWidth = isMobile ? '175px' : '320px';
              return (
                <div
                  key={svc.anchor}
                  onClick={() => { if (dragRef.current?.moved) return; if (Math.abs(apparentOffset) >= 0.5) setActiveIndex(i); else navigate(`/services#${svc.anchor}`); }}
                  onMouseEnter={() => setHoveredCarouselIndex(i)}
                  onMouseLeave={() => setHoveredCarouselIndex(null)}
                  style={{
                    position: 'absolute', left: '50%', top: '50%', width: cardWidth,
                    transform: `translateX(calc(-50% + ${x}px)) translateY(-50%) rotateY(${rotY}deg) translateZ(${z}px) scale(${scale * (hoveredCarouselIndex === i ? 1.02 : 1)})`,
                    opacity,
                    transition: dragOffset !== 0 ? 'none' : 'all 0.35s cubic-bezier(.2,.7,.2,1)',
                    pointerEvents: visible ? 'auto' : 'none', cursor: 'pointer',
                    zIndex: Math.round(10 - absOff * 2),
                    background: 'rgba(20, 6, 16, 0.5)',
                    backdropFilter: 'blur(20px) saturate(140%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: isActive
                      ? hoveredCarouselIndex === i
                        ? `0 0 70px ${svc.color}45, 0 10px 30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)`
                        : `0 0 50px ${svc.color}25, 0 10px 30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.12)`
                      : '0 8px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                    padding: '28px 24px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${svc.color} 0%, transparent 70%)`,
                      opacity: isActive ? 0.22 : 0.06,
                    }}
                  />
                  <div className="flex items-start justify-between mb-5 relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i % 2 === 0 ? 'glass-icon-3d' : 'glass-icon-3d-light'} ${isActive ? 'float-idle' : ''}`}>
                      <svc.icon className="w-6 h-6 relative z-10" style={{ color: i % 2 === 0 ? '#E8F4FF' : svc.color }} />
                    </div>
                    <span className="text-[11px] font-mono text-white/20 font-semibold">{svc.num}</span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 font-display relative z-10">{svc.label}</h3>
                  <p className="text-white/70 text-sm leading-relaxed relative z-10">{svc.desc}</p>
                  {isActive && (
                    <div className="flex items-center gap-1.5 mt-5 text-xs font-semibold relative z-10" style={{ color: '#00C2FF' }}>
                      Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                  {!isActive && (
                    <div className="mt-5 relative z-10">
                      <ArrowUpRight className="w-4 h-4 text-white/35" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explicit prev/next controls — deliberate navigation for click/keyboard users */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={carouselPrev}
              aria-label="Previous service"
              className="w-11 h-11 rounded-full flex items-center justify-center glass-icon-3d text-[#E8F4FF] hover:scale-105 transition-transform duration-200 [&>svg]:relative [&>svg]:z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1.5">
              {SERVICES.map((svc, i) => (
                <button
                  key={svc.anchor}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show ${svc.label}`}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                  style={{ background: i === activeIndex ? '#00C2FF' : 'rgba(255,255,255,0.2)', width: i === activeIndex ? '18px' : '6px' }}
                />
              ))}
            </div>
            <button
              onClick={carouselNext}
              aria-label="Next service"
              className="w-11 h-11 rounded-full flex items-center justify-center glass-icon-3d text-[#E8F4FF] hover:scale-105 transition-transform duration-200 [&>svg]:relative [&>svg]:z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
