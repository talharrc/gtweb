import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  isClientNode?: boolean;
  label?: string;
}

interface CountryNode {
  name: string;
  lat: number;
  lon: number;
  color: string;
}

const CLIENT_COUNTRIES: CountryNode[] = [
  { name: 'USA', lat: 37.0902, lon: -95.7129, color: '#00C2FF' }, // Center of USA
  { name: 'UK', lat: 55.3781, lon: -3.4360, color: '#0052FF' },
  { name: 'Pakistan', lat: 29.9490, lon: 69.3451, color: '#00C2FF' },
  { name: 'Saudi Arabia', lat: 23.8859, lon: 45.0792, color: '#1D4ED8' },
  { name: 'India', lat: 20.5937, lon: 78.9629, color: '#00C2FF' },
];

const DHAKA: CountryNode = { name: 'Dhaka', lat: 23.6850, lon: 90.3563, color: '#0052FF' };

// Simple mathematical function to approximate Earth's continents
function isLand(lat: number, lon: number): boolean {
  // North America
  if (lat > 15 && lat < 72 && lon > -168 && lon < -55) {
    if (lat < 30 && lon > -100 && lon < -80) return false; // Gulf of Mexico
    return true;
  }
  // South America
  if (lat > -55 && lat <= 15 && lon > -82 && lon < -35) {
    if (lat > 5 && lon > -50) return false;
    return true;
  }
  // Africa
  if (lat > -35 && lat < 35 && lon > -18 && lon < 51) {
    if (lat > 10 && lon < -10) return false;
    if (lat > 15 && lon > 40) return false;
    if (lat < -10 && lon > 40) return false;
    return true;
  }
  // Madagascar
  if (lat > -25 && lat < -12 && lon > 43 && lon < 51) return true;
  // Europe
  if (lat > 36 && lat < 72 && lon > -10 && lon < 45) {
    if (lat < 42 && lon > 0 && lon < 25) return false;
    return true;
  }
  // Asia
  if (lat > 5 && lat < 75 && lon >= 45 && lon < 180) {
    if (lat < 10 && lon > 80 && lon < 95) return false;
    if (lat < 25 && lon > 50 && lon < 65) return false;
    return true;
  }
  // Australia / Indonesia / Japan / New Zealand / Greenland
  if (lat > 30 && lat < 45 && lon > 130 && lon < 145) return true; // Japan
  if (lat > -10 && lat < 10 && lon > 95 && lon < 141) return true; // Indonesia
  if (lat > -40 && lat < -10 && lon > 113 && lon < 154) return true; // Australia
  if (lat > -47 && lat < -33 && lon > 166 && lon < 179) return true; // New Zealand
  if (lat > 60 && lat < 83 && lon > -75 && lon < -15) return true; // Greenland

  return false;
}

