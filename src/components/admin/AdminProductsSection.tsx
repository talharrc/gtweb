import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Loader2, Eye, EyeOff } from 'lucide-react';
import { db } from '../../lib/firebase';
import { Product, ProductCategory, ProductPlan } from '../../types';
import { createProduct, updateProduct, deleteProduct, setProductActive } from '../../services/productService';
import { slugify } from '../../services/credentialService';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import EmptyState from '../shared/EmptyState';

const CATEGORIES: ProductCategory[] = ['Streaming', 'Music', 'AI Tools', 'Design', 'Productivity', 'Gaming', 'Other'];

const EMPTY_PLAN = (): ProductPlan => ({
  id: `plan-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  label: '', durationLabel: '1 Month', durationDays: 30, priceBDT: 0,
});

const EMPTY_FORM = {
  name: '', category: 'Streaming' as ProductCategory, shortDescription: '', longDescription: '',
  imageUrl: '', isActive: true, isFeatured: false, plans: [EMPTY_PLAN()] as ProductPlan[],
};

export default function AdminProductsSection() {
  const { isDemo, setIsDemo } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setProducts(mockDb.getProducts());
      setLoading(false);
      return;
    }

    let active = true;
    const fallbackTimer = setTimeout(() => {
      if (active) {
        console.warn('Firestore load timed out in AdminProductsSection, falling back to Demo Mode');
        setIsDemo(true);
        setLoading(false);
      }
    }, 2500);

    const handleError = (error: any) => {
      console.warn('Firestore error in AdminProductsSection, falling back to Demo Mode:', error);
      if (active) {
        setIsDemo(true);
        setLoading(false);
      }
    };

    const unsub = onSnapshot(collection(db, 'products'), s => {
      if (!active) return;
      setProducts(s.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      setLoading(false);
    }, handleError);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [isDemo]);

  const openNew = () => { setForm({ ...EMPTY_FORM, plans: [EMPTY_PLAN()] }); setEditingId(null); setShowForm(true); };
  const openEdit = (p: Product) => {
    setForm({
      name: p.name, category: p.category, shortDescription: p.shortDescription, longDescription: p.longDescription,
      imageUrl: p.imageUrl, isActive: p.isActive, isFeatured: !!p.isFeatured, plans: p.plans.map(pl => ({ ...pl })),
    });
    setEditingId(p.id);
    setShowForm(true);
  };

  const updatePlan = (idx: number, updates: Partial<ProductPlan>) => {
    setForm(f => ({ ...f, plans: f.plans.map((pl, i) => (i === idx ? { ...pl, ...updates } : pl)) }));
  };
  const addPlan = () => setForm(f => ({ ...f, plans: [...f.plans, EMPTY_PLAN()] }));
  const removePlan = (idx: number) => setForm(f => ({ ...f, plans: f.plans.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (form.plans.length === 0) return;
    setSaving(true);
    try {
      const payload = { ...form, slug: slugify(form.name) };
      if (isDemo) {
        const list = mockDb.getProducts();
        if (editingId) {
          const updated = list.map(p => p.id === editingId ? { ...p, ...payload, id: editingId } : p);
          mockDb.saveProducts(updated);
          setProducts(updated);
        } else {
          const created: Product = {
            ...payload, id: `prod-${Date.now()}`,
            createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 } as any,
          };
          const updated = [...list, created];
          mockDb.saveProducts(updated);
          setProducts(updated);
        }
        setShowForm(false);
      } else {
        if (editingId) await updateProduct(editingId, payload);
        else await createProduct(payload as any);
        setShowForm(false);
      }
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    if (isDemo) {
      const filtered = mockDb.getProducts().filter(p => p.id !== id);
      mockDb.saveProducts(filtered);
      setProducts(filtered);
    } else {
      await deleteProduct(id);
    }
  };

  const handleToggleActive = async (p: Product) => {
    if (isDemo) {
      const updated = mockDb.getProducts().map(x => x.id === p.id ? { ...x, isActive: !x.isActive } : x);
      mockDb.saveProducts(updated);
      setProducts(updated);
    } else {
      await setProductActive(p.id, !p.isActive);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Store Products</h2>
          <p className="text-white/40 text-sm">Manage the subscription plans customers can buy</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New Product
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first subscription product to start selling." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map(p => {
            const prices = p.plans.map(pl => pl.priceBDT);
            const min = Math.min(...prices), max = Math.max(...prices);
            return (
              <div key={p.id} className={`glass-card rounded-2xl p-5 ${!p.isActive ? 'opacity-50' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/5 px-2 py-0.5 rounded-full text-white/50">{p.category}</span>
                    <h3 className="text-white font-bold text-base mt-1.5">{p.name}</h3>
                  </div>
                  <button onClick={() => handleToggleActive(p)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all" title={p.isActive ? 'Hide from store' : 'Show in store'}>
                    {p.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-white/45 text-xs leading-relaxed mb-3 line-clamp-2">{p.shortDescription}</p>
                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                  <p className="text-white font-mono font-bold text-sm">
                    {min === max ? `৳${min.toLocaleString()}` : `৳${min.toLocaleString()} – ৳${max.toLocaleString()}`}
                  </p>
                  <p className="text-white/30 text-[10px] font-mono">{p.plans.length} plan{p.plans.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => openEdit(p)} className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all">
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="py-2 px-3 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editingId ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name (e.g. Netflix Premium)" className="admin-input" />
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))} className="admin-input">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <input required value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} placeholder="Short description (shown on product card)" className="admin-input" />
              <textarea value={form.longDescription} onChange={e => setForm(f => ({ ...f, longDescription: e.target.value }))} placeholder="Full description (shown in product detail)" rows={3} className="admin-input resize-y" />
              <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="Image URL (optional)" className="admin-input" />

              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="accent-primary" /> Active
                </label>
                <label className="flex items-center gap-2 text-white/70 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} className="accent-primary" /> Featured
                </label>
              </div>

              <div className="border-t border-white/5 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono text-primary uppercase tracking-widest font-bold">Plans</p>
                  <button type="button" onClick={addPlan} className="text-xs text-primary font-semibold flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" /> Add Plan
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {form.plans.map((pl, idx) => (
                    <div key={pl.id} className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr_auto] gap-2 items-center bg-white/[0.02] border border-white/5 rounded-xl p-2">
                      <input required value={pl.label} onChange={e => updatePlan(idx, { label: e.target.value })} placeholder="Label (e.g. TV Screen)" className="admin-input text-xs py-1.5" />
                      <input required value={pl.durationLabel} onChange={e => updatePlan(idx, { durationLabel: e.target.value })} placeholder="Duration (1 Month)" className="admin-input text-xs py-1.5" />
                      <input required type="number" min={1} value={pl.durationDays} onChange={e => updatePlan(idx, { durationDays: Number(e.target.value) })} placeholder="Days" className="admin-input text-xs py-1.5" />
                      <input required type="number" min={0} value={pl.priceBDT} onChange={e => updatePlan(idx, { priceBDT: Number(e.target.value) })} placeholder="৳ Price" className="admin-input text-xs py-1.5" />
                      <button type="button" onClick={() => removePlan(idx)} disabled={form.plans.length === 1} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 disabled:opacity-30 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
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
