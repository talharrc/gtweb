import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">
      <Helmet>
        <title>404 — GalaxaTech</title>
      </Helmet>

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/6 blur-[120px] rounded-full" />
      </div>

      <div className="text-center relative z-10">
        <p className="text-[120px] md:text-[180px] font-black text-white/5 leading-none select-none mb-0" style={{ fontFamily: 'var(--font-display)' }}>404</p>
        <div className="-mt-8 md:-mt-12 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>Lost in space.</h1>
          <p className="text-white/50 text-lg max-w-sm mx-auto">This page doesn't exist. Let's get you back to something real.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-full transition-all duration-300 shadow-[0_8px_30px_rgba(124,42,235,0.35)] flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" /> Go Home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 border border-white/15 hover:border-white/30 text-white font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
