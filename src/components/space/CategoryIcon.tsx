import {
  Wrench, Newspaper, Sparkles, Hammer, HelpCircle, GraduationCap, Briefcase, Rocket, LucideIcon,
} from 'lucide-react';
import { SpaceCategory } from '../../types/space';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<SpaceCategory, CategoryMeta> = {
  tools: { label: 'Tools', icon: Wrench },
  news: { label: 'News', icon: Newspaper },
  prompts: { label: 'Prompts', icon: Sparkles },
  build: { label: 'Build', icon: Hammer },
  ask: { label: 'Ask', icon: HelpCircle },
  tutorials: { label: 'Tutorials', icon: GraduationCap },
  jobs: { label: 'Jobs', icon: Briefcase },
  showcase: { label: 'Showcase', icon: Rocket },
};

export default function CategoryIcon({ category, className }: { category: SpaceCategory; className?: string }) {
  const Icon = CATEGORY_META[category].icon;
  return <Icon className={className ?? 'w-4 h-4'} />;
}
