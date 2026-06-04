import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowUpRight, 
  SlidersHorizontal, 
  ExternalLink, 
  Award, 
  Zap, 
  Users, 
  ChevronRight,
  TrendingUp,
  Clock,
  Briefcase
} from 'lucide-react';
import { Project } from '../types';

const PORTFOLIO_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "NeoVault Analytics",
    category: "Development",
    description: "A futuristic data visualizer featuring high-octane charting and enterprise vault analytics.",
    longDescription: "NeoVault is an enterprise cyber-security dashboard designed to visualize massive data nodes without layout delays. Equipped with real-time reactive charting, interactive filters, and an elegant off-black glassmorphic portal, this solution transformed the client's internal system monitoring completely, delivering state-of-the-art server diagnostics.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjQ5sP8dVfbWPzUI062A6VR2rbpzdaMI9V6jyDD1K0Ey8PuLxUGESg28nw-85mxJDBwYzzEsUu0oKovGlRD800kTb5jFUNIQMTWRzKC_4Vhdhye0txxBq0XnbckCr_jXo9nCsV5tYPT_Sx6nVTUoyoth2gkcAlj5KlbSyrrDw0JU5ojp8uzkNYHadobD1ynCRbveoGPoxxDam3krGNpvwMfyCYGc4vJ_I-qw3lKT0QLdyinIT5iWPKTxNxSjx5auscHuL6fLhxd-A",
    tags: ["Dev", "Design", "SaaS", "Tailwind"],
    metrics: "99.9% uptime diagnostic tracking under loads",
    client: "NeoVault Inc. SF, California",
    timeline: "8 Weeks (Express)"
  },
  {
    id: "proj_2",
    title: "Lumina Luxury",
    category: "Design",
    description: "Optimized premium checkout engine and glassmorphic listings for global curator items.",
    longDescription: "Lumina Luxury reimagined curator e-commerce with a high-contrast elegant dark interface. The focus was heavily centered around desktop-first visual spacing and a smooth custom checkout funnel. We developed their full digital identity system, typography pairings, and layout animations to evoke a sense of digital craftsmanship.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvEFPfB8GtdlYUeTiz-4dQ9IQrt1C8Anbk4ltjkUS8N0sIJAviSus6Yh2ov_IKcDW_zYBCrEjx6Yv5DR0Grz2qjhOQZWT7Z1e9jsHG4oDBFe59dkwxxOheAOGCKvBZ5AlNcdzTFOwx4D4GI8e88_cBnjMGF9HkR6IRILMXfpxK2Se0YlqNpEPS9cw3HlurX-ciybxaY4FkY_f_weKy1n5Dd_Ux79d_aEABj1UgSvnAhZRZUtruWW90RRBAI2dl0emFO4bsjJBng6E",
    tags: ["UI/UX", "Brand manual", "Checkout Engine"],
    metrics: "+340% increase in checkout completions",
    client: "Lumina Curations Ltd.",
    timeline: "5 Weeks"
  },
  {
    id: "proj_3",
    title: "Cosmos Crypto Wallet",
    category: "Development",
    description: "Cyberpunk web platform optimized for fast token tracking and secure key storage.",
    longDescription: "Cosmos Web is a full-stack, client-authorized crypto tracker designed alongside responsive graph visualizers. The client requested a high-fidelity interface styled with neon accents and custom grid modules. We deployed the full single-screen experience, including continuous automated lint compliance.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6eaROwD9hbriZlnyZIF2HQA5nJ_Mf-XPIz_eHw8WBUj-BYtWAe_InluLBG64WYjbiu4vA8fRtEYq8eVvT3efDQAwkLoqZ4Y_DTqXCNeMQ5Rquy2jN5i0kQRm5KOw3v5NvnXwfrlqfF9Y25Du3D8nmaUKQsBftikByMN3xoTKk3KamVGTV2OhWODBXEqMeqU1433qYkaT07MG5t9RQXop8tAxK_0ivbRO5utoRn6aMYZ4p1EqmOhQSyVZmIOpl75NzjfQUItmIYKs",
    tags: ["React", "Crypto", "Web Sockets"],
    metrics: "Under 18ms real-time chart load state",
    client: "Cosmos Ventures Zurich",
    timeline: "10 Weeks"
  },
  {
    id: "proj_4",
    title: "Synaptic AI Assistant",
    category: "Marketing",
    description: "Launch campaign material, brand messaging guidelines, and conversion optimization audits.",
    longDescription: "Synaptic AI required a strategic, high-converting product release. GalaxaTech engineered their full marketing pipeline, including SEO audits, Google Tag integrations, and high-impact custom static landers containing interactive demos that generated record-breaking viral waiting-lists.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCvTG-9l6J7uJRtWhLdCPT0ayLXMaU08J4_BE2tA9oHHdECYpuHNB9GgbVJ8Nt9RC8ad-U9cmntC-pAYe8ZoKddB19GrYVqDzvL96_7ajzhZKP5wZ08cnWAVGg9vsdMnZXeMK5kYAYBAEnDqNyTQZawGUYee4uHdFUugRHTGvmsy8h9k0w5tg-CvVY4CoO9MAucDCJXIKM0SJ1loJ9k-_4oVNE2wcXVp-FMF1EIuQBSHOKWVoGZGh9zuiRpPzZ03Wy7h-OLVJphTqs",
    tags: ["Ad campaign", "SEO Audit", "CRO Funnel"],
    metrics: "45,000+ wait-list signups cataloged in 14 days",
    client: "Synaptic Labs Inc.",
    timeline: "4 Weeks (Express)"
  },
  {
    id: "proj_5",
    title: "Atmos Wellness App",
    category: "Design",
    description: "Avant-garde visual identity, typography system, and mobile mindfulness wireframe systems.",
    longDescription: "Atmos coordinates physical breath loop guides via responsive visual templates. We designed their mobile app wireframe library using custom space grids and soft night-safe twilight palettes that promote a sense of focus and calm.",
    image: "https://lh3.googleusercontent.com/aida/ADBb0ujbCWY1wOhrcaHzFJK_1aoDzmaTV2A7waiBWIzh8hHuJQfSp5VKrGrpIQUt3tLWxrzpCge8W7eTLbnyxHoziv2c5jfhdv4cEN8Q-4RghVtR1Eq_BX-ZFH4t8sgRre3IruodIbkvhzPIvR9tUrerplm387qmHFxlmhdLJJ_yE6aIlzA41f-OWbOhuhbalmCfJGihkaNqe6_FobeGyvd8p9SWlx2vfsfFmR1UfYAvO_gDn9dcYm1xMvbLSQ",
    tags: ["UI/UX", "Typography System", "Figma Design"],
    metrics: "Featured as a Best UI/UX Design system on Awwwards",
    client: "Atmos Wellness Co.",
    timeline: "6 Weeks"
  },
  {
    id: "proj_6",
    title: "Apex Logistics Platform",
    category: "Development",
    description: "Enterprise shipping monitor, real-time map visualizations, and cargo dispatch grids.",
    longDescription: "Apex coordinates fleet operations globally with complex data displays. GalaxaTech deployed the full front-end browser system, maintaining pixel-perfect responsive layouts on mobile. Our engineers integrated optimized React-memo hooks to render 5,000 active nodes smoothly.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4ad4c9i8G505mJ80seAGJ77s8GzTiDjgwbu1eHtvvMGMtjcHnct9ip04sBW459da39zFjaVX4Q_cfZM_BuByiDO6igPof7LCAyOX4pQRrvIGHw-hu-j7MhazxkuNH_XfirYg-pYblM_uzZPPamJh_O1msWw3uc7wQkWjSIowU46gbwjQWmvR-I5GYrz8ssDcWolCZElKxzA0cA5afFp8cfFa2oEg1SddRuCBQGJpQrQtKjMAiMrjj-kB9E3C-owpITFnaLzegvdY",
    tags: ["React", "Enterprise API", "Maps Integration"],
    metrics: "-40% reduction in average dispatch latency",
    client: "Apex Shipping Systems Inc.",
    timeline: "12 Weeks"
  }
];

