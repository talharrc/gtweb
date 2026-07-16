import React, { useRef, useState } from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  light?: boolean;
}

export default function SpotlightCard({ children, className = "", style = {}, light = false }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative overflow-hidden ${className}`}
      style={{
        ...style,
      }}
    >
      {/* Background glow sweep */}
      {isHovered && (
        <div
          className="absolute pointer-events-none transition-opacity duration-300"
          style={{
            width: '320px',
            height: '320px',
            background: light
              ? 'radial-gradient(circle, rgba(254, 221, 0, 0.18) 0%, rgba(254, 221, 0, 0.04) 50%, transparent 100%)'
              : 'radial-gradient(circle, rgba(0,194,255,0.11) 0%, rgba(0,82,255,0.03) 50%, transparent 100%)',
            left: `${coords.x - 160}px`,
            top: `${coords.y - 160}px`,
            transform: 'translate3d(0, 0, 0)',
            zIndex: 1,
          }}
        />
      )}
      
      {/* Border glow ring */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300"
          style={{
            zIndex: 2,
            border: '1px solid transparent',
            backgroundImage: light
              ? `radial-gradient(circle 140px at ${coords.x}px ${coords.y}px, rgba(254, 221, 0, 0.45), rgba(217, 189, 0, 0.15), transparent 80%)`
              : `radial-gradient(circle 140px at ${coords.x}px ${coords.y}px, rgba(0, 194, 255, 0.35), rgba(0, 82, 255, 0.15), transparent 80%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
          }}
        />
      )}

      {/* Children container */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

