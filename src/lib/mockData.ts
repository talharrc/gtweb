import { GTProject, UserProfile, Product, Order } from '../types';

export interface Payment {
  id: string;
  projectId: string;
  projectName: string;
  builderUid: string;
  builderName: string;
  projectValue: number;
  builderSharePercent: number;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: { seconds: number; nanoseconds: number };
}

export interface GTDocument {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  url: string;
  type: string;
  uploadedBy: string;
  createdAt: { seconds: number; nanoseconds: number };
}

export interface GTForm {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  fields: Array<{ label: string; value: string }>;
  submittedAt: { seconds: number; nanoseconds: number };
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  updatedAt: { seconds: number; nanoseconds: number };
}

export interface AuditSubmission {
  id: string;
  websiteUrl: string;
  email: string;
  fullName: string;
  whatsappNumber: string;
  status: 'pending' | 'in_progress' | 'completed';
  submittedAt: { seconds: number; nanoseconds: number };
}

export interface GBPApplication {
  id: string;
  fullName: string;
  email: string;
  portfolioUrl: string;
  githubUrl: string;
  experienceYears: number;
  skills: string[];
  status: 'pending' | 'approved' | 'declined';
  submittedAt: { seconds: number; nanoseconds: number };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  submittedAt: { seconds: number; nanoseconds: number };
}

// Helper to get or set from localStorage
function getOrInit<T>(key: string, defaultVal: T): T {
  const stored = localStorage.getItem(`gt_mock_${key}`);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultVal;
    }
  }
  localStorage.setItem(`gt_mock_${key}`, JSON.stringify(defaultVal));
  return defaultVal;
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(`gt_mock_${key}`, JSON.stringify(data));
}

// ──────────────────────────────────────────
// INITIAL DATASETS
// ──────────────────────────────────────────

const INITIAL_PROJECTS: GTProject[] = [
  {
    id: 'proj-1',
    name: 'Ecosystem Scale v2',
    clientEmail: 'client@demo.com',
    builderEmails: ['builder@demo.com'],
    clientUid: 'user-client-1',
    builderUids: ['user-builder-1'],
    description: 'Complete visual redesign and workflow automation integration for Alpha Brands Inc.',
    status: 'In Progress',
    progressPercent: 76,
    category: 'Web/App Development',
    whatsappGroupUrl: 'https://chat.whatsapp.com/demo1',
    projectValue: 350000,
    inPortfolio: true,
    milestones: [
      { id: '1', title: 'Brand Discovery & Assets Audit', status: 'completed' },
      { id: '2', title: 'Interactive Figma Workspace Prototype', status: 'completed' },
      { id: '3', title: 'Database Sync & Stripe Gateway Setup', status: 'active' },
      { id: '4', title: 'Final Handover & UAT Deployment', status: 'pending' },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 864000, nanoseconds: 0 } as any,
    deadline: { seconds: Math.floor(Date.now() / 1000) + 1296000, nanoseconds: 0 } as any,
  },
  {
    id: 'proj-2',
    name: 'Stripe SaaS Engine',
    clientEmail: 'saas.owner@gmail.com',
    builderEmails: ['builder@demo.com', 'mail.galaxatech@gmail.com'],
    clientUid: '',
    builderUids: [],
    description: 'Deploying high-converting billing components with React and Node.js for SaaS metrics tracking.',
    status: 'Discovery',
    progressPercent: 20,
    category: 'Web/App Development',
    whatsappGroupUrl: 'https://chat.whatsapp.com/demo2',
    projectValue: 450000,
    inPortfolio: false,
    milestones: [
      { id: '1', title: 'Database Schema Design', status: 'completed' },
      { id: '2', title: 'Authentication Hooks', status: 'pending' },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 172800, nanoseconds: 0 } as any,
    deadline: { seconds: Math.floor(Date.now() / 1000) + 2592000, nanoseconds: 0 } as any,
  },
  {
    id: 'proj-3',
    name: 'Galactic UI System',
    clientEmail: 'design.lead@galaxatech.com',
    builderEmails: ['builder@demo.com'],
    clientUid: '',
    builderUids: [],
    description: 'Beautiful, modular component framework optimized for developer experience.',
    status: 'Completed',
    progressPercent: 100,
    category: 'UI/UX Design',
    whatsappGroupUrl: '',
    projectValue: 120000,
    inPortfolio: true,
    milestones: [
      { id: '1', title: 'Core Tokens Draft', status: 'completed' },
      { id: '2', title: 'Tailwind Integration', status: 'completed' },
      { id: '3', title: 'Figma Library Publish', status: 'completed' },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 2592000, nanoseconds: 0 } as any,
    deadline: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 } as any,
  }
];

