import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, ArrowLeft, ArrowUpRight, Cpu, Laptop, Workflow, Package, Check, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  desc: string;
  price: string;
  type: 'subscription' | 'one-time';
  category: 'AI' | 'Templates' | 'Systems';
  features: string[];
  icon: React.ComponentType<any>;
  color: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod_agent',
    name: 'Galaxa Agent Pro',
    desc: 'Bespoke multi-agent AI system managing your sales pipeline, lead triage, and email automations.',
    price: '$299 / mo',
    type: 'subscription',
    category: 'AI',
    features: ['Custom system prompt design', '24/7 autonomous triage', 'Stripe & CRM sync integrations', 'Dedicated support SLA'],
    icon: Cpu,
    color: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
  {
    id: 'prod_notion',
    name: 'Notion Operating System',
    desc: 'The complete enterprise operating system — custom task databases, OKR tracking, client portals, and wiki docs.',
    price: '$99',
    type: 'one-time',
    category: 'Systems',
    features: ['Complete project management boards', 'Client portal templates', 'SOP library structure', 'Lifetime updates included'],
    icon: Workflow,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  {
    id: 'prod_react',
    name: 'High-Conversion React Blueprint',
    desc: 'Dynamic, premium landing page source code built with React 19, Vite, and Framer Motion for maximum performance.',
    price: '$149',
    type: 'one-time',
    category: 'Templates',
    features: ['Twinkling galaxy background canvas', 'Dotted 3D network globe', 'Fully responsive mobile reflows', 'SEO & metadata structured'],
    icon: Laptop,
    color: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  {
    id: 'prod_chatbot',
    name: 'AI Support Desk Widget',
    desc: 'A ready-made, embeddable chat widget trained on your database to resolve customer queries instantly.',
    price: '$399 / mo',
    type: 'subscription',
    category: 'AI',
    features: ['Trained on your custom docs/FAQs', 'Smooth iframe embedding', 'Live handoff to WhatsApp', 'Analytics dashboard panel'],
    icon: Package,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
];

export default function BrowseView() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'AI' | 'Templates' | 'Systems'>('All');
  const [purchased, setPurchased] = useState<string | null>(null);

  const filtered = PRODUCTS.filter(p => selectedCategory === 'All' || p.category === selectedCategory);

  const handleBuy = (id: string) => {
    setPurchased(id);
    setTimeout(() => setPurchased(null), 2500);
  };

  return (
    <div className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 min-h-screen">
      <Helmet>
        <title>Browse Products — GalaxaTech</title>
        <meta name="description" content="Shop readymade tech ecosystems, premium templates, and custom AI subscription models built by GalaxaTech." />
      </Helmet>

      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </button>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight font-display">Galaxa Store</h1>
            <p className="text-white/50 text-sm mt-1">Acquire ready-made digital ecosystems and custom AI subscriptions built for scale.</p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 self-start sm:self-auto">
            <ShoppingBag className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Browse Store</span>
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex gap-2.5 mb-10 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'AI', 'Templates', 'Systems'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedCategory === cat
                  ? 'bg-primary/20 border-primary/50 text-white'
                  : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map(prod => {
            const ProdIcon = prod.icon;
            const isBought = purchased === prod.id;
            return (
              <div
                key={prod.id}
                className="glass-card-premium border border-white/10 p-7 rounded-3xl flex flex-col justify-between hover:border-primary/30 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Back glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div>
                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${prod.color}`}>
                      <ProdIcon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-white font-extrabold text-xl leading-none">{prod.price}</p>
                      <p className="text-[10px] font-mono text-white/30 uppercase mt-1 tracking-wider">{prod.type}</p>
                    </div>
                  </div>

                  <h3 className="text-white font-bold text-lg mb-2 font-display">{prod.name}</h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6">{prod.desc}</p>

                  <div className="border-t border-white/5 pt-5 mb-8">
                    <p className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold mb-3.5">What's Included</p>
                    <ul className="flex flex-col gap-2.5">
                      {prod.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-white/70">
                          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => handleBuy(prod.id)}
                  disabled={isBought}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 min-h-[46px] cursor-pointer ${
                    isBought
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/10 text-white'
                  }`}
                >
                  {isBought ? (
                    <>
                      <Check className="w-4 h-4" /> Purchased!
                    </>
                  ) : (
                    <>
                      Secure Asset <ArrowUpRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
