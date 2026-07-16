import { useRef, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowUpRight, Globe, FolderOpen } from 'lucide-react';

const PROJECTS = [
  { slug: 'harmans-trading', num: '01', name: 'Harmans Trading', type: 'Trading Platform', color: '#fedd00', bg: 'linear-gradient(135deg,rgba(254,221,0,0.25) 0%,rgba(120,40,100,0.2) 60%,rgba(13,0,10,0.85) 100%)' },
  { slug: 'sunnah-grandeur', num: '02', name: 'Sunnah Grandeur', type: 'E-Commerce Platform', color: '#782864', bg: 'linear-gradient(135deg,rgba(120,40,100,0.3) 0%,rgba(13,0,10,0.4) 60%,rgba(13,0,10,0.85) 100%)' },
  { slug: 'salfas-bazar', num: '03', name: 'Salfas Bazar', type: 'Organic Food Platform', color: '#fedd00', bg: 'linear-gradient(135deg,rgba(254,221,0,0.20) 0%,rgba(120,40,100,0.15) 60%,rgba(13,0,10,0.85) 100%)' },
];

interface SelectedWorkProps {
  isMobile: boolean;
}

export default function SelectedWork({ isMobile }: SelectedWorkProps) {
  const navigate = useNavigate();
  const portfolioSectionRef = useRef<HTMLDivElement>(null);
  const [folderHovered, setFolderHovered] = useState(false);
  const isPortfolioInView = useInView(portfolioSectionRef, { amount: 0.55, once: false });
  const isFolderOpen = folderHovered || (isMobile && isPortfolioInView);

  const folderMaskSvg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 400'%3E%3Cpath d='M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z' fill='black'/%3E%3C/svg%3E")`;

  const glassStyle: CSSProperties = {
    maskImage: folderMaskSvg,
    WebkitMaskImage: folderMaskSvg,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    backdropFilter: 'blur(32px) saturate(140%)',
    WebkitBackdropFilter: 'blur(32px) saturate(140%)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.015))',
  };

  const backGlassStyle: CSSProperties = {
    maskImage: folderMaskSvg,
    WebkitMaskImage: folderMaskSvg,
    maskSize: '100% 100%',
    WebkitMaskSize: '100% 100%',
    maskRepeat: 'no-repeat',
    WebkitMaskRepeat: 'no-repeat',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.005))',
  };

  return (
    <section ref={portfolioSectionRef} className="py-16 px-6 overflow-x-hidden relative" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(11,36,112,0.22) 50%, transparent 100%)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#0041CC]/8 blur-[160px] rounded-full pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
            <span className="text-[10px] font-mono text-primary/75 tracking-[0.3em] uppercase block mb-3">04 — Portfolio</span>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-[0.9]" style={{ fontFamily: 'var(--font-display)' }}>
              Selected<br />
              <span className="text-grad">Work.</span>
            </h2>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }} className="text-white/55 text-sm leading-relaxed max-w-[200px] sm:text-right border-t border-white/10 pt-4 sm:border-t-0 sm:pt-0 sm:border-l sm:border-white/[0.08] sm:pl-6">
            A few projects, systems, and brands we've helped shape.
          </motion.p>
        </div>

        {/* 3D Glass Folder Reveal Scene */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full"
        >
          <div
            className="relative cursor-pointer w-full max-w-[700px] flex items-center justify-center"
            onMouseEnter={() => setFolderHovered(true)}
            onMouseLeave={() => setFolderHovered(false)}
            onClick={() => navigate('/portfolio')}
            style={{
              height: isMobile ? '380px' : '480px',
              perspective: '1600px',
              touchAction: isMobile ? 'auto' : 'none',
            }}
          >
            {/* Core 3D Scene Wrapper - Facing forward, tilts slightly on hover */}
            <div
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
                transform: isFolderOpen
                  ? 'rotateX(6deg) rotateY(-2deg) scale(1.03)'
                  : 'rotateX(0deg) rotateY(0deg) scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Soft ambient neon background glow behind folder */}
              <div
                className="absolute inset-0 rounded-3xl opacity-35 pointer-events-none transition-all duration-700"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, #0059FF 0%, transparent 70%)',
                  transform: isFolderOpen ? 'translateZ(-90px) scale(1.3)' : 'translateZ(-90px) scale(0.9)',
                  filter: 'blur(40px)',
                }}
              />

              {/* FOLDER BACK COVER PLATE */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: isMobile ? '20px' : '30px',
                  width: isMobile ? '320px' : '480px',
                  height: isMobile ? '213px' : '320px',
                  transform: 'translateZ(-40px)',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 1,
                }}
              >
                <div style={backGlassStyle} className="absolute inset-0 w-full h-full" />
                <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              {/* REVEALED PROJECT CARDS (They float up and pop out in 3D) */}
              {PROJECTS.map((proj, i) => {
                const peekDesktop = [
                  { x: -30, y: 14, z: -22, rotX: 0, rotY: 0, rotZ: -13, scale: 0.86 },
                  { x: 0, y: -8, z: -5, rotX: 0, rotY: 0, rotZ: 0, scale: 0.92 },
                  { x: 30, y: 14, z: -22, rotX: 0, rotY: 0, rotZ: 13, scale: 0.86 },
                ];
                const peekMobile = [
                  { x: -18, y: 10, z: -16, rotX: 0, rotY: 0, rotZ: -10, scale: 0.84 },
                  { x: 0, y: -6, z: -4, rotX: 0, rotY: 0, rotZ: 0, scale: 0.90 },
                  { x: 18, y: 10, z: -16, rotX: 0, rotY: 0, rotZ: 10, scale: 0.84 },
                ];
                const peek = isMobile ? peekMobile[i] : peekDesktop[i];
                let x = peek.x, y = peek.y, z = peek.z;
                let rotX = peek.rotX, rotY = peek.rotY, rotZ = peek.rotZ;
                let scale = peek.scale;
                let opacity = i === 1 ? 0.82 : 0.72;
                const cardBlur = '0px';

                if (isFolderOpen) {
                  opacity = 1;
                  if (isMobile) {
                    const coords = [
                      { x: -75, y: -75, z: 40, rotX: -5, rotY: -8, rotZ: -18, scale: 0.92 },
                      { x: 0, y: -105, z: 70, rotX: -5, rotY: 0, rotZ: 0, scale: 0.98 },
                      { x: 75, y: -75, z: 40, rotX: -5, rotY: 8, rotZ: 18, scale: 0.92 }
                    ];
                    ({ x, y, z, rotX, rotY, rotZ, scale } = coords[i]);
                  } else {
                    const coords = [
                      { x: -170, y: -140, z: 80, rotX: -5, rotY: -10, rotZ: -22, scale: 0.98 },
                      { x: 0, y: -190, z: 120, rotX: -5, rotY: 0, rotZ: 0, scale: 1.05 },
                      { x: 170, y: -140, z: 80, rotX: -5, rotY: 10, rotZ: 22, scale: 0.98 }
                    ];
                    ({ x, y, z, rotX, rotY, rotZ, scale } = coords[i]);
                  }
                }

                const cardW = isMobile ? '150px' : '190px';
                const cardH = isMobile ? '195px' : '240px';

                return (
                  <div
                    key={proj.slug}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      bottom: isMobile ? '30px' : '50px',
                      width: cardW,
                      height: cardH,
                      marginLeft: isMobile ? '-75px' : '-95px',
                      transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
                      transformStyle: 'preserve-3d',
                      opacity,
                      filter: `blur(${cardBlur})`,
                      transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease, filter 0.6s ease`,
                      zIndex: 10 + i,
                      borderRadius: '20px',
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderTop: `1px solid ${proj.color}40`,
                      boxShadow: isFolderOpen
                        ? `0 15px 35px ${proj.color}33, 0 0 15px rgba(0,0,0,0.6)`
                        : '0 6px 15px rgba(0,0,0,0.5)',
                    }}
                  >
                    <div className="h-[55%] relative flex items-center justify-center overflow-hidden" style={{ background: proj.bg }}>
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{ background: `radial-gradient(circle at center, ${proj.color} 0%, transparent 70%)` }}
                      />
                      <Globe className="w-9 h-9 opacity-25" style={{ color: proj.color }} />
                      <span className="absolute top-3 left-3 text-[9px] font-mono text-white/50">{proj.num}</span>
                    </div>
                    <div
                      className="p-3.5 h-[45%] flex flex-col justify-between transition-all duration-500"
                      style={{
                        background: 'rgba(10,8,37,0.92)',
                        backdropFilter: 'blur(5px)',
                        opacity: isFolderOpen ? 1 : 0,
                        transform: isFolderOpen ? 'translateY(0)' : 'translateY(12px)',
                      }}
                    >
                      <div>
                        <p className="text-white font-bold text-xs sm:text-sm leading-tight font-display">{proj.name}</p>
                        <p className="text-white/40 text-[9px] mt-0.5 font-sans">{proj.type}</p>
                      </div>
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                        Explore <ArrowUpRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* FOLDER FRONT GLASS COVER */}
              <div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  bottom: isMobile ? '20px' : '30px',
                  width: isMobile ? '320px' : '480px',
                  height: isMobile ? '213px' : '320px',
                  transformOrigin: 'bottom center',
                  transform: isFolderOpen
                    ? 'translateZ(40px) rotateX(-12deg)'
                    : 'translateZ(40px) rotateX(0deg)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  zIndex: 20,
                }}
              >
                <div style={glassStyle} className="absolute inset-0 w-full h-full" />
                <svg viewBox="0 0 600 400" className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="neonBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00C2FF" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="#0059FF" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#0041CC" stopOpacity="0.5" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0 380 L 0 80 A 20 20 0 0 1 20 60 L 160 60 A 20 20 0 0 1 180 80 A 20 20 0 0 0 200 100 L 580 100 A 20 20 0 0 1 600 120 L 600 380 A 20 20 0 0 1 580 400 L 20 400 A 20 20 0 0 1 0 380 Z"
                    fill="none"
                    stroke="url(#neonBorderGrad)"
                    strokeWidth="1.5"
                  />
                </svg>

                <div className="flex flex-col justify-between h-full p-6 sm:p-8 relative z-30">
                  <div className="flex items-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center glass-icon-3d-chrome">
                      <FolderOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#1B2C57] relative z-10" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-white font-bold text-sm sm:text-base font-display leading-tight">Open Portfolio</p>
                      <span className="text-white/45 text-[9px] sm:text-[10px] font-mono tracking-wider">GALAXATECH © 2026</span>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); navigate('/portfolio'); }}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-[1.1] bg-gradient-to-r from-primary to-secondary text-white cursor-pointer"
                      style={{ boxShadow: '0 8px 30px rgba(236,30,142,0.3)' }}
                    >
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-white/45 text-[11px] font-mono mt-6">Hover or tap to reveal</p>
        </motion.div>
      </div>
    </section>
  );
}