// Convert spherical coordinates to 3D Cartesian coordinates
function latLonToVector3D(lat: number, lon: number, radius: number): Point3D {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  return {
    x: -(radius * Math.sin(phi) * Math.sin(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.cos(theta),
  };
}

export default function InteractiveGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const rotationRef = useRef({ angleX: 0.2, angleY: 2.2, isDragging: false, startX: 0, startY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const radius = Math.min(width, height) * 0.35;
    const cameraDistance = 400;

    // Generate land points dynamically
    const landPoints: Point3D[] = [];
    const latStep = 4.5;
    const lonStep = 4.5;

    for (let lat = -80; lat < 80; lat += latStep) {
      for (let lon = -180; lon < 180; lon += lonStep) {
        if (isLand(lat, lon)) {
          landPoints.push(latLonToVector3D(lat, lon, radius));
        }
      }
    }

    // Set up client destination vectors
    const dhakaVec = latLonToVector3D(DHAKA.lat, DHAKA.lon, radius);
    const clientNodes = CLIENT_COUNTRIES.map(c => ({
      name: c.name,
      vec: latLonToVector3D(c.lat, c.lon, radius),
      color: c.color
    }));

    // Mouse drag handlers to spin the globe
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      rotationRef.current.isDragging = true;
      rotationRef.current.startX = e.clientX - rect.left;
      rotationRef.current.startY = e.clientY - rect.top;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = rotationRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (r.isDragging) {
        const dx = x - r.startX;
        const dy = y - r.startY;

        r.angleY += dx * 0.007;
        r.angleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, r.angleX + dy * 0.007));

        r.startX = x;
        r.startY = y;
      } else {
        // Simple hover detection on client nodes
        let hoverFound = false;
        const angleX = r.angleX;
        const angleY = r.angleY;
        const cosX = Math.cos(angleX);
        const sinX = Math.sin(angleX);
        const cosY = Math.cos(angleY);
        const sinY = Math.sin(angleY);

        const checkHover = (node: typeof clientNodes[0] | { name: string; vec: Point3D }) => {
          // Rotate point
          const v = node.vec;
          // Rotate Y
          const x1 = v.x * cosY - v.z * sinY;
          const z1 = v.z * cosY + v.x * sinY;
          // Rotate X
          const y2 = v.y * cosX - z1 * sinX;
          const z2 = z1 * cosX + v.y * sinX;

          if (z2 > 0) { // On the front side of the globe
            const scale = cameraDistance / (cameraDistance + z2);
            const rx = width / 2 + x1 * scale;
            const ry = height / 2 - y2 * scale;

            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            const dist = Math.sqrt((rx - mx) ** 2 + (ry - my) ** 2);

            if (dist < 15) {
              setHoveredNode(node.name);
              hoverFound = true;
            }
          }
        };

        clientNodes.forEach(checkHover);
        checkHover({ name: 'Dhaka (Base)', vec: dhakaVec });

        if (!hoverFound) {
          setHoveredNode(null);
        }
      }
    };

    const handleMouseUp = () => {
      rotationRef.current.isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const isMobile = window.innerWidth < 640;

    // Touch event handlers for mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const rect = canvas.getBoundingClientRect();
      rotationRef.current.isDragging = true;
      rotationRef.current.startX = e.touches[0].clientX - rect.left;
      rotationRef.current.startY = e.touches[0].clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1 || !rotationRef.current.isDragging) return;
      const r = rotationRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].clientY - rect.top;

      const dx = x - r.startX;
      const dy = y - r.startY;

      r.angleY += dx * 0.009;
      r.angleX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, r.angleX + dy * 0.009));

      r.startX = x;
      r.startY = y;
    };

    if (!isMobile) {
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleMouseUp);
    }

    // Handle resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const r = rotationRef.current;
      if (!r.isDragging) {
        r.angleY += 0.003; // Constant slow spin
      }

      const angleX = r.angleX;
      const angleY = r.angleY;
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw faint atmosphere glow circle
      ctx.beginPath();
      const glowGrad = ctx.createRadialGradient(centerX, centerY, radius * 0.9, centerX, centerY, radius * 1.15);
      glowGrad.addColorStop(0, 'rgba(0, 194, 255, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(0, 82, 255, 0.04)');
      glowGrad.addColorStop(1, 'rgba(3, 5, 16, 0)');
      ctx.fillStyle = glowGrad;
      ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Render world points
      for (let i = 0; i < landPoints.length; i++) {
        const p = landPoints[i];
        
        // 3D Rotation Y
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // 3D Rotation X
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        // Depth culling & perspective calculation
        const scale = cameraDistance / (cameraDistance + z2);
        const rx = centerX + x1 * scale;
        const ry = centerY - y2 * scale;

        // Visual depth cues (particles on back are smaller and extremely faint)
        if (z2 > -radius * 0.4) {
          const alpha = z2 > 0 ? (0.2 + (z2 / radius) * 0.45) : (0.2 * (1 + z2 / radius));
          const size = z2 > 0 ? (1.2 + (z2 / radius) * 0.8) : 1.0;
          ctx.fillStyle = `rgba(183, 175, 194, ${alpha * 0.75})`; // Muted gray-pink land points
          ctx.beginPath();
          ctx.arc(rx, ry, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Draw Connection Arcs
      clientNodes.forEach(c => {
        // Project Dhaka & Client points
        const dRotY1 = dhakaVec.x * cosY - dhakaVec.z * sinY;
        const dRotZ1 = dhakaVec.z * cosY + dhakaVec.x * sinY;
        const dRotY2 = dhakaVec.y * cosX - dRotZ1 * sinX;
        const dRotZ2 = dRotZ1 * cosX + dhakaVec.y * sinX;

        const cRotY1 = c.vec.x * cosY - c.vec.z * sinY;
        const cRotZ1 = c.vec.z * cosY + c.vec.x * sinY;
        const cRotY2 = c.vec.y * cosX - cRotZ1 * sinX;
        const cRotZ2 = cRotZ1 * cosX + c.vec.y * sinX;

        // Calculate 2D coordinates for endpoints
        const dScale = cameraDistance / (cameraDistance + dRotZ2);
        const dx2d = centerX + dRotY1 * dScale;
        const dy2d = centerY - dRotY2 * dScale;

        const cScale = cameraDistance / (cameraDistance + cRotZ2);
        const cx2d = centerX + cRotY1 * cScale;
        const cy2d = centerY - cRotY2 * cScale;

        // Draw arc ONLY if at least one endpoint is on the front, or render faintly on the back
        const isDhakaFront = dRotZ2 > -radius * 0.2;
        const isClientFront = cRotZ2 > -radius * 0.2;

        if (isDhakaFront || isClientFront) {
          // Compute 3D midpoint and lift it outwards to form an arc
          const midX = (dhakaVec.x + c.vec.x) / 2;
          const midY = (dhakaVec.y + c.vec.y) / 2;
          const midZ = (dhakaVec.z + c.vec.z) / 2;

          const midDist = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
          const arcHeight = radius * 0.45; // Height of arc above sphere surface
          
          // Control point in 3D
          const ctrlX = (midX / midDist) * (radius + arcHeight);
          const ctrlY = (midY / midDist) * (radius + arcHeight);
          const ctrlZ = (midZ / midDist) * (radius + arcHeight);

          // Apply rotation to control point
          const ctrlRotY1 = ctrlX * cosY - ctrlZ * sinY;
          const ctrlRotZ1 = ctrlZ * cosY + ctrlX * sinY;
          const ctrlRotY2 = ctrlY * cosX - ctrlRotZ1 * sinX;
          const ctrlRotZ2 = ctrlRotZ1 * cosX + ctrlY * sinX;

          const ctrlScale = cameraDistance / (cameraDistance + ctrlRotZ2);
          const ctrlX2d = centerX + ctrlRotY1 * ctrlScale;
          const ctrlY2d = centerY - ctrlRotY2 * ctrlScale;

          // Draw the bezier curve
          ctx.beginPath();
          ctx.moveTo(dx2d, dy2d);
          ctx.quadraticCurveTo(ctrlX2d, ctrlY2d, cx2d, cy2d);

          // Fade out the arc if it is turning towards the back
          const avgZ = (dRotZ2 + cRotZ2) / 2;
          const arcAlpha = Math.max(0.04, Math.min(0.4, (avgZ + radius) / (2 * radius)));

          ctx.strokeStyle = `rgba(0, 194, 255, ${arcAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Animate glowing signal particle traveling along the arc path
          const t = (Date.now() / 2400 + (c.name.charCodeAt(0) % 5) * 0.2) % 1.0;
          
          // Calculate quadratic Bezier position at t: P(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
          // Using rotated coordinates to get exact perspective correct rendering
          const ptRotX = (1 - t) ** 2 * dRotY1 + 2 * (1 - t) * t * ctrlRotY1 + t ** 2 * cRotY1;
          const ptRotY = (1 - t) ** 2 * dRotY2 + 2 * (1 - t) * t * ctrlRotY2 + t ** 2 * cRotY2;
          const ptRotZ = (1 - t) ** 2 * dRotZ2 + 2 * (1 - t) * t * ctrlRotZ2 + t ** 2 * cRotZ2;

          const ptScale = cameraDistance / (cameraDistance + ptRotZ);
          const px2d = centerX + ptRotX * ptScale;
          const py2d = centerY - ptRotY * ptScale;

          if (ptRotZ > 0) {
            ctx.fillStyle = `rgba(0, 82, 255, ${(1 - t) * 0.95})`; // Cobalt signal particles fading out as they arrive
            ctx.beginPath();
            ctx.arc(px2d, py2d, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Glow flare
            ctx.fillStyle = `rgba(0, 82, 255, ${(1 - t) * 0.25})`;
            ctx.beginPath();
            ctx.arc(px2d, py2d, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      // Draw Dhaka Base Node (Active)
      const dRotY1 = dhakaVec.x * cosY - dhakaVec.z * sinY;
      const dRotZ1 = dhakaVec.z * cosY + dhakaVec.x * sinY;
      const dRotY2 = dhakaVec.y * cosX - dRotZ1 * sinX;
      const dRotZ2 = dRotZ1 * cosX + dhakaVec.y * sinX;

      if (dRotZ2 > 0) {
        const dScale = cameraDistance / (cameraDistance + dRotZ2);
        const dx2d = centerX + dRotY1 * dScale;
        const dy2d = centerY - dRotY2 * dScale;

        // Pulses
        const pulseSize = 4 + (Math.sin(Date.now() / 200) * 2.5);
        ctx.fillStyle = 'rgba(0, 82, 255, 0.2)';
        ctx.beginPath();
        ctx.arc(dx2d, dy2d, pulseSize + 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0052FF'; // Core
        ctx.beginPath();
        ctx.arc(dx2d, dy2d, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.font = 'bold 9px monospace';
        ctx.fillStyle = '#0052FF';
        ctx.textAlign = 'center';
        ctx.fillText('Dhaka (Base)', dx2d, dy2d - 12);
      }

      // Draw client nodes
      clientNodes.forEach(c => {
        const cRotY1 = c.vec.x * cosY - c.vec.z * sinY;
        const cRotZ1 = c.vec.z * cosY + c.vec.x * sinY;
        const cRotY2 = c.vec.y * cosX - cRotZ1 * sinX;
        const cRotZ2 = cRotZ1 * cosX + c.vec.y * sinX;

        if (cRotZ2 > -radius * 0.1) {
          const cScale = cameraDistance / (cameraDistance + cRotZ2);
          const cx2d = centerX + cRotY1 * cScale;
          const cy2d = centerY - cRotY2 * cScale;

          // Pulse if hovered or standard
          const isHovered = hoveredNode === c.name;
          const pulseSize = isHovered 
            ? 7 + (Math.sin(Date.now() / 120) * 3) 
            : 3 + (Math.sin(Date.now() / 300) * 1.5);
          
          ctx.fillStyle = isHovered ? 'rgba(0, 194, 255, 0.4)' : 'rgba(0, 194, 255, 0.25)';
          ctx.beginPath();
          ctx.arc(cx2d, cy2d, pulseSize + 3, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#00C2FF'; // Core
          ctx.beginPath();
          ctx.arc(cx2d, cy2d, 3, 0, Math.PI * 2);
          ctx.fill();

          // Draw country text label if hovered or close to camera
          if (isHovered || cRotZ2 > radius * 0.5) {
            ctx.font = isHovered ? 'bold 10px monospace' : '9px monospace';
            ctx.fillStyle = isHovered ? '#fff' : 'rgba(255,255,255,0.7)';
            ctx.textAlign = 'center';
            ctx.fillText(c.name, cx2d, cy2d - 10);
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: typeof window !== 'undefined' && window.innerWidth < 640 ? 'auto' : 'none' }}
      />
      {hoveredNode && (
        <div className="absolute bottom-4 bg-[#030510]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-xs font-mono font-semibold text-white pointer-events-none shadow-lg animate-fadeIn">
          Connected Node: <span className="text-[#00C2FF]">{hoveredNode}</span>
        </div>
      )}
    </div>
  );
}
