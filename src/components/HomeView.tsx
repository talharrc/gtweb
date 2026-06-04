import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Brush, 
  Terminal, 
  Globe, 
  Award, 
  Eye, 
  Users, 
  Zap, 
  Mail, 
  Expand, 
  ChevronDown,
  Calendar,
  Sparkles,
  Layers,
  Code,
  Cloud,
  Database,
  Lock,
  CheckCircle,
  RefreshCw,
  LogOut,
  Wifi,
  HelpCircle,
  Compass,
  BookOpen,
  Brain,
  X,
  UserCheck,
  MessageSquare,
  Cpu
} from 'lucide-react';
import { PageType, FAQItem } from '../types';
import { googleSignIn, initAuth, logout } from '../lib/firebase';
import heroLaptopDashboard from '../assets/images/hero_laptop_dashboard_1780081071809.png';

interface HomeViewProps {
  onPageChange: (page: PageType) => void;
  isDhakaOpen: boolean;
  dhakaTime: string;
  currentUser: any | null;
  onSetInquiryPreset?: (preset: string) => void;
}

const TYPEWRITER_WORDS = ["Website Presence", "Social Media Engagement", "Client conversion"];

const WORK_ITEMS = [
  {
    title: "NeoVault Analytics",
    category: "Fintech Solution",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQ5sP8dVfbWPzUI062A6VR2rbpzdaMI9V6jyDD1K0Ey8PuLxUGESg28nw-85mxJDBwYzzEsUu0oKovGlRD800kTb5jFUNIQMTWRzKC_4Vhdhye0txxBq0XnbckCr_jXo9nCsV5tYPT_Sx6nVTUoyoth2gkcAlj5KlbSyrrDw0JU5ojp8uzkNYHadobD1ynCRbveoGPoxxDam3krGNpvwMfyCYGc4vJ_I-qw3lKT0QLdyinIT5iWPKTxNxSjx5auscHuL6fLhxd-A",
    desc: "A futuristic data visualizer featuring high-octane charting and enterprise vault analytics.",
    tags: ["Dev", "Design", "SaaS"]
  },
  {
    title: "Lumina Luxury",
    category: "E-Commerce",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvEFPfB8GtdlYUeTiz-4dQ9IQrt1C8Anbk4ltjkUS8N0sIJAviSus6Yh2ov_IKcDW_zYBCrEjx6Yv5DR0Grz2qjhOQZWT7Z1e9jsHG4oDBFe59dkwxxOheAOGCKvBZ5AlNcdzTFOwx4D4GI8e88_cBnjMGF9HkR6IRILMXfpxK2Se0YlqNpEPS9cw3HlurX-ciybxaY4FkY_f_weKy1n5Dd_Ux79d_aEABj1UgSvnAhZRZUtruWW90RRBAI2dl0emFO4bsjJBng6E",
    desc: "Optimized premium checkout engine and glassmorphic listings for global curator items.",
    tags: ["Full Stack", "Luxury UI"]
  }
];

const FAQS: FAQItem[] = [
  {
    question: "What is your typical project timeline?",
    answer: "Depending on the complexity, design and front-end prototypes can be launched in 4 to 8 weeks. Larger full-stack enterprise systems typically range from 8 to 12 weeks. We execute via rigid agile sprints with direct Client dashboard tracking."
  },
  {
    question: "Do you provide post-launch support and maintenance?",
    answer: "Absolutely. We offer flexible evolvement packages and technical support cycles to keep your digital solutions highly optimized, fast, and secure. We treat projects as continuous partnerships."
  },
  {
    question: "How do you coordinate design vs development phases?",
    answer: "Our designers and software engineers work in tight tandem. The brand identity system defines the modular library guidelines, allowing engineers to lay high-performance code pipelines in parallel."
  },
  {
    question: "Do you integrate with modern AI modules?",
    answer: "Yes, we specialize in implementing custom machine-learning features, generative audio/visual templates, and full LLM pipelines (such as Gemini) securely proxying keys server-side."
  }
];