const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user-admin',
    displayName: 'Galaxa Admin',
    email: 'mail.galaxatech@gmail.com',
    role: 'admin',
    status: 'approved',
    photoURL: '',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 999999, nanoseconds: 0 } as any,
  },
  {
    uid: 'user-client-1',
    displayName: 'Demo Client',
    email: 'client@demo.com',
    role: 'client',
    status: 'approved',
    photoURL: '',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 864000, nanoseconds: 0 } as any,
  },
  {
    uid: 'user-builder-1',
    displayName: 'Demo Builder',
    email: 'builder@demo.com',
    role: 'builder',
    status: 'approved',
    photoURL: '',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 864000, nanoseconds: 0 } as any,
  },
  {
    uid: 'user-pending-1',
    displayName: 'John Dev',
    email: 'john.dev@outlook.com',
    role: 'builder',
    status: 'pending',
    photoURL: '',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400, nanoseconds: 0 } as any,
  }
];

const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    projectName: 'Ecosystem Scale v2',
    builderUid: 'user-builder-1',
    builderName: 'Demo Builder',
    projectValue: 350000,
    builderSharePercent: 60,
    amount: 105000,
    status: 'paid',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 600000, nanoseconds: 0 },
  },
  {
    id: 'pay-2',
    projectId: 'proj-1',
    projectName: 'Ecosystem Scale v2',
    builderUid: 'user-builder-1',
    builderName: 'Demo Builder',
    projectValue: 350000,
    builderSharePercent: 60,
    amount: 105000,
    status: 'pending',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 100000, nanoseconds: 0 },
  }
];

const INITIAL_DOCUMENTS: GTDocument[] = [
  {
    id: 'doc-1',
    projectId: 'proj-1',
    projectName: 'Ecosystem Scale v2',
    title: 'Visual Assets Guideline v1.2',
    url: 'https://docs.google.com/document/d/demo-guideline',
    type: 'Guideline',
    uploadedBy: 'mail.galaxatech@gmail.com',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 800000, nanoseconds: 0 },
  },
  {
    id: 'doc-2',
    projectId: 'proj-1',
    projectName: 'Ecosystem Scale v2',
    title: 'Stripe Gateway Checklist',
    url: 'https://docs.google.com/document/d/demo-stripe',
    type: 'Checklist',
    uploadedBy: 'builder@demo.com',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 300000, nanoseconds: 0 },
  }
];

const INITIAL_FORMS: GTForm[] = [
  {
    id: 'form-1',
    projectId: 'proj-1',
    projectName: 'Ecosystem Scale v2',
    title: 'Stripe Account Scoping Form',
    fields: [
      { label: 'Merchant Region', value: 'US East' },
      { label: 'Estimated Monthly Volume', value: '$10k - $50k' },
      { label: 'Subscription Intervals', value: 'Monthly & Yearly' }
    ],
    submittedAt: { seconds: Math.floor(Date.now() / 1000) - 500000, nanoseconds: 0 },
  }
];

const INITIAL_CONTENT: ContentItem[] = [
  {
    id: 'content-1',
    title: 'Google Releases AI Tool to Convert Sketches into Gorgeous Artwork',
    category: 'AI News Flash',
    summary: 'A new standard that instantly transforms basic hand-drawn doodles into polished visual assets.',
    content: 'Google has released a new generative drawing canvas. Users can draw basic geometric layout drapes on screen, and the AI converts it into highly detailed digital art or custom cartoon assets for presentation slides.',
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 200000, nanoseconds: 0 },
  },
  {
    id: 'content-2',
    title: 'Teach Your AI Assistant to Write in Your Exact Voice',
    category: 'AI Prompt Tip',
    summary: 'A simple prompting trick to make emails sound organic and prevent robotic phrases.',
    content: 'Analyze the sentence length, greeting structure, and tone of sample emails to make drafts sound natural.',
    updatedAt: { seconds: Math.floor(Date.now() / 1000) - 100000, nanoseconds: 0 },
  }
];

