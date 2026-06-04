import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { Plus, Edit2, Archive, X, Loader2, Users, Calendar } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject, UserProfile, Milestone } from '../../types';
import { createProject, updateProject, archiveProject } from '../../services/projectService';
import { getUsersByRole } from '../../services/userService';
import StatusBadge from '../shared/StatusBadge';
import ProgressBar from '../shared/ProgressBar';
import EmptyState from '../shared/EmptyState';

const EMPTY_FORM = {
  name: '', description: '', status: 'active' as GTProject['status'],
  progressPercent: 0, deadline: '', clientUid: '', builderUids: [] as string[],
  whatsappGroupUrl: '', milestones: [] as Milestone[],
};

export default function AdminProjectsSection() {
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [clients, setClients] = useState<UserProfile[]>([]);
  const [builders, setBuilders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
      setLoading(false);
    });
    getUsersByRole('client').then(setClients);
    getUsersByRole('builder').then(setBuilders);
    return () => unsub();
  }, []);

  const openNew = () => { setForm({ ...EMPTY_FORM }); setEditingId(null); setShowForm(true); };
  const openEdit = (p: GTProject) => {
    setForm({
      name: p.name, description: p.description, status: p.status,
      progressPercent: p.progressPercent,
      deadline: p.deadline ? new Date(p.deadline.seconds * 1000).toISOString().slice(0, 10) : '',
      clientUid: p.clientUid, builderUids: p.builderUids,
      whatsappGroupUrl: p.whatsappGroupUrl ?? '', milestones: p.milestones ?? [],
    });
    setEditingId(p.id); setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        deadline: form.deadline ? Timestamp.fromDate(new Date(form.deadline)) : Timestamp.now(),
        progressPercent: Number(form.progressPercent),
      };
      if (editingId) {
        await updateProject(editingId, data);
      } else {
        await createProject(data as any);
      }
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm(f => ({
      ...f,
      milestones: [...f.milestones, { id: Date.now().toString(), title: newMilestone, status: 'pending' }],
    }));
    setNewMilestone('');
  };

  const toggleBuilder = (uid: string) => {
    setForm(f => ({
      ...f,
      builderUids: f.builderUids.includes(uid) ? f.builderUids.filter(b => b !== uid) : [...f.builderUids, uid],
    }));
  };

  const nameFor = (uid: string, list: UserProfile[]) =>
    list.find(u => u.uid === uid)?.displayName ?? uid.slice(0, 8);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Projects</h2>
          <p className="text-white/40 text-sm">{projects.length} total</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create the first project to get started." />
      ) : (
        <div className="grid gap-4">
          {projects.map(p => (
            <div key={p.id} className="glass-card rounded-2xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold truncate">{p.name}</h3>
                    <StatusBadge status={p.status} />
                  </div>
                  <p className="text-white/40 text-xs truncate">{p.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => archiveProject(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <ProgressBar percent={p.progressPercent} />
              <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {p.builderUids?.length ?? 0} builders</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                  {p.deadline ? new Date(p.deadline.seconds * 1000).toLocaleDateString() : 'No deadline'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold">{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name" className="admin-input" />
              <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={2} className="admin-input resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as GTProject['status'] }))} className="admin-input">
                  {['active', 'paused', 'completed', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <div>
                  <label className="text-white/40 text-xs mb-1 block">Progress %</label>
                  <input type="number" min={0} max={100} value={form.progressPercent} onChange={e => setForm(f => ({ ...f, progressPercent: Number(e.target.value) }))} className="admin-input w-full" />
                </div>
              </div>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="admin-input" />
              <select value={form.clientUid} onChange={e => setForm(f => ({ ...f, clientUid: e.target.value }))} className="admin-input">
                <option value="">Select client</option>
                {clients.map(c => <option key={c.uid} value={c.uid}>{c.displayName || c.email}</option>)}
              </select>
              <div>
                <p className="text-white/40 text-xs mb-2">Builders (select multiple)</p>
                <div className="flex flex-wrap gap-2">
                  {builders.map(b => (
                    <button type="button" key={b.uid} onClick={() => toggleBuilder(b.uid)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${form.builderUids.includes(b.uid) ? 'bg-primary/30 text-primary border border-primary/40' : 'bg-white/5 text-white/50 border border-white/10 hover:border-white/20'}`}>
                      {b.displayName || b.email}
                    </button>
                  ))}
                  {builders.length === 0 && <p className="text-white/30 text-xs">No builders provisioned yet</p>}
                </div>
              </div>
              <input value={form.whatsappGroupUrl} onChange={e => setForm(f => ({ ...f, whatsappGroupUrl: e.target.value }))} placeholder="WhatsApp group URL (optional)" className="admin-input" />
              <div>
                <p className="text-white/40 text-xs mb-2">Milestones</p>
                <div className="flex gap-2 mb-2">
                  <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())} placeholder="Add milestone…" className="admin-input flex-1" />
                  <button type="button" onClick={addMilestone} className="px-3 py-2 rounded-lg bg-primary/20 text-primary text-xs">Add</button>
                </div>
                {form.milestones.map((m, i) => (
                  <div key={m.id} className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/5 mb-1 text-xs text-white/70">
                    {m.title}
                    <button type="button" onClick={() => setForm(f => ({ ...f, milestones: f.milestones.filter((_, j) => j !== i) }))}>
                      <X className="w-3 h-3 text-white/30 hover:text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
              <button type="submit" disabled={saving} className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Save Changes' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
