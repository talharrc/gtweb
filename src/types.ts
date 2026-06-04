export type PageType = 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'visitor-hub' | 'client-hub' | 'builders-program';

export interface Project {
  id: string;
  title: string;
  category: 'Design' | 'Development' | 'Marketing';
  description: string;
  longDescription: string;
  image: string;
  tags: string[];
  metrics?: string;
  client?: string;
  timeline?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  verifiedIcon: 'verified' | 'task_alt';
  verifiedColor: 'primary' | 'secondary';
  socials: {
    github?: string;
    linkedin?: string;
    email: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ServiceDetail {
  title: string;
  category: string;
  price: string;
  features: string[];
}