const BRANDS = [
  { name: "Google", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvTG-9l6J7uJRtWhLdCPT0ayLXMaU08J4_BE2tA9oHHdECYpuHNB9GgbVJ8Nt9RC8ad-U9cmntC-pAYe8ZoKddB19GrYVqDzvL96_7ajzhZKP5wZ08cnWAVGg9vsdMnZXeMK5kYAYBAEnDqNyTQZawGUYee4uHdFUugRHTGvmsy8h9k0w5tg-CvVY4CoO9MAucDCJXIKM0SJ1loJ9k-_4oVNE2wcXVp-FMF1EIuQBSHOKWVoGZGh9zuiRpPzZ03Wy7h-OLVJphTqs" },
  { name: "Microsoft", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyjDZNnQTKqDlS3tibaUzoOv5M-ZmEekxYlFoNt1RVQRr8cXRdN_E4qtCtrK8li4qqbBk_dyFhNhk5gBHNfpugYH8WcCAx6wykVyS6ItYE3lantn8IqVcI21uMqqpoihrRo899yPsaNLOHEqpMy12tE3hPKJxeN2IHzYlfDqnRu2vtm7Lpr_YI4IUNN6Qgq9CY6YbfJt2iKGdRun0mjqfkyVQ3okjSyW07tevO1c5wHXCJ0k6eizSBm2SW_Bv9p6k2CKQrmnRRPL8" },
  { name: "Adobe", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjb5BHwKr4u1idajXS5Y1Xiv8Eqxe8awAmrNFT0B0A-XaY1TcY1TYjnByfw9mHIeF8WpWMkv9i3I3GFhF41L3I1G5yQJOAJdgZSCzkTpZVgZ9slPscRiFtrNr-RrHF46gNpE97tJ6SdgiIfMCEhs9xV5Zm8OpaUfNpX5fWc884tK1u-FujA-hNJJxijLju65zTIs9vTAjFuMMok07U8Q0P186QKpbGdxsM6FLjRnzoqEUO06BQj5Lzlh1BQXxV-ZNknOyiHOwWUwg" },
  { name: "PayPal", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJtwj53-lrMVNseFsJZNpMPCaWHhNSXa3Jp-3gxgc1zk02G3JZt4rfgi0pmARqFqETOm36PYTE6Ev32hXITKWVFEIy56HaCVdd3mvTA58rVBVBH0Me5mEc5wEfN1tQkFf2MIc9wt_jy57Y1PGhXoB_mGokXHo8I9kIknLqOlGpu3pv6ktCTqCBV4EI2L_zP_MZAC2oC8o8mmL43csQ5Nz3JGM5fJxrJEyiMKTLMSdo6WJDMVf0DTJTk43a6Sn2t46oFM33xF98rl0" },
  { name: "Meta", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuf9WQjaJ9IMTVuUCpC4JC8zShr2D1TL0v9lDIqyBDeo9Kgl8svGCg7rkzv6LxYj46Aj6vNVsSK37AzfpMg90SeKKKHiO-he47C7snXZW-vcgx8sLeebaKkEz3U3tDO30yWxmFnTz329SAhDmlicC6T_uR0jgrwWKRwn-zGXNgK8FKtq9mxy-vGvyxdJ7-puztAYjHvHLQxRxG6U3Z2YG-HxHRDe7Z2Nl5NMzHhcLuz5rtGHeF6zkKM0o9FjsSjkh0z50igFjhrF8" },
  { name: "Spotify", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ad4c9i8G505mJ80seAGJ77s8GzTiDjgwbu1eHtvvMGMtjcHnct9ip04sBW459da39zFjaVX4Q_cfZM_BuByiDO6igPof7LCAyOX4pQRrvIGHw-hu-j7MhazxkuNH_XfirYg-pYblM_uzZPPamJh_O1msWw3uc7wQkWjSIowU46gbwjQWmvR-I5GYrz8ssDcWolCZElKxzA0cA5afFp8cfFa2oEg1SddRuCBQGJpQrQtKjMAiMrjj-kB9E3C-owpITFnaLzegvdY" }
];

const AI_FEED_ITEMS = [
  {
    id: "feed-1",
    category: "AI News Flash",
    title: "Google Releases AI Tool to Convert Sketches into Gorgeous Artwork",
    summary: "A new standard that instantly transforms basic hand-drawn doodles into polished visual assets.",
    readTime: "45s read",
    content: "Google has released a new generative drawing canvas. Users can draw basic geometric layout drapes on screen, and the AI converts it into highly detailed digital art or custom cartoon assets for presentation slides. No technical coding training is required—simply draw and watch ideas materialize natively.",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
  },
  {
    id: "feed-2",
    category: "AI Prompt Tip",
    title: "Teach Your AI Assistant to Write in Your Exact Voice",
    summary: "A simple prompting trick to make emails sound organic and prevent robotic phrases.",
    readTime: "50s read",
    content: "Stop receiving responses starting with 'I hope this email finds you well.' Paste 3 real emails you've typed yourself and tell the AI: 'Analyze the sentence length, greeting structure, and tone of these samples. Memorize this style, and draft all future emails using these exact vocabulary coordinates.' This instantly reduces manual adjustment times by 80%.",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20"
  },
  {
    id: "feed-3",
    category: "LLM Comparison",
    title: "Audio Summarizers vs Long Audio Listening test",
    summary: "Testing shows how AI extracts clear action items from long voice recordings in seconds.",
    readTime: "60s read",
    content: "Why sit through a boring 1-hour recording? Our team ran automatic test transfers on voice notes. By feeding standard transcript logs into Gemini 3.5 models, the AI isolated the 3 most crucial takeaways, noted who said what, and compiled action plans in under 3 seconds with absolute clarity, saving hours of manual review.",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20"
  },
  {
    id: "feed-4",
    category: "AI News Flash",
    title: "Instant Video Generator for Slides and Presentations Launches",
    summary: "Generate realistic 5-second background animations for spreadsheets and text modules directly.",
    readTime: "40s read",
    content: "A new design tool incorporates micro-generative rendering directly inside standard slide builders. Simply double click any title box and select 'Animate Scene'—it generates cinematic vector background motion loops automatically inside the document, avoiding external software completely.",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20"
  },
  {
    id: "feed-5",
    category: "AI Prompt Tip",
    title: "Generate Entire Travel and Outing Itineraries in 3 Seconds",
    summary: "Let AI organize complex schedules, restaurant tags, and map locations tailored to budgets.",
    readTime: "45s read",
    content: "When traveling, prompt your assistant: 'Act as a premium local guide. Outline a tight, non-cliché 3-day itinerary for a group of 4 in Dhaka, budget $50/day. Balance walking tours with rest intervals, and highlight the historical significance of each street.' It structures a spectacular roadmap featuring Google Maps coordinates effortlessly.",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/20"
  }
];

function getFeedImage(item: any) {
  if (item && item.image) return item.image;
  const idStr = String((item && (item.id || item.title || "")) || "").toLowerCase();
  if (idStr.includes("sketch") || idStr.includes("feed-1") || idStr.includes("artwork") || idStr.includes("gorgeous")) {
    return "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400";
  }
  if (idStr.includes("voice") || idStr.includes("feed-2") || idStr.includes("assistant") || idStr.includes("write") || idStr.includes("tone")) {
    return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400";
  }
  if (idStr.includes("audio") || idStr.includes("feed-3") || idStr.includes("listening") || idStr.includes("recording")) {
    return "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=400";
  }
  if (idStr.includes("video") || idStr.includes("feed-4") || idStr.includes("launcher") || idStr.includes("slides") || idStr.includes("presentation")) {
    return "https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&q=80&w=400";
  }
  if (idStr.includes("travel") || idStr.includes("feed-5") || idStr.includes("itinerary") || idStr.includes("schedule")) {
    return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400";
  }
  return "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=400";
}

const PHILOSOPHY_PILLARS = [
  {
    id: "visceral",
    label: "Sensory Engagement",
    icon: Sparkles,
    title: "Visceral Dark UI & Fluid Animations",
    subtitle: "High-contrast, stunning visual rhythms that captivate the eye.",
    content: "We craft dark, ultra-premium interfaces designed to command attention and sustain active interest. Every micro-interaction, hover reaction, and transition logic is engineered with precision, establishing an unforgettable premium signature layout for your digital experience.",
    metricValue: "100%",
    metricLabel: "Bespoke Curation",
    badge: "Visual Excellence",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "frictionless",
    label: "Conversion Mechanics",
    icon: Layers,
    title: "Frictionless Interactive Pathways",
    subtitle: "Turn raw web traffic into qualified business pipelines.",
    content: "Beautiful layouts are useless without conversion power. We build strategic, interactive pathways featuring custom popups, instant-action callback forms, and responsive visual guides, lowering barrier parameters to directly upgrade your lead velocity.",
    metricValue: "3x+",
    metricLabel: "Lead Conversions",
    badge: "Optimized UX Rate",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: "speed",
    label: "Extreme Performance",
    icon: Zap,
    title: "Sub-100ms Featherspeed Core",
    subtitle: "If it takes more than 100ms, it's lag. Zero compromise.",
    content: "Meticulous UI design demands pristine latency. We reject visual bloated scripts and heavy client-side templates. Our optimized build structures achieve near-instantaneous page paints and superfluid load times, guaranteeing that speed is integrated as part of your premium brand.",
    metricValue: "< 90ms",
    metricLabel: "Median Screen Paint",
    badge: "Pristine Latency",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
  }
];

export default function HomeView({ onPageChange, isDhakaOpen, dhakaTime, currentUser, onSetInquiryPreset }: HomeViewProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [buildMins, setBuildMins] = useState(42);
  const [activePillar, setActivePillar] = useState('visceral');
  const [activeAutomationPopup, setActiveAutomationPopup] = useState<any | null>(null);

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [dynamicFeed, setDynamicFeed] = useState<any[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [feedSource, setFeedSource] = useState('static');
  const [selectedFeed, setSelectedFeed] = useState<any | null>(null);

  // Google Sheets admin status states
  const [adminStatus, setAdminStatus] = useState<{
    connected: boolean;
    adminEmail: string | null;
    spreadsheetId: string | null;
    spreadsheetUrl: string | null;
    queueSize: number;
  }>({
    connected: false,
    adminEmail: null,
    spreadsheetId: null,
    spreadsheetUrl: null,
    queueSize: 0
  });
  const [isSyncing, setIsSyncing] = useState(false);

  // Interactive AI Sandbox & Operations Simulation States
  const [sandboxWorkflow, setSandboxWorkflow] = useState<'support' | 'sales' | 'finance' | 'seo'>('support');
  const [sliderValue, setSliderValue] = useState(1200);
  const [visualStep, setVisualStep] = useState(1);

  // Sync client-side Google OAuth token with Express backend
  async function syncTokenWithBackend(token: string) {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/admin/authorize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: token })
      });
      if (res.ok) {
        const result = await res.json();
        setAdminStatus({
          connected: true,
          adminEmail: result.adminEmail,
          spreadsheetId: result.spreadsheetId,
          spreadsheetUrl: result.spreadsheetUrl,
          queueSize: 0
        });
      }
    } catch (err) {
      console.error("Backing token synchronization failed", err);
    } finally {
      setIsSyncing(false);
    }
  }

  const handleAdminSignIn = async () => {
    setIsSyncing(true);
    try {
      const result = await googleSignIn();
      if (result) {
        await syncTokenWithBackend(result.accessToken);
      }
    } catch (err) {
      console.error("Popup credentials signature signature failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAdminSignOut = async () => {
    setIsSyncing(true);
    try {
      await logout();
      setAdminStatus({
        connected: false,
        adminEmail: null,
        spreadsheetId: null,
        spreadsheetUrl: null,
        queueSize: 0
      });
    } catch (err) {
      console.error("Session shutdown error", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Check sync status from server and bind Google Auth listener
  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/admin/status");
        if (res.ok) {
          const status = await res.json();
          setAdminStatus(status);
        }
      } catch (e) {
        console.warn("Could not check server admin status", e);
      }
    }
    checkAuthStatus();

    const unsubscribe = initAuth(
      async (user, token) => {
        await syncTokenWithBackend(token);
      },
      () => {
        // No active credentials
      }
    );
    return () => unsubscribe();
  }, []);

  // Load live AI feed from full-stack backend
  useEffect(() => {
    async function fetchLiveFeed() {
      try {
        setIsLoadingFeed(true);
        const res = await fetch("/api/feed");
        const data = await res.json();
        if (data && data.items && data.items.length > 0) {
          setDynamicFeed(data.items);
          setFeedSource(data.source);
        } else {
          setDynamicFeed([]);
          setFeedSource("static_fallback");
        }
      } catch (err) {
        console.warn("Could not fetch daily dynamic AI Feed, using client-side static generator.", err);
        setDynamicFeed([]);
        setFeedSource("static_fallback_error");
      } finally {
        setIsLoadingFeed(false);
      }
    }
    fetchLiveFeed();
  }, []);

  // Read subscription status from cookie or localStorage on mount
  useEffect(() => {
    const isSub = localStorage.getItem('subscribed_ai_brief');
    if (isSub === 'true') {
      setIsSubscribed(true);
    }
  }, []);

  // Dynamic but stable deployment heartbeat minutes
  useEffect(() => {
    const currentMins = new Date().getMinutes();
    setBuildMins(currentMins === 0 ? 60 : currentMins);
    const interval = setInterval(() => {
      setBuildMins((prev) => (prev >= 59 ? 1 : prev + 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter loop logic
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % TYPEWRITER_WORDS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-28 pb-16 overflow-hidden">
        {/* Background Laptop Mockup Image - Bleeds beautifully behind */}
        <div className="absolute inset-0 z-0 select-none overflow-hidden bg-[#0b1326]">
          <img 
            alt="Hero MacBook Atmosphere" 
            className="w-full h-full object-cover opacity-68 contrast-105 scale-100 pointer-events-none"
            style={{ 
              maskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,1) 40%, rgba(0,0,0,0.15) 85%, rgba(0,0,0,0) 100%)'
            }}
            src={heroLaptopDashboard}
            referrerPolicy="no-referrer"
          />
          {/* Main diagonal theme gradient overlay for color-tint and glassmorphic finish */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0b1326] via-[#8b2cff]/6 to-[#ff2c6d]/6 pointer-events-none" />
          
          {/* Deeper top-down dark vignette to perfectly contrast the white text from the bright cityscape skyline */}
          <div className="absolute inset-x-0 top-0 h-[60%] bg-gradient-to-b from-[#0b1326] via-[#0b1326]/90 to-transparent pointer-events-none" />
          
          {/* Top-down premium violet shadow bleed */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-[#8b2cff]/10 via-transparent to-transparent pointer-events-none" />
          
          {/* Bottom-up warm shadow bleed to transition seamlessly to the page background */}
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b1326] to-transparent pointer-events-none" />
          
          {/* Subtle cybernetically placed ambient radial glows to frame the notebook area */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#8b2cff]/12 blur-[90px] rounded-full pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 w-[350px] h-[350px] bg-[#ff2c6d]/10 blur-[90px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10 pt-12">
          {/* Autonomous Status Pill */}
          <div className="inline-flex items-center gap-2.5 bg-black/50 backdrop-blur-md rounded-full px-5 py-2.5 mb-8 border border-red-500/20 shadow-[0_0_15px_rgba(239, 68, 68, 0.1)]">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
            <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-[#fff] uppercase">
              AUTONOMOUS OPTIMIZATION • AGENTS ACTIVE • LAST BUILD: {buildMins}M AGO
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Assure your brand's <br className="hidden md:block" />
            <span className="font-serif italic font-bold typewriter-container block min-h-[1.15em] mt-2 pb-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ y: 35, opacity: 0, filter: "blur(5px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -35, opacity: 0, filter: "blur(5px)" }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block text-gradient"
                >
                  {TYPEWRITER_WORDS[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-sans">
            By investing only FIVE minutes, giving us some information about your business.
          </p>

          <div className="flex justify-center">
            <button 
              onClick={() => onPageChange('contact')}
              className="bg-black/40 backdrop-blur-md border border-white/10 group flex items-center gap-4 text-white hover:text-primary hover:border-primary/50 font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-2xl cursor-pointer"
            >
              <span className="w-10 h-10 primary-gradient text-white rounded-full flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                <ArrowUpRight className="w-5 h-5" />
              </span>
              <span className="text-md font-bold text-white">Book an Audit</span>
            </button>
          </div>
        </div>
      </section>



      {/* 2. Today's AI Feed Section */}
      {(() => {
        const todayDate = new Date();
        const dateHash = todayDate.getDate() + todayDate.getMonth() * 3;
        
        let todayFeed = dynamicFeed;
        if (!todayFeed || todayFeed.length === 0) {
          const feed1 = AI_FEED_ITEMS[dateHash % AI_FEED_ITEMS.length];
          const feed2 = AI_FEED_ITEMS[(dateHash + 2) % AI_FEED_ITEMS.length];
          const feed3 = AI_FEED_ITEMS[(dateHash + 4) % AI_FEED_ITEMS.length];
          todayFeed = [feed1, feed2, feed3];
        }

        const formattedDate = todayDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }).toUpperCase();

        return (
          <section className="py-24 bg-gradient-to-b from-[#0b1326] via-black/40 to-[#0b1326] border-b border-white/5 relative overflow-hidden text-left">
            {/* Soft backdrop glow points */}
            <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-primary/5 blur-[100px] rounded-full -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-secondary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              
              {/* Header block centered */}
              <div className="text-center mx-auto max-w-2xl mb-16 space-y-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-primary-light font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase flex items-center gap-2">
                    AI Automated Core • Active briefing 
                    {feedSource === "gemini_api" && (
                      <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-extrabold tracking-widest border border-emerald-500/20 uppercase animate-pulse">
                        Cloud Live
                      </span>
                    )}
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
                  Today's AI Feed
                </h2>
                <p className="text-white/50 text-xs sm:text-sm mt-1 max-w-xl mx-auto font-sans col">
                  A daily automated stream of verified news flashes, battle-tested prompt maps, and direct LLM metrics.
                </p>
                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 font-mono text-xs text-white/80 shadow-sm mt-4">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              {/* Grid: 3 Live Cards + 1 CTA Newsletter Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoadingFeed ? (
                  // Shimmering skeleton loader cards
                  Array.from({ length: 3 }).map((_, idx) => (
                    <div 
                      key={`skeleton-${idx}`}
                      className="glass-card p-8 rounded-[2rem] border border-white/5 shadow-xl text-left min-h-[420px] h-full flex flex-col justify-between animate-pulse pointer-events-none"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="h-4 w-20 bg-white/10 rounded-full" />
                          <div className="h-3 w-10 bg-white/10 rounded-full" />
                        </div>
                        <div className="w-full h-32 bg-white/5 border border-white/10 rounded-xl mb-4" />
                        <div className="h-6 w-3/4 bg-white/10 rounded-lg mb-3" />
                        <div className="h-3 w-full bg-white/5 rounded mt-2" />
                        <div className="h-3 w-5/6 bg-white/5 rounded mt-2" />
                      </div>
                      <div className="h-3 w-20 bg-white/10 rounded mt-4" />
                    </div>
                  ))
                ) : (
                  todayFeed.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedFeed(item)}
                      className="glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-all duration-500 border border-white/5 hover:border-primary/20 shadow-xl text-left cursor-pointer group flex flex-col justify-between min-h-[420px] h-full relative overflow-hidden animate-fade-in"
                    >
                      <span className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/2 blur-2xl group-hover:bg-primary/5 transition-colors" />
                      
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${item.badgeColor || "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"}`}>
                              {item.category}
                            </span>
                            <span className="text-[10px] font-mono text-white/45 flex items-center gap-1">
                              ⚡ {item.readTime}
                            </span>
                          </div>

                          {/* Image Box */}
                          <div className="w-full h-32 rounded-xl overflow-hidden border border-white/10 mb-4 bg-black/40 relative">
                            <img 
                              src={getFeedImage(item)} 
                              alt={item.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          </div>
                          
                          <h3 className="font-display text-base font-bold text-white group-hover:text-primary transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-white/50 text-[11.5px] leading-relaxed mt-2 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-colors text-[11px] font-bold uppercase tracking-wider mt-4 pt-4 border-t border-white/5">
                          <span>Read Brief</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Newsletter CTA Card with matching min-h */}
                <div className="primary-gradient p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[420px] h-full text-left border border-white/10">
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div>
                    <span className="px-3 py-1 text-[9px] font-semibold uppercase tracking-widest rounded-full border border-white/30 bg-white/10 text-white select-none">
                      Briefing List
                    </span>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-4 leading-snug">
                      Want today's AI brief directly?
                    </h3>
                    <p className="text-white/80 text-[11px] sm:text-xs leading-relaxed mt-2 font-sans">
                      Join our list to receive these automated bite-sized summaries every single day.
                    </p>
                  </div>

                  {isSubscribed ? (
                    <div className="flex items-center gap-2.5 bg-white/10 rounded-2xl p-3 border border-white/20">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-white">Subscribed successfully! 🚀</span>
                    </div>
                  ) : (
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (email.trim() && email.includes("@")) {
                          try {
                            const res = await fetch("/api/newsletter/subscribe", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ email }),
                            });
                            if (res.ok) {
                              setIsSubscribed(true);
                              localStorage.setItem('subscribed_ai_brief', 'true');
                            }
                          } catch (err) {
                            // Offline/Fallback mechanism
                            setIsSubscribed(true);
                            localStorage.setItem('subscribed_ai_brief', 'true');
                          }
                        }
                      }}
                      className="space-y-2 mt-4"
                    >
                      <div className="flex gap-2">
                        <input 
                          type="email" 
                          required 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter email..."
                          className="bg-black/20 focus:bg-black/35 text-white placeholder-white/50 text-xs rounded-xl px-3.5 py-2.5 w-full focus:outline-none border border-white/10 focus:border-white/35 transition-colors"
                        />
                        <button 
                          type="submit"
                          className="bg-white text-black hover:bg-white/90 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer shrink-0"
                        >
                          Join
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>

            {/* Google Sheets and Google Drive Integration Panel */}
            <div className="mt-12 glass-card rounded-3xl p-6 sm:p-8 border border-white/10 bg-black/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 blur-[50px] rounded-full pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Database className="w-5 h-5 text-primary" />
                    <h3 className="font-display text-lg font-bold text-white">Google Workspace Database Sync</h3>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono tracking-wider font-bold border ${adminStatus.connected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                      {adminStatus.connected ? 'ONLINE • DIRECT SYNC' : 'OFFLINE • QUEUED MODE'}
                    </span>
                  </div>
                  <p className="text-white/60 text-xs sm:text-sm font-sans max-w-2xl leading-relaxed">
                    With our advanced Google Drive & Sheets integration, newsletter subscribers are synced directly into your master tracking spreadsheet in real-time. If unlinked, entries are automatically cached in our high-reliability server queue.
                  </p>
                </div>

                <div className="shrink-0 flex flex-wrap items-center gap-3">
                  {isSyncing ? (
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 font-mono text-xs text-white/50">
                      <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                      <span>Syncing secure handshake...</span>
                    </div>
                  ) : adminStatus.connected ? (
                    <div className="space-y-2 w-full md:w-auto flex flex-col md:items-end">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-white/50">Synced to:</span>
                        <span className="text-xs font-bold text-white font-mono">{adminStatus.adminEmail}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {adminStatus.spreadsheetUrl && (
                          <a 
                            href={adminStatus.spreadsheetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold py-2 px-4 rounded-xl border border-white/10 transition-colors flex items-center gap-2 inline-flex"
                          >
                            <span>Open Tracker Sheet</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button 
                          onClick={handleAdminSignOut}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs font-bold py-2 px-4 rounded-xl border border-red-500/25 transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Disconnect</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      onClick={handleAdminSignIn}
                      className="gsi-material-button focus:outline-none cursor-pointer flex items-center justify-center shadow-lg"
                    >
                      <div className="gsi-material-button-state"></div>
                      <div className="gsi-material-button-content-wrapper flex items-center gap-2">
                        <div className="gsi-material-button-icon shrink-0">
                          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 block">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                            <path fill="none" d="M0 0h48v48H0z"></path>
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-950 pr-1 select-none">
                          Connect Google Sheets
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* Status and Queue Details */}
              <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/40">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-primary" />
                    <span>Scope: Drive & Sheets (with permission)</span>
                  </div>
                  {adminStatus.queueSize > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-400">
                      <span>•</span>
                      <span>{adminStatus.queueSize} pending offline subscriber(s)</span>
                    </div>
                  )}
                </div>
                <span>Server Node: Dhaka Studio Core</span>
              </div>
            </div>

          </div>
        </section>
      );
      })()}

      {/* 3. Must Have Automations for a Scalable Business */}
      <section className="py-24 relative overflow-hidden text-left bg-gradient-to-b from-[#0b1326]/30 to-black/40">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/2 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header block centered */}
          <div className="text-center mx-auto max-w-3xl mb-16 space-y-4">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-1 block font-mono">
              operational leverage engines
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
              Must Have Automations for a Scalable Business
            </h2>
            <p className="text-white/50 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-sans mt-2">
              Deploy our custom battle-tested agent layers to capture sales leakage, delight clients 24/7, and eliminate repetitive work entirely.
            </p>
          </div>

          {/* Automations Grid of 4 modular cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: "lead_capture",
                num: "01",
                title: "AI Lead Capture & Follow-up Automation",
                shortDesc: "Never miss a lead. Capture, qualify, and book organic traffic within 45 seconds on 100% autopilot.",
                icon: UserCheck,
                colorClass: "from-pink-500/20 to-violet-500/10 hover:border-pink-500/30",
                glowColor: "rgba(236,72,153,0.15)",
                whyImportant: "To ensure 100% of organic leads are touched instantly, increasing appointment conversions by up to 3x, while human reps sleep.",
                howWorks: "A local webhook monitors Calendly, lead forms, or chat bubbles. An instant voice/SMS response goes out within 45 seconds, booking a direct strategy meeting.",
                bestFor: ["Real estate agencies", "Service consultancies", "High-ticket agencies"]
              },
              {
                id: "customer_support",
                num: "02",
                title: "AI Customer Support Agent",
                shortDesc: "Resolve 70% of redundant tickets instantly with secure custom knowledge-base retrieval 24/7.",
                icon: MessageSquare,
                colorClass: "from-cyan-500/20 to-blue-500/10 hover:border-cyan-500/30",
                glowColor: "rgba(6,182,212,0.15)",
                whyImportant: "To reduce support dispatch overhead by 70%, keeping customers instantly satisfied with precise answers based on custom knowledge bases 24/7.",
                howWorks: "A custom LLM indexes your documentation, guides, or transaction logs. A black-tinted chat interface resolves standard user inquiries instantly, and routes complex edge-cases cleanly to human assistants.",
                bestFor: ["E-commerce stores", "Tech startups", "SaaS providers"]
              },
              {
                id: "content_marketing",
                num: "03",
                title: "AI Content and Social Media Automation",
                shortDesc: "Establish a pristine, daily visible social brand authority across LinkedIn, X, and Facebook completely hands-free.",
                icon: Sparkles,
                colorClass: "from-purple-500/20 to-fuchsia-500/10 hover:border-purple-500/30",
                glowColor: "rgba(168,85,247,0.15)",
                whyImportant: "To maintain 100% consistent visibility and professional social presence, cutting content curation time by over 90%.",
                howWorks: "An automated engine pulls top industry news, drafts custom opinion posts matching your exact brand tone, generates gorgeous abstract artwork, and schedules them directly across LinkedIn, X, and Facebook.",
                bestFor: ["Personal brands", "SaaS marketers", "Design bureaus"]
              },
              {
                id: "internal_ops",
                num: "04",
                title: "AI Internal Operations Assistant",
                shortDesc: "Automate cross-platform reporting, ledger syncing, and email inquiries to save 20+ hours every single week.",
                icon: Cpu,
                colorClass: "from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/30",
                glowColor: "rgba(16,185,129,0.15)",
                whyImportant: "To erase 20+ hours of weekly manual reporting tasks, data sync loops, and cross-checking errors.",
                howWorks: "Monitors incoming client emails, transcribes meetings, auto-populates Google Sheets, syncs Jira tickets, and pushes a daily simplified brief directly into the Slack/WhatsApp workspace.",
                bestFor: ["Agencies", "Operational squads", "Remote-first companies"]
              }
            ].map((auto) => (
              <div 
                key={auto.id}
                onClick={() => setActiveAutomationPopup(auto)}
                style={{ 
                  boxShadow: `0 10px 30px -15px ${auto.glowColor}`
                }}
                className={`glass-card p-8 rounded-[2rem] hover:bg-white/5 transition-all duration-500 bg-gradient-to-b ${auto.colorClass} border border-white/5 shadow-xl text-left cursor-pointer group flex flex-col justify-between min-h-[380px] relative overflow-hidden`}
              >
                {/* Visual backdrop numbers */}
                <span className="absolute -top-6 -right-6 font-display font-black text-8xl text-white/[0.015] group-hover:text-white/[0.03] select-none pointer-events-none transition-colors">
                  {auto.num}
                </span>

                <div>
                  {/* Icon & Badge */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 text-white shrink-0 group-hover:scale-105 group-hover:bg-white/10 group-hover:text-primary transition-all duration-300">
                      <auto.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono text-white/35 font-bold uppercase tracking-wider">MODULE {auto.num}</span>
                  </div>

                  {/* Title & Short Description */}
                  <h3 className="font-display text-[17px] sm:text-[18px] font-extrabold text-white group-hover:text-primary transition-colors leading-snug">
                    {auto.title}
                  </h3>
                  
                  <p className="text-white/50 text-[11.5px] leading-relaxed mt-3.5">
                    {auto.shortDesc}
                  </p>
                </div>

                {/* Styled Why CTA */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveAutomationPopup(auto);
                  }}
                  className="mt-6 flex items-center justify-between bg-white/5 hover:bg-white/10 text-white hover:text-primary font-sans text-xs font-bold py-2.5 px-4 rounded-full border border-white/10 hover:border-primary/50 transition-all duration-300 w-full group cursor-pointer focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    Why
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>

          {/* Black-tinted Glassmorphic Popup Modal */}
          <AnimatePresence>
            {activeAutomationPopup && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop Blur overlay */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setActiveAutomationPopup(null)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                
                {/* Modal Container */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ type: "spring", duration: 0.45 }}
                  className="relative z-10 w-full max-w-lg bg-[#060a12]/95 border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-left backdrop-blur-xl overflow-hidden animate-fade-in"
                >
                  {/* Neon border line accent on top */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent" />
                  
                  {/* Floating Large background Number */}
                  <span className="absolute -top-10 -right-6 font-display font-black text-9xl text-white/[0.02] select-none pointer-events-none">
                    {activeAutomationPopup.num}
                  </span>

                  {/* Close button */}
                  <button 
                    onClick={() => setActiveAutomationPopup(null)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-pointer focus:outline-none p-1 bg-white/5 hover:bg-white/10 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="space-y-6">
                    {/* Header: Icon + Title */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary/10 rounded-2.5xl flex items-center justify-center border border-primary/20 text-primary shrink-0">
                        <activeAutomationPopup.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-[#ff2c6d] font-bold uppercase block">Must-Have Automation {activeAutomationPopup.num}</span>
                        <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-snug">{activeAutomationPopup.title}</h3>
                      </div>
                    </div>

                    <div className="h-[1px] bg-white/10" />

                    {/* Content Fields */}
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-primary font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5" /> Why it's important:
                        </h4>
                        <p className="text-white/80 text-xs sm:text-sm font-sans leading-relaxed">
                          {activeAutomationPopup.whyImportant}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-primary font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-1.5 flex items-center gap-1.5">
                          <Terminal className="w-3.5 h-3.5" /> How it works:
                        </h4>
                        <p className="text-white/80 text-xs sm:text-sm font-sans font-light leading-relaxed">
                          {activeAutomationPopup.howWorks}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-primary font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.15em] uppercase mb-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> Best For:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {activeAutomationPopup.bestFor.map((tag: string, i: number) => (
                            <span 
                              key={i}
                              className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-800/30 rounded-lg px-2.5 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action CTA */}
                    <button
                      onClick={() => {
                        if (onSetInquiryPreset) {
                          onSetInquiryPreset(activeAutomationPopup.title);
                        }
                        setActiveAutomationPopup(null);
                        onPageChange('contact');
                      }}
                      className="w-full mt-2 primary-gradient hover:opacity-90 text-white font-sans text-xs sm:text-sm font-extrabold uppercase tracking-widest py-4 px-6 rounded-2xl transition-all shadow-[0_10px_35px_-10px_rgba(139,44,255,0.4)] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <span>I want this</span>
                      <ArrowRight className="w-4 h-4 translate-y-[0.5px]" />
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 4. Visual AI-Powered Live Operations Workflow Engine */}
      <section className="py-24 bg-black/15 relative overflow-hidden text-left border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-mono block mb-2">
                how we work
              </span>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Get solutions, tailored <br />
                <span className="text-gradient font-black">specially for your business.</span>
              </h2>
            </div>
            <p className="text-white/50 text-xs sm:text-sm max-w-sm font-sans">
              We skip dry templates. Click through our operations roadmap to see exactly how your customized agency systems are analyzed, crafted, and launched.
            </p>
          </div>

          {/* Interactive Steps navigation nodes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            
            {/* Step 1 card */}
            <div 
              onClick={() => setVisualStep(1)}
              className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-300 text-left relative overflow-hidden cursor-pointer ${
                visualStep === 1 
                  ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/30 shadow-2xl scale-102 bg-black/45' 
                  : 'bg-black/25 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] font-bold text-primary tracking-widest block uppercase">STEP 01</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 text-white">consult us</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6">
                Share your current operational constraints, growth targets, and custom sheets data with our senior architects in a 5-minute brief.
              </p>
              {visualStep === 1 && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-[10px] leading-relaxed text-white/40 mt-4 overflow-x-auto"
                >
                  <span className="text-primary-light font-bold">consultation_pipeline:</span><br />
                  - client: Inquiry brief initiated<br />
                  - objectives: Eradicate manual reporting<br />
                  - speed: immediate operational intake
                </motion.div>
              )}
            </div>

            {/* Step 2 card */}
            <div 
              onClick={() => setVisualStep(2)}
              className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-300 text-left relative overflow-hidden cursor-pointer ${
                visualStep === 2 
                  ? 'bg-gradient-to-br from-secondary/10 to-transparent border-secondary/30 shadow-2xl scale-102 bg-black/45' 
                  : 'bg-black/25 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/2 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] font-bold text-secondary tracking-widest block uppercase">STEP 02</span>
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 text-white">We research major aspects</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6">
                We perform a deep dive on your current data tunnels, API configurations, and workflows to map out a concrete AI blueprint.
              </p>
              {visualStep === 2 && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-[10px] leading-relaxed text-white/40 mt-4 overflow-x-auto"
                >
                  <span className="text-secondary-light font-bold">research_logs.yml:</span><br />
                  - scan: Data bottleneck identification [DONE]<br />
                  - schema: Sheet syncs -&gt; LLM trigger endpoints<br />
                  - feasibility: custom agent flow approved
                </motion.div>
              )}
            </div>

            {/* Step 3 card */}
            <div 
              onClick={() => setVisualStep(3)}
              className={`p-8 sm:p-10 rounded-[2.5rem] border transition-all duration-300 text-left relative overflow-hidden cursor-pointer ${
                visualStep === 3 
                  ? 'bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/30 shadow-2xl scale-102 bg-black/45' 
                  : 'bg-black/25 border-white/5 hover:border-white/15'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/2 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono text-[9px] font-bold text-cyan-400 tracking-widest block uppercase">STEP 03</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 text-white">We provide you a tailored solution</h3>
              <p className="text-white/50 text-xs sm:text-sm leading-relaxed mb-6">
                We bundle, deploy, and launch your bespoke AI system layer, complete with persistent Google Sheets database syncs and secure UI dashboards.
              </p>
              {visualStep === 3 && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-black/40 border border-white/5 p-4 rounded-2xl font-mono text-[10px] leading-relaxed text-white/40 mt-4 overflow-x-auto"
                >
                  <span className="text-cyan-400 font-bold">tailored_deployment_logs:</span><br />
                  - database_sync: Sheets table OK<br />
                  - interface_status: Secure workspace active<br />
                  - operational_savings: 20+ hours saved
                </motion.div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 5. Highlight Portfolios Section */}
      <section className="py-24 relative overflow-hidden text-left">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-4">
            <div>
              <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Visceral Showcase</span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">Our Recent Work</h2>
            </div>
            <button 
              onClick={() => onPageChange('portfolio')}
              className="text-primary hover:text-white transition-colors flex items-center gap-2 text-xs uppercase tracking-wider font-extrabold cursor-pointer focus:outline-none"
            >
              View All Portfolios <ArrowRight className="w-4.5 h-4.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {WORK_ITEMS.map((item, index) => (
              <div 
                key={index}
                onClick={() => onPageChange('portfolio')}
                className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl border border-white/5 aspect-[4/3] cursor-pointer"
              >
                <img 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out-expo grayscale group-hover:grayscale-0 opacity-80"
                  src={item.image}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full flex flex-col items-start">
                  <span className="px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-primary/20 text-white border border-white/20 backdrop-blur-md mb-4 font-display">
                    {item.category}
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-2 max-w-md">{item.desc}</p>
                  
                  <div className="flex gap-2">
                    {item.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] font-semibold text-white/50 tracking-wider">
                        #{tag} &bull;
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Active Brand Philosophy (Dynamic Interactive Bento Section) */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-black/20 via-[#060a12]/50 to-black/30 border-y border-white/5 text-left">
        {/* Glowing atmospheric circles */}
        <div className="absolute top-1/4 right-10 w-[400px] h-[400px] bg-primary/2 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 left-10 w-[400px] h-[400px] bg-secondary/1 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center md:text-left mb-16 max-w-xl">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase font-mono block mb-2">
              Our Visual Standpoint
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              Your business deserves <br />
              <span className="text-gradient font-black">being a BRAND!</span>
            </h2>
            <p className="text-white/50 text-xs sm:text-sm mt-3 font-sans">
              We construct exquisite interfaces designed to convey authority. Explore the UI/UX features we forge to make your business stand out as a premier brand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Tenet Selector Board (Left Columns) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {PHILOSOPHY_PILLARS.map((pillar) => {
                const IconComponent = pillar.icon;
                const isSelected = activePillar === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    onClick={() => setActivePillar(pillar.id)}
                    className={`p-6 rounded-[2rem] border text-left transition-all duration-300 relative overflow-hidden focus:outline-none cursor-pointer flex items-center gap-4 group ${
                      isSelected 
                        ? 'bg-gradient-to-r from-primary/10 to-transparent border-primary/30 shadow-[0_8px_30px_rgba(139,44,255,0.08)] bg-black/45' 
                        : 'bg-black/20 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isSelected 
                        ? 'bg-primary/20 text-primary border-primary/25' 
                        : 'bg-white/5 text-white/50 border-white/5 group-hover:text-white group-hover:bg-white/10'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <span className={`text-[9px] font-mono font-bold tracking-widest block mb-0.5 ${
                        isSelected ? 'text-primary' : 'text-white/40'
                      }`}>
                        {pillar.label}
                      </span>
                      <h4 className="font-display text-sm font-bold text-white transition-colors">
                        {pillar.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Tenet Display Frame (Right Columns) */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {PHILOSOPHY_PILLARS.map((pillar) => {
                  if (pillar.id !== activePillar) return null;
                  const IconComp = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="glass-card rounded-[2.5rem] border border-white/10 bg-black/45 p-8 md:p-12 shadow-3xl h-full flex flex-col justify-between relative overflow-hidden text-left"
                    >
                      {/* Background illustrative element */}
                      <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 select-none pointer-events-none">
                        <img 
                          src={pillar.image} 
                          alt="" 
                          className="w-full h-full object-cover scale-105 filter grayscale"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black" />
                      </div>

                      <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="px-3.5 py-1 rounded-full text-[9px] font-mono font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {pillar.badge}
                          </span>
                          <span className="text-[10px] text-white/40 font-mono">ACTIVE INTEGRITY PROTOCOL</span>
                        </div>

                        <div className="space-y-2 max-w-xl">
                          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                            {pillar.title}
                          </h3>
                          <p className="text-secondary-light font-sans text-xs sm:text-sm font-semibold italic">
                            "{pillar.subtitle}"
                          </p>
                        </div>

                        {/* Interactive illustrative visual block */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center pt-2">
                          <div className="md:col-span-3">
                            <p className="text-white/65 text-xs sm:text-sm leading-relaxed font-sans font-light">
                              {pillar.content}
                            </p>
                          </div>
                          {/* Image preview module inside philosophy card */}
                          <div className="md:col-span-2 rounded-2xl overflow-hidden border border-white/15 shadow-2xl relative h-[140px] group/phi-img shrink-0">
                            <img 
                              src={pillar.image} 
                              alt={pillar.title} 
                              className="w-full h-full object-cover group-hover/phi-img:scale-110 transition-transform duration-700" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-3 flex items-center gap-1">
                              <IconComp className="w-3.5 h-3.5 text-primary" />
                              <span className="text-[9px] font-mono text-white/80 uppercase font-bold tracking-wider">SECURE LAYER</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Display live operational target value metrics */}
                      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                        <div>
                          <p className="text-white/40 text-[9px] tracking-widest font-mono uppercase">Operational Metric</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-2xl sm:text-3xl font-display font-black text-white">{pillar.metricValue}</span>
                            <span className="text-white/60 text-xs font-sans">{pillar.metricLabel}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => onPageChange('contact')}
                          className="flex items-center gap-2 text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest font-mono transition-colors focus:outline-none"
                        >
                          <span>Execute with Dhaka HQ</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Accordion FAQs Section */}
      <section className="py-24 bg-[#060d20]/50 border-b border-white/5 text-left">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-center mb-16 text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFAQ === idx;
              return (
                <div 
                  key={idx} 
                  className="glass-card rounded-2xl overflow-hidden border-white/8 text-left transition-all hover:bg-white/5"
                >
                  <button 
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-sm sm:text-base text-white/95 focus:outline-none cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="px-6 pb-6 text-xs sm:text-sm text-white/60 font-sans leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="glass-card rounded-[3.5rem] p-12 md:p-20 relative overflow-hidden border border-white/10 shadow-3xl flex flex-col items-center text-center">
            
            {/* Glowing orb decors */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase block font-mono mb-4">
              stay ahead of the curve
            </span>
            
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold mb-6 text-white max-w-2xl leading-tight">
              Join us to get <span className="text-gradient font-black">AI Doze every day!</span>
            </h2>
            
            <p className="text-white/65 text-xs sm:text-sm max-w-lg mb-10 leading-relaxed font-sans">
              We curate high-frequency summaries of cutting-edge AI breakthroughs, bespoke automation workflows, and elegant UI design features delivered directly to your inbox.
            </p>

            {isSubscribed ? (
              <div className="flex flex-col items-center gap-3 bg-emerald-950/20 border border-emerald-500/25 p-6 rounded-3xl max-w-md w-full">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <span className="text-xs font-extrabold text-white uppercase tracking-wider block">Subscribed Successfully!</span>
                  <span className="text-[11px] text-white/50 block mt-1">Welcome to the daily AI Doze Briefing Club.</span>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (email.trim() && email.includes("@")) {
                    try {
                      const res = await fetch("/api/newsletter/subscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email }),
                      });
                      if (res.ok) {
                        setIsSubscribed(true);
                        localStorage.setItem('subscribed_ai_brief', 'true');
                      }
                    } catch (err) {
                      // Fallback/offline mechanism
                      setIsSubscribed(true);
                      localStorage.setItem('subscribed_ai_brief', 'true');
                    }
                  }
                }}
                className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-3 items-center justify-center"
              >
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your premium email address..."
                  className="bg-white/5 focus:bg-white/10 text-white placeholder-white/30 text-xs sm:text-sm rounded-full px-6 py-4 w-full focus:outline-none border border-white/10 focus:border-primary/50 transition-colors text-center sm:text-left font-sans"
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto bg-white hover:bg-neutral-200 text-black px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest transition-transform active:scale-95 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 9. Glassmorphic Modal Popup for brief description */}
      <AnimatePresence>
        {selectedFeed && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Tinted heavy backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeed(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />
            
            {/* Modal Body Card */}
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.55, bounce: 0.15 }}
              className="relative w-full max-w-lg glass-card rounded-[2.5rem] border border-white/10 p-8 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.8)] z-10 text-left overflow-hidden bg-black/60"
            >
              {/* Top ambient decor lights */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Close button */}
              <button 
                onClick={() => setSelectedFeed(null)}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer focus:outline-none"
                aria-label="Close modal"
              >
                &times;
              </button>
              
              <div className="flex items-center gap-3 mb-6">
                <span className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border ${selectedFeed.badgeColor}`}>
                  {selectedFeed.category}
                </span>
                <span className="text-[10px] font-mono text-white/45">
                  ⚡ {selectedFeed.readTime}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[9px] font-bold text-emerald-400 font-mono tracking-wider uppercase">
                  Verified Engine
                </span>
              </div>
              
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                {selectedFeed.title}
              </h3>
              
              <div className="h-[2px] w-12 bg-gradient-to-r from-primary to-secondary mb-6" />

              <p className="text-white/80 text-xs sm:text-sm leading-relaxed font-sans mb-8">
                {selectedFeed.content}
              </p>

              {/* Footer CTA direct embed within the Popup */}
              <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-white text-xs font-bold font-display">Daily AI Briefing Newsletter</p>
                  <p className="text-white/45 text-[10px] mt-0.5 leading-snug">Get quick automated briefs delivered every morning.</p>
                </div>
                {isSubscribed ? (
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase border border-emerald-500/20 tracking-wider">
                    Active Member
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setIsSubscribed(true);
                      localStorage.setItem('subscribed_ai_brief', 'true');
                    }}
                    className="bg-primary/20 hover:bg-primary/35 border border-primary/30 text-primary-light text-[10px] font-bold px-3.5 py-1.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer shrink-0"
                  >
                    Send to me
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
