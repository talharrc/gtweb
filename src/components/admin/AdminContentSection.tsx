import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Loader2, Globe, Lock } from 'lucide-react';
import { db } from '../../lib/firebase';
import { ContentItem } from '../../types';
import { createContent, updateContent, deleteContent } from '../../services/contentService';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

const TYPES: ContentItem['type'][] = ['blog', 'prompt', 'resource', 'newsletter'];
const EMPTY = { type: 'blog' as ContentItem['type'], title: '', body: '', isPublic: true };

export default function AdminContentSection() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<ContentItem['type'] | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'content'), s => {
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openNew = () => { setForm({ ...EMPTY }); setEditingId(null); setShowForm(true); };
  const openEdit = (item: ContentItem) => { setForm({ type: item.type, title: item.title, body: item.body, isPublic: item.isPublic }); setEditingId(item.id); setShowForm(true); };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) await updateContent(editingId, form);
      else await createContent(form);
      setShowForm(false);
    } finally { setSaving(false); }
  };

  const filtered = filterType === 'all' ? items : items.filter(i => i.type === filterType);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Content</h2>
          <p className="text-white/40 text-sm">Manage blog, prompts, resources, newsletters</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {(['all', ...TYPES] as const).map(t => (
          <button key={t} onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterType === t ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No content" description="Create the first piece of content." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(item => (
            <div key={item.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-white font-semibold text-sm truncate">{item.title}</p>
                  <span className="text-[10px] text-white/30 uppercase bg-white/5 px-1.5 py-0.5 rounded">{item.type}</span>
                </div>
                <p className="text-white/40 text-xs truncate">{item.body.slice(0, 80)}…</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.isPublic
                  ? <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  : <Lock className="w-3.5 h-3.5 text-amber-400" />
                }
                <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => deleteContent(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editingId ? 'Edit Content' : 'New Content'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as ContentItem['type'] }))} className="admin-input">
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <label className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer">
                  <input type="checkbox" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))} className="accent-primary" />
                  <span className="text-white/70 text-sm">Public</span>
                  {form.isPublic ? <Globe className="w-3.5 h-3.5 text-emerald-400 ml-auto" /> : <Lock className="w-3.5 h-3.5 text-amber-400 ml-auto" />}
                </label>
              </div>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="admin-input" />
              <textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Body / content (supports markdown)" rows={8} className="admin-input resize-y" />
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
