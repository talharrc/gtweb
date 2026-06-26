import { Timestamp } from 'firebase/firestore';

// ── Marketing site types (unchanged) ──────────────────────────────────────────

export type PageType = 'home' | 'services' | 'portfolio' | 'about' | 'contact' | 'visitor-hub' | 'client-hub' | 'builders-program' | 'audit' | 'gbp' | 'privacy' | 'terms';

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

// ── Firestore / Hub types ──────────────────────────────────────────────────────

export type UserRole = 'admin' | 'client' | 'builder' | 'visitor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  status: 'approved' | 'pending';
  displayName: string;
  photoURL: string;
  createdAt: Timestamp;
}

export interface Milestone {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed';
  completedAt?: Timestamp;
}

export interface BuilderInfo {
  uid: string;
  name: string;
  specialty?: string;
  email?: string;
}

export interface GTProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused' | 'archived';
  progressPercent: number;
  deadline: Timestamp;
  milestones: Milestone[];
  clientUid: string;
  builderUids: string[];
  whatsappGroupUrl?: string;
  category?: string;
  projectValue?: number;
  clientInfo?: { name: string; company?: string; email?: string; phone?: string; };
  builders?: BuilderInfo[];
  createdAt: Timestamp;
}

export interface HubCredential {
  id: string;
  projectId: string;
  projectName: string;
  role: 'client' | 'builder';
  username: string;
  password: string;
  displayName: string;
  uid: string;
  createdAt: Timestamp;
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  authorUid: string;
  date: Timestamp;
  summary: string;
  attachments: string[];
}

export interface GTDocument {
  id: string;
  projectId: string;
  type: 'agreement' | 'proposal' | 'invoice' | 'deliverable' | 'handover';
  name: string;
  fileUrl: string;
  version: string;
  uploadedBy: string;
  uploadedAt: Timestamp;
  isLatest: boolean;
}

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface GTForm {
  id: string;
  projectId: string;
  title: string;
  fields: FormField[];
  requestedByUid: string;
  status: 'pending' | 'submitted';
  submittedData?: Record<string, string | boolean>;
  submittedAt?: Timestamp;
}

export interface BuilderRequest {
  id: string;
  projectId: string;
  builderUid: string;
  type: string;
  detail: string;
  status: 'open' | 'in-review' | 'resolved';
  createdAt: Timestamp;
}

export interface Payment {
  id: string;
  projectId: string;
  projectValue: number;
  builderUid: string;
  builderSharePercent: number;
  clientPaidAmount: number;
  builderPaidAmount: number;
}

export interface ContentItem {
  id: string;
  type: 'blog' | 'prompt' | 'resource' | 'newsletter';
  title: string;
  body: string;
  isPublic: boolean;
  createdAt: Timestamp;
}
