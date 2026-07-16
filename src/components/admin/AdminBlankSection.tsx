import { Sparkles } from 'lucide-react';
import EmptyState from '../shared/EmptyState';

// Placeholder for admin sections that aren't built out yet.
export default function AdminBlankSection({ title }: { title: string }) {
  return (
    <EmptyState
      icon={<Sparkles className="w-5 h-5" />}
      title={title}
      description="Coming soon."
    />
  );
}