const INITIAL_AUDITS: AuditSubmission[] = [
  {
    id: 'audit-1',
    websiteUrl: 'https://mywebsite.com',
    email: 'client@demo.com',
    fullName: 'Jane Doe',
    whatsappNumber: '+8801700000001',
    status: 'pending',
    submittedAt: { seconds: Math.floor(Date.now() / 1000) - 50000, nanoseconds: 0 },
  }
];

const INITIAL_GBP_APPLICATIONS: GBPApplication[] = [
  {
    id: 'gbp-1',
    fullName: 'David Builder',
    email: 'david.b@github.com',
    portfolioUrl: 'https://david.dev',
    githubUrl: 'https://github.com/daviddev',
    experienceYears: 4,
    skills: ['React', 'Node.js', 'Firebase'],
    status: 'pending',
    submittedAt: { seconds: Math.floor(Date.now() / 1000) - 150000, nanoseconds: 0 },
  }
];

const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'contact-1',
    name: 'Sarah Connor',
    email: 'sarah.c@cyberdyne.com',
    message: 'Need assistance setting up a secure cloud server network for automation workflows.',
    submittedAt: { seconds: Math.floor(Date.now() / 1000) - 120000, nanoseconds: 0 },
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-netflix', name: 'Netflix Premium', slug: 'netflix-premium', category: 'Streaming',
    shortDescription: 'Watch on any screen — mobile, laptop, or TV — in Full HD or 4K.',
    longDescription: 'Shared and personal Netflix plans across mobile, laptop/PC, and Smart TV / Android TV / Fire Stick devices. Choose the screen tier that matches how you watch.',
    imageUrl: '/store/netflix-banner.png', isActive: true, isFeatured: true,
    rating: 4.88, reviewCount: 142,
    plans: [
      { id: 'plan-mobile-1m', label: 'Mobile / Laptop Screen', durationLabel: '1 Month', durationDays: 30, priceBDT: 349, originalPriceBDT: 399 },
      { id: 'plan-tv-1m', label: 'TV Screen (Full HD)', durationLabel: '1 Month', durationDays: 30, priceBDT: 449, originalPriceBDT: 499 },
      { id: 'plan-premium-1m', label: 'Premium 4K (2 Screens)', durationLabel: '1 Month', durationDays: 30, priceBDT: 649, originalPriceBDT: 749 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 900000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-netflix-prime', name: 'Netflix + Prime Video Combo', slug: 'netflix-prime-combo', category: 'Streaming',
    shortDescription: 'One plan, two of the biggest streaming libraries.',
    longDescription: 'Bundle Netflix and Amazon Prime Video access into a single monthly plan at a discounted combo rate.',
    imageUrl: '/store/netflix-prime-combo-banner.png', isActive: true,
    rating: 4.91, reviewCount: 68,
    plans: [
      { id: 'plan-combo-1m', label: 'Combo Plan', durationLabel: '1 Month', durationDays: 30, priceBDT: 489, originalPriceBDT: 599 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 880000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-prime', name: 'Amazon Prime Video', slug: 'prime-video', category: 'Streaming',
    shortDescription: 'Prime Originals, movies, and live sports.',
    longDescription: 'Standard Amazon Prime Video access on mobile, laptop, and TV devices.',
    imageUrl: '/store/prime-banner.png', isActive: true,
    rating: 4.79, reviewCount: 54,
    plans: [
      { id: 'plan-1m', label: 'Standard', durationLabel: '1 Month', durationDays: 30, priceBDT: 249, originalPriceBDT: 299 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 860000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-spotify', name: 'Spotify Premium', slug: 'spotify-premium', category: 'Music',
    shortDescription: 'Ad-free music, offline downloads, unlimited skips.',
    longDescription: 'Individual Spotify Premium access with no ads and offline listening.',
    imageUrl: '/store/spotify-banner.png', isActive: true,
    rating: 4.85, reviewCount: 118,
    plans: [
      { id: 'plan-1m', label: 'Individual', durationLabel: '1 Month', durationDays: 30, priceBDT: 149, originalPriceBDT: 199 },
      { id: 'plan-3m', label: 'Individual', durationLabel: '3 Months', durationDays: 90, priceBDT: 399, originalPriceBDT: 499 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 840000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-chatgpt', name: 'ChatGPT Plus', slug: 'chatgpt-plus', category: 'AI Tools',
    shortDescription: 'GPT-5 access, image generation, web browsing, and file uploads.',
    longDescription: 'Choose a shared login for a lower price, or a personal-email invite so the subscription lives on your own OpenAI account.',
    imageUrl: '/store/chatgpt-banner.png', isActive: true, isFeatured: true,
    rating: 4.95, reviewCount: 210,
    plans: [
      { id: 'plan-shared-1m', label: 'Shared Account', durationLabel: '1 Month', durationDays: 30, priceBDT: 500, originalPriceBDT: 650 },
      { id: 'plan-personal-1m', label: 'Personal Account (Your Email)', durationLabel: '1 Month', durationDays: 30, priceBDT: 2750, originalPriceBDT: 2900 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 820000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-canva', name: 'Canva Pro', slug: 'canva-pro', category: 'Design',
    shortDescription: 'Premium templates, background remover, and brand kits.',
    longDescription: 'Full-year Canva Pro invite added directly to your existing Canva account.',
    imageUrl: '/store/canva-banner.png', isActive: true,
    rating: 4.82, reviewCount: 88,
    plans: [
      { id: 'plan-1y', label: 'Full Year Invite', durationLabel: '1 Year', durationDays: 365, priceBDT: 599, originalPriceBDT: 999 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 800000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-disney', name: 'Disney+ Hotstar', slug: 'disney-hotstar', category: 'Streaming',
    shortDescription: 'Disney, Marvel, Star Wars, and live cricket.',
    longDescription: 'Standard Disney+ Hotstar access across mobile and TV.',
    imageUrl: '/store/disney-banner.png', isActive: true,
    rating: 4.76, reviewCount: 42,
    plans: [
      { id: 'plan-1m', label: 'Standard', durationLabel: '1 Month', durationDays: 30, priceBDT: 299, originalPriceBDT: 349 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 780000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-itunes', name: 'Apple iTunes Gift Card', slug: 'apple-itunes-gift-card', category: 'Gift Cards',
    shortDescription: 'Redeemable balance for the App Store, iTunes, and Apple services.',
    longDescription: 'Digital Apple/iTunes gift card codes for the Bangladesh or US App Store, delivered by code after payment confirmation.',
    imageUrl: '/store/apple-banner.png', isActive: true,
    rating: 4.90, reviewCount: 31,
    plans: [
      { id: 'plan-500', label: '৳500 Balance', durationLabel: 'One-time', durationDays: 0, priceBDT: 550, originalPriceBDT: 600 },
      { id: 'plan-1000', label: '৳1000 Balance', durationLabel: 'One-time', durationDays: 0, priceBDT: 1080, originalPriceBDT: 1200 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 760000, nanoseconds: 0 } as any,
  },
  {
    id: 'prod-pubg-uc', name: 'PUBG Mobile UC Top-up', slug: 'pubg-mobile-uc-topup', category: 'Gaming',
    shortDescription: 'Instant UC top-up direct to your PUBG Mobile account.',
    longDescription: 'Unknown Cash (UC) top-up for PUBG Mobile, delivered directly to your in-game ID within minutes of payment confirmation.',
    imageUrl: '/store/pubg-banner.png', isActive: true,
    rating: 4.87, reviewCount: 95,
    plans: [
      { id: 'plan-60uc', label: '60 UC', durationLabel: 'One-time', durationDays: 0, priceBDT: 100, originalPriceBDT: 120 },
      { id: 'plan-325uc', label: '325 UC', durationLabel: 'One-time', durationDays: 0, priceBDT: 480, originalPriceBDT: 520 },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 740000, nanoseconds: 0 } as any,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'order-1',
    customerUsername: 'demo@customer.com',
    customerEmail: 'demo@customer.com',
    customerName: 'Demo Customer',
    customerPhone: '+8801700000009',
    items: [
      { productId: 'prod-netflix', productName: 'Netflix Premium', planId: 'plan-tv-1m', planLabel: 'TV Screen (Full HD) · 1 Month', priceBDT: 449, quantity: 1 },
    ],
    totalBDT: 449,
    paymentMethod: 'bkash',
    senderNumber: '01700000009',
    trxId: 'DEMO1TRX9X',
    status: 'pending_payment',
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 3600, nanoseconds: 0 } as any,
  },
  {
    id: 'order-2',
    customerUsername: 'demo@customer.com',
    customerEmail: 'demo@customer.com',
    customerName: 'Demo Customer',
    customerPhone: '+8801700000009',
    items: [
      { productId: 'prod-chatgpt', productName: 'ChatGPT Plus', planId: 'plan-shared-1m', planLabel: 'Shared Account · 1 Month', priceBDT: 500, quantity: 1 },
    ],
    totalBDT: 500,
    paymentMethod: 'nagad',
    senderNumber: '01700000009',
    trxId: 'DEMO2TRX7Y',
    status: 'fulfilled',
    deliveredCredentials: [
      { label: 'ChatGPT Login Email', value: 'shared-gpt-01@galaxamail.com' },
      { label: 'Password', value: 'GT-shared-pass-01' },
    ],
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 200000, nanoseconds: 0 } as any,
    verifiedAt: { seconds: Math.floor(Date.now() / 1000) - 180000, nanoseconds: 0 } as any,
    fulfilledAt: { seconds: Math.floor(Date.now() / 1000) - 170000, nanoseconds: 0 } as any,
  },
];

const INITIAL_GBP_STATUS = { status: 'open', nextBatchDate: 'September 2026' };
const INITIAL_HOMEPAGE_STATS = { projectsDelivered: 12, countriesServed: 4, buildersInProgram: 25 };

// ──────────────────────────────────────────
// PUBLIC API HELPERS FOR LOCAL STORAGE DATA
// ──────────────────────────────────────────

export const mockDb = {
  getProjects: () => getOrInit('projects', INITIAL_PROJECTS),
  saveProjects: (data: GTProject[]) => save('projects', data),
  
  getUsers: () => getOrInit('users', INITIAL_USERS),
  saveUsers: (data: UserProfile[]) => save('users', data),
  
  getPayments: () => getOrInit('payments', INITIAL_PAYMENTS),
  savePayments: (data: Payment[]) => save('payments', data),
  
  getDocuments: () => getOrInit('documents', INITIAL_DOCUMENTS),
  saveDocuments: (data: GTDocument[]) => save('documents', data),
  
  getForms: () => getOrInit('forms', INITIAL_FORMS),
  saveForms: (data: GTForm[]) => save('forms', data),
  
  getContent: () => getOrInit('content', INITIAL_CONTENT),
  saveContent: (data: ContentItem[]) => save('content', data),
  
  getAudits: () => getOrInit('audits', INITIAL_AUDITS),
  saveAudits: (data: AuditSubmission[]) => save('audits', data),
  
  getGbpApps: () => getOrInit('gbp', INITIAL_GBP_APPLICATIONS),
  saveGbpApps: (data: GBPApplication[]) => save('gbp', data),
  
  getContacts: () => getOrInit('contacts', INITIAL_CONTACT_SUBMISSIONS),
  saveContacts: (data: ContactSubmission[]) => save('contacts', data),
  
  getGbpStatus: () => getOrInit('gbp_status', INITIAL_GBP_STATUS),
  saveGbpStatus: (data: typeof INITIAL_GBP_STATUS) => save('gbp_status', data),
  
  getHomepageStats: () => getOrInit('homepage_stats', INITIAL_HOMEPAGE_STATS),
  saveHomepageStats: (data: typeof INITIAL_HOMEPAGE_STATS) => save('homepage_stats', data),

  getProducts: () => getOrInit('products', INITIAL_PRODUCTS),
  saveProducts: (data: Product[]) => save('products', data),

  getOrders: () => getOrInit('orders', INITIAL_ORDERS),
  saveOrders: (data: Order[]) => save('orders', data),
};