export default function PortfolioView() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Design' | 'Development' | 'Marketing'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects = PORTFOLIO_PROJECTS.filter(p => {
    if (activeCategory === 'All') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="relative pt-32 pb-24 text-left">
      
      {/* 1. Page Header */}
      <section className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-secondary font-bold tracking-[0.25em] text-xs uppercase mb-3 block">
          Visceral Showcase
        </span>
        <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-white mb-6 leading-tight max-w-3xl mx-auto">
          Crafting Visceral <br />
          <span className="text-gradient">Digital Experiences</span>
        </h1>
        <p className="text-white/60 text-sm max-w-xl mx-auto leading-relaxed">
          Explore our completed systems spanning UI/UX design, core software development, and growth positioning. Styled for maximum aesthetic precision.
        </p>

        {/* Filter Toolbar */}
        <div className="flex justify-center mt-12">
          <div className="p-1 shadow-2xl bg-black/45 backdrop-blur-md border border-white/8 rounded-full flex gap-1">
            {(['All', 'Design', 'Development', 'Marketing'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all focus:outline-none cursor-pointer ${
                  activeCategory === cat 
                    ? 'primary-gradient text-white shadow-md' 
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Portfolio Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="group glass-card rounded-[2rem] overflow-hidden border-white/10 shadow-xl relative aspect-[4/3] cursor-pointer"
              >
                <img 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1200ms] ease-out-expo grayscale group-hover:grayscale-0 opacity-75"
                  src={project.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
                
                {/* Content Box inside element */}
                <div className="absolute bottom-0 left-0 p-6 w-full flex flex-col items-start translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-white border border-white/10 backdrop-blur-md mb-3 font-display">
                    {project.category}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mb-1.5 flex items-center gap-2 group-hover:text-primary transition-colors">
                    <span>{project.title}</span>
                    <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-white/50 text-[11px] leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
                    {project.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3. Interactive Detail Drawer / overlay Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-end px-0 md:px-4">
            {/* Backdrop cover overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md pointer-events-auto"
            />

            {/* Slide over layout container */}
            <motion.div
              initial={{ x: "100%", opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.9 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl h-full md:h-[94vh] bg-black/95 backdrop-blur-[35px] border-l md:border border-white/12 md:rounded-l-[2rem] md:rounded-r-none overflow-y-auto no-scrollbar shadow-[0_0_60px_rgba(0,0,0,0.85)] z-10 flex flex-col justify-between"
            >
              <div>
                {/* Header Image cover */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    alt={selectedProject.title} 
                    className="w-full h-full object-cover grayscale opacity-70"
                    src={selectedProject.image}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  
                  {/* Close button inside Drawer */}
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-5 right-5 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 flex items-center justify-center text-white cursor-pointer focus:outline-none transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Info Container */}
                <div className="p-8 md:p-10 text-left">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-white border border-white/10 backdrop-blur-md mb-4 inline-block font-display">
                    {selectedProject.category}
                  </span>
                  
                  <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white mb-6">
                    {selectedProject.title}
                  </h2>

                  <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-8 font-sans">
                    {selectedProject.longDescription}
                  </p>

                  <div className="h-[1px] bg-white/10 w-full mb-8" />

                  {/* Metadata Specs */}
                  <div className="grid grid-cols-2 gap-6 mb-8 font-sans">
                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 flex items-center gap-1.5 font-display">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <span>Client Partner</span>
                      </h4>
                      <p className="text-xs text-white font-medium">{selectedProject.client}</p>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1 flex items-center gap-1.5 font-display">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span>Duration Sprints</span>
                      </h4>
                      <p className="text-xs text-white font-medium">{selectedProject.timeline}</p>
                    </div>
                  </div>

                  {/* Metrics High Value Box */}
                  {selectedProject.metrics && (
                    <div className="bg-[#0b1326] border border-white/8 rounded-xl p-4 flex items-center gap-3.5 text-left mb-6 font-sans">
                      <TrendingUp className="w-6 h-6 text-secondary flex-shrink-0" />
                      <div>
                        <h4 className="text-[9px] uppercase font-bold text-white/40 tracking-wider">Audit Sprint Success Metric</h4>
                        <p className="text-xs text-white font-semibold">{selectedProject.metrics}</p>
                      </div>
                    </div>
                  )}

                  {/* Project technology badges */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {selectedProject.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="px-3 py-1 rounded-full bg-white/5 text-[10px] text-white/50 border border-white/5 font-sans font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              </div>

              {/* Bottom footer drawer actions */}
              <div className="p-8 border-t border-white/5 bg-black/60 backdrop-blur-md">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-full text-center py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-extrabold uppercase tracking-widest text-white transition-all cursor-pointer focus:outline-none"
                >
                  Return to Portfolios Grid
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
