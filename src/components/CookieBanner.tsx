import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CookieBanner() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('gt_cookies_accepted');
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem('gt_cookies_accepted', 'true');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center px-4 sm:px-6 py-4 sm:py-5">
      <div className="glass-card rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-full shadow-[0_-4px_30px_rgba(0,0,0,0.4)]">
        <p className="text-sm text-white/65 flex-1 text-center sm:text-left">
          We use cookies to improve your experience.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/privacy')}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Learn More
          </button>
          <button
            onClick={accept}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-full transition-all"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
