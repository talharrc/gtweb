import { useState } from 'react';
import { BookOpen, Globe, Lock, Loader2 } from 'lucide-react';
import { useContent } from '../../hooks/useContent';
import EmptyState from '../shared/EmptyState';

export default function ResourceLibrary() {
  const { items: publicItems, loading: l1 } = useContent('resource', false);
  const { items: memberItems, loading: l2 } = useContent('resource', true);
  const items = [...publicItems, ...memberItems];
  const [expanded, setExpanded] = useState<string | null>(null);

  if (l1 || l2) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Resources</h2>
        <p className="text-white/40 text-sm">Guides, tools, and assets curated for builders</p>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No resources yet" description="Admin will add resources here for your reference." icon={<BookOpen className="w-5 h-5" />} />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map(item => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] text-left"
              >
                {item.isPublic ? <Globe className="w-4 h-4 text-emerald-400 flex-shrink-0" /> : <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                <p className="text-white font-semibold text-sm flex-1">{item.title}</p>
                <span className="text-white/30 text-xs">{expanded === item.id ? 'Hide' : 'Read →'}</span>
              </button>
              {expanded === item.id && (
                <div className="px-5 pb-5 border-t border-white/5">
                  <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap pt-4">{item.body}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
