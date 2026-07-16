import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { db } from '../../lib/firebase';
import { PortfolioItem } from '../../types';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadPortfolioImage } from '../../services/portfolioService';
import EmptyState from '../shared/EmptyState';

const EMPTY_FORM = {
  slug: '', name: '', clientType: '', country: '', countryName: '',
  servicesRaw: '', desc: '', challenge: '', solution: '', stackRaw: '', result: '',
};

export default function AdminPortfolioSection() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [images, setImages] = useState<string[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'portfolio'), s => {
      setItems(s.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem)));
      setLoading(false);
    }, (error) => {
      console.warn('Firestore error in AdminPortfolioSection:', error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const openNew = () => {
    setForm({ ...EMPTY_FORM });
    setImages([]);
    setPendingFiles([]);
    setEditingId(null);
    setShowForm(true);
  };

  const openEdit = (item: PortfolioItem) => {
    setForm({
      slug: item.slug, name: item.name, clientType: item.clientType,
      country: item.country, countryName: item.countryName,
      servicesRaw: item.services.join(', '), desc: item.desc,
      challenge: item.challenge, solution: item.solution,
      stackRaw: item.stack.join(', '), result: item.result,
    });
    setImages(item.images ?? []);
    setPendingFiles([]);
    setEditingId(item.id);
    setShowForm(true);
  };

  const removeImage = (url: string) => setImages(imgs => imgs.filter(i => i !== url));
  const removePendingFile = (idx: number) => setPendingFiles(files => files.filter((_, i) => i !== idx));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.slug.trim()) return;
    setSaving(true);
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < pendingFiles.length; i++) {
        setUploadProgress(0);
        const url = await uploadPortfolioImage(form.slug.trim(), pendingFiles[i], setUploadProgress);
        uploadedUrls.push(url);
      }
      setUploadProgress(null);

      const data = {
        slug: form.slug.trim(),
        name: form.name,
        clientType: form.clientType,
        country: form.country,
        countryName: form.countryName,
        services: form.servicesRaw.split(',').map(s => s.trim()).filter(Boolean),
        desc: form.desc,
        challenge: form.challenge,
        solution: form.solution,
        stack: form.stackRaw.split(',').map(s => s.trim()).filter(Boolean),
        result: form.result,
        images: [...images, ...uploadedUrls],
      };

      if (editingId) {
        await updatePortfolioItem(editingId, data);
      } else {
        await createPortfolioItem(data);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Failed to save portfolio item:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this portfolio item? This cannot be undone.')) return;
    try {
      await deletePortfolioItem(id);
    } catch (err) {
      console.error('Failed to delete portfolio item:', err);
    }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Portfolio Manager</h2>
          <p className="text-white/40 text-sm">Manage case studies shown on the public portfolio page</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={<ImageIcon className="w-5 h-5" />} title="No portfolio items yet" description="Add your first case study." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex flex-col">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-[#05030F] to-secondary/20 flex items-center justify-center relative overflow-hidden">
                {item.images?.[0] ? (
                  <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-primary/25" />
                )}
                <span className="absolute top-2 left-2 text-lg">{item.country}</span>
                {item.images?.length > 0 && (
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono text-white/60 bg-black/50 px-1.5 py-0.5 rounded">
                    {item.images.length} img{item.images.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-mono text-white/35 uppercase tracking-widest mb-1">{item.clientType}</p>
                <p className="text-white font-semibold text-sm mb-1">{item.name}</p>
                <p className="text-white/30 text-[10px] font-mono mb-3">/{item.slug}</p>
                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button onClick={() => openEdit(item)} className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-xl rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editingId ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name" className="admin-input" />
                <input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} placeholder="url-slug" className="admin-input" disabled={!!editingId} />
              </div>
              <input required value={form.clientType} onChange={e => setForm(f => ({ ...f, clientType: e.target.value }))} placeholder="Client type (e.g. Islamic Lifestyle E-Commerce)" className="admin-input" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Country flag emoji (🇧🇩)" className="admin-input" />
                <input required value={form.countryName} onChange={e => setForm(f => ({ ...f, countryName: e.target.value }))} placeholder="Country name" className="admin-input" />
              </div>
              <input value={form.servicesRaw} onChange={e => setForm(f => ({ ...f, servicesRaw: e.target.value }))} placeholder="Services, comma separated" className="admin-input" />
              <textarea required value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="Short description (grid card)" rows={2} className="admin-input resize-y" />
              <textarea required value={form.challenge} onChange={e => setForm(f => ({ ...f, challenge: e.target.value }))} placeholder="The Challenge" rows={3} className="admin-input resize-y" />
              <textarea required value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} placeholder="The Solution" rows={3} className="admin-input resize-y" />
              <input value={form.stackRaw} onChange={e => setForm(f => ({ ...f, stackRaw: e.target.value }))} placeholder="Stack & tools, comma separated" className="admin-input" />
              <textarea required value={form.result} onChange={e => setForm(f => ({ ...f, result: e.target.value }))} placeholder="The Result" rows={2} className="admin-input resize-y" />

              {/* Images */}
              <div>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-2">Images</p>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {images.map(url => (
                      <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {pendingFiles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {pendingFiles.map((file, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/30 bg-white/5 flex items-center justify-center">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removePendingFile(idx)} className="absolute top-0.5 right-0.5 bg-black/60 rounded-full p-0.5">
                          <X className="w-2.5 h-2.5 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-dashed border-white/15 cursor-pointer text-white/50 hover:text-white/80 hover:border-white/30 transition-all text-xs w-fit">
                  <Upload className="w-3.5 h-3.5" />
                  Add images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={e => {
                      const files = Array.from(e.target.files ?? []);
                      setPendingFiles(f => [...f, ...files]);
                      e.target.value = '';
                    }}
                  />
                </label>
                {uploadProgress !== null && (
                  <p className="text-white/40 text-xs mt-2">Uploading… {uploadProgress}%</p>
                )}
              </div>

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
