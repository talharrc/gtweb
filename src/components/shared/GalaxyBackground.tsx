import React, { useEffect, useRef } from 'react';

interface Particle {
  distance: number; // Distance from center
  angle: number; // Current angle in orbit
  orbitSpeed: number; // Orbital speed
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  // Physics offsets for interactive spring effect
  vx: number;
  vy: number;
  ox: number;
  oy: number;
}

export default function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Initialize particles (increased for better visibility)
    const particleCount = Math.min(1400, Math.floor((width * height) / 800));
    const particles: Particle[] = [];
    const arms = 3;
    const armTightness = 0.004; // How tightly the arms wind
    const maxRadius = Math.max(width, height) * 0.6;

    // Helper to generate brand colors for galaxy
    const getGalaxyColor = (distRatio: number) => {
      // Core: bright white/cyan/pink
      if (distRatio < 0.08) {
        return Math.random() > 0.45 ? `255, 235, 245` : `236, 30, 142`; // Pearl white mixed with hot pink
      }
      // Inner arms: Purple / Hot Pink
      if (distRatio < 0.45) {
        // Blended purple (#5B23A8) and hot pink (#EC1E8E)
        const rand = Math.random();
        if (rand < 0.5) {
          return `236, 30, 142`; // Hot Pink
        }
        return `91, 35, 168`; // Deep Purple
      }
      // Outer arms: Coral / Dusty Purple
      const rand = Math.random();
      if (rand < 0.6) {
        return `255, 122, 69`; // Warm Coral
      }
      return `91, 35, 168`; // Purple dust
    };

    for (let i = 0; i < particleCount; i++) {
      // Spiral distribution
      const arm = i % arms;
      // Change power from 2.2 to 1.5 for a softer, more distributed galaxy,
      // and add a minor center offset to avoid an overly dense central dot.
      const distance = (0.02 + Math.pow(Math.random(), 1.5) * 0.98) * maxRadius;
      const armAngle = (arm * 2 * Math.PI) / arms;
      
      // Calculate angle with spiral winding and random spread/dispersion
      const dispersion = (Math.random() - 0.5) * (0.22 + (distance / maxRadius) * 0.4);
      const angle = armAngle + distance * armTightness + dispersion;
      
      // Orbital speed: Keplerian-like (increased slightly to make motion more noticeable)
      const orbitSpeed = (0.0009 + (1 / (distance + 20)) * 0.15) * (0.85 + Math.random() * 0.3);
      
      // Pre-mature/disperse the initial angle so the galaxy starts in a natural, organic state
      // instead of harsh, un-rotated mathematical lines.
      const initialAngle = angle + orbitSpeed * (Math.random() * 800);
      
      // Make particles at the core smaller and less opaque to reduce clumping visual density
      const distRatio = distance / maxRadius;
      let size = Math.random() * 1.6 + 0.55; // Slightly larger for better visual pop
      let baseAlpha = Math.random() * 0.55 + 0.4; // Brighter default opacity (40% to 95%)
      
      if (distRatio < 0.12) {
        size = Math.random() * 0.9 + 0.35; // Core size: 0.35px to 1.25px
        baseAlpha = Math.random() * 0.4 + 0.25; // Core opacity: 25% to 65%
      }

      particles.push({
        distance,
        angle: initialAngle,
        orbitSpeed,
        size,
        alpha: baseAlpha,
        baseAlpha,
        color: getGalaxyColor(distRatio),
        vx: 0,
        vy: 0,
        ox: 0,
        oy: 0,
      });
    }

    // Twinkling background stars (dust/nebula particles) for depth
    const bgStarsCount = 80;
    const bgStars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
    for (let i = 0; i < bgStarsCount; i++) {
      bgStars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        speed: 0.002 + Math.random() * 0.005,
      });
    }

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      // Clear with very slight alpha to create trailing effect (reduced from 0.15 to 0.08 for longer, richer trails)
      ctx.fillStyle = 'rgba(11, 7, 16, 0.08)'; // Matches theme bg #0B0710
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Smooth mouse position interpolation (easing)
      const mouse = mouseRef.current;
      const lerpFactor = 0.08;
      mouse.x += (mouse.targetX - mouse.x) * lerpFactor;
      mouse.y += (mouse.targetY - mouse.y) * lerpFactor;

      // Draw background stars
      for (let i = 0; i < bgStars.length; i++) {
        const star = bgStars[i];
        star.alpha += (Math.random() - 0.5) * star.speed;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.6) star.alpha = 0.6;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw and update galaxy particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Orbit calculation
        p.angle += p.orbitSpeed;
        
        // Base coordinate (galactic rotation)
        const bx = centerX + Math.cos(p.angle) * p.distance;
        const by = centerY + Math.sin(p.angle) * p.distance * 0.75; // 0.75 ratio creates tilted 3D look

        // Interactive gravity / vortex force
        if (mouse.active) {
          const dx = bx + p.ox - mouse.x;
          const dy = by + p.oy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const influenceRadius = 180;

          if (dist < influenceRadius) {
            const force = (1 - dist / influenceRadius) * 0.8;
            
            // 1. Vortex (swirl) force around the cursor
            // Tangent vector
            const tx = -dy / (dist + 1);
            const ty = dx / (dist + 1);

            // 2. Gravitational pull towards the cursor
            const px = -dx / (dist + 1);
            const py = -dy / (dist + 1);

            // Accumulate offset velocity
            p.vx += (tx * 1.5 + px * 0.6) * force * 0.08;
            p.vy += (ty * 1.5 + py * 0.6) * force * 0.08;
          }
        }

        // Apply friction and update offsets
        p.ox = (p.ox + p.vx) * 0.94;
        p.oy = (p.oy + p.vy) * 0.94;
        
        // Decelerate offset velocity (friction)
        p.vx *= 0.94;
        p.vy *= 0.94;

        // Final coordinates
        const rx = bx + p.ox;
        const ry = by + p.oy;

        // Subtle twinkling for galaxy stars
        if (Math.random() > 0.98) {
          p.alpha = p.baseAlpha * (0.6 + Math.random() * 0.4);
        }

        // Draw particle
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(rx, ry, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-auto"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
