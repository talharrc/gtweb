import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Plus, X, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject, GTForm, FormField } from '../../types';
import { createForm } from '../../services/formService';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';

const FIELD_TYPES: FormField['type'][] = ['text', 'textarea', 'select', 'checkbox'];

export default function AdminFormsSection() {
  const { firebaseUser, isDemo, setIsDemo } = useAuth();
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [forms, setForms] = useState<GTForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [expandedForm, setExpandedForm] = useState<string | null>(null);
  const [form, setForm] = useState({ projectId: '', title: '', fields: [] as FormField[] });
  const [newField, setNewField] = useState<Omit<FormField, 'key'>>({ label: '', type: 'text', required: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setProjects(mockDb.getProjects());
      setForms(mockDb.getForms() as any);
      setLoading(false);
      return;
    }

    const handleError = (error: any) => {
      console.warn("Firestore error in AdminFormsSection, falling back to Demo Mode:", error);
      setIsDemo(true);
      setLoading(false);
    };

    const u1 = onSnapshot(collection(db, 'projects'), s => { 
      setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as GTProject))); 
      setLoading(false); 
    }, handleError);

    const u2 = onSnapshot(collection(db, 'forms'), s => {
      setForms(s.docs.map(d => ({ id: d.id, ...d.data() } as GTForm)));
    }, handleError);

    return () => { 
      try { u1(); } catch {}
      try { u2(); } catch {}
    };
  }, [isDemo]);

  const addField = () => {
    if (!newField.label.trim()) return;
    setForm(f => ({
      ...f,
      fields: [...f.fields, { ...newField, key: newField.label.toLowerCase().replace(/\s+/g, '_') }],
    }));
    setNewField({ label: '', type: 'text', required: false });
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isDemo) {
        const mockForms = mockDb.getForms();
        const newForm = {
          id: `form-${Date.now()}`,
          projectId: form.projectId,
          projectName: projects.find(p => p.id === form.projectId)?.name ?? 'Unknown Project',
          title: form.title,
          fields: form.fields.map(f => ({ label: f.label, value: '' })),
          submittedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
          status: 'pending',
        };
        const updated = [...mockForms, newForm];
        mockDb.saveForms(updated as any);
        setForms(updated as any);
        setShowNew(false);
        setForm({ projectId: '', title: '', fields: [] });
      } else {
        await createForm({ ...form, requestedByUid: firebaseUser?.uid ?? 'admin', status: 'pending' } as any);
        setShowNew(false);
        setForm({ projectId: '', title: '', fields: [] });
      }
    } finally { setSaving(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Forms</h2>
          <p className="text-white/40 text-sm">Create intake forms; view client submissions</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New Form
        </button>
      </div>

      {forms.length === 0 ? (
        <EmptyState title="No forms yet" description="Create a form to request information from clients." />
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map(f => (
            <div key={f.id} className="glass-card rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedForm(expandedForm === f.id ? null : f.id)}
                className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={f.status} />
                  <p className="text-white font-semibold text-sm text-left">{f.title}</p>
                  <p className="text-white/30 text-xs hidden sm:block">{f.fields.length} fields</p>
                </div>
                {expandedForm === f.id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
              </button>
              {expandedForm === f.id && (
                <div className="px-5 pb-5 border-t border-white/5">
                  <div className="pt-4 grid gap-2">
                    {f.fields.map(field => (
                      <div key={field.key} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 text-sm">
                        <span className="text-white/60 text-xs px-2 py-0.5 rounded bg-white/5 uppercase tracking-wider">{field.type}</span>
                        <span className="text-white/80">{field.label}</span>
                        {field.required && <span className="text-red-400 text-xs ml-auto">required</span>}
                      </div>
                    ))}
                  </div>
                  {f.status === 'submitted' && f.submittedData && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">Submission</p>
                      {Object.entries(f.submittedData).map(([k, v]) => (
                        <div key={k} className="mb-2">
                          <p className="text-white/40 text-xs mb-0.5">{k}</p>
                          <p className="text-white text-sm">{String(v)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">New Form</h3>
              <button onClick={() => setShowNew(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <select required value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} className="admin-input">
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Form title" className="admin-input" />
              <div className="border border-white/10 rounded-xl p-3">
                <p className="text-white/40 text-xs mb-2">Add field</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input value={newField.label} onChange={e => setNewField(f => ({ ...f, label: e.target.value }))} placeholder="Label" className="admin-input col-span-2" />
                  <select value={newField.type} onChange={e => setNewField(f => ({ ...f, type: e.target.value as FormField['type'] }))} className="admin-input">
                    {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input type="checkbox" id="req" checked={newField.required} onChange={e => setNewField(f => ({ ...f, required: e.target.checked }))} className="accent-primary" />
                  <label htmlFor="req" className="text-white/50 text-xs">Required</label>
                  <button type="button" onClick={addField} className="ml-auto px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-semibold">+ Add</button>
                </div>
                {form.fields.map((fld, i) => (
                  <div key={fld.key} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/5 mb-1 text-xs text-white/70">
                    <span className="text-white/30 text-[10px] uppercase">{fld.type}</span>
                    <span className="flex-1">{fld.label}</span>
                    {fld.required && <span className="text-red-400">*</span>}
                    <button type="button" onClick={() => setForm(f => ({ ...f, fields: f.fields.filter((_, j) => j !== i) }))}>
                      <X className="w-3 h-3 text-white/30 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
