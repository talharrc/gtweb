import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import {
  Plus, Edit2, Trash2, X, Loader2, Calendar, ChevronDown, ChevronUp,
  Mail, ToggleLeft, ToggleRight, Link, Copy, CheckCheck,
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject, Milestone } from '../../types';
import { createProject, updateProject, deleteProject } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import StatusBadge from '../shared/StatusBadge';
import ProgressBar from '../shared/ProgressBar';
import EmptyState from '../shared/EmptyState';

type ProjectStatus = 'Discovery' | 'In Progress' | 'Review' | 'Completed';
const STATUSES: ProjectStatus[] = ['Discovery', 'In Progress', 'Review', 'Completed'];
const CATEGORIES = ['Web/App Development', 'Digital Marketing', 'AI Automation', 'Digital Finance', 'Other'];

const STATUS_COLORS: Record<string, string> = {
  Discovery: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'In Progress': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Review: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Completed: 'text-primary bg-primary/10 border-primary/20',
};

const EMPTY_FORM = {
  name: '',
  description: '',
  status: 'Discovery' as ProjectStatus,
  category: 'Web/App Development',
  progressPercent: 0,
  startDate: '',
  deadline: '',
  whatsappGroupUrl: '',
  projectValue: 0,
  clientEmail: '',
  builderEmailsRaw: '',
  inPortfolio: false,
  milestones: [] as Milestone[],
};

interface InviteResult {
  email: string;
  role: string;
  inviteUrl: string;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1 rounded text-white/30 hover:text-white/70 transition-colors flex-shrink-0"
      title="Copy"
    >
      {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdminProjectsSection() {
  const { isDemo, setIsDemo } = useAuth();
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [newMilestone, setNewMilestone] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [inviteResults, setInviteResults] = useState<InviteResult[] | null>(null);

  useEffect(() => {
    if (isDemo) {
      setProjects(mockDb.getProjects());
      setLoading(false);
      return;
    }
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
        setLoading(false);
      },
      (error) => {
        console.warn("Firestore error in AdminProjectsSection, falling back to Demo Mode:", error);
        setIsDemo(true);
        setLoading(false);
      },
    );
    return () => unsub();
  }, [isDemo]);

  const openNew = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setShowForm(true);
    setSaveError('');
    setInviteResults(null);
  };

  const openEdit = (p: GTProject) => {
    setForm({
      name: p.name,
      description: p.description,
      status: (STATUSES.includes(p.status as ProjectStatus) ? p.status : 'Discovery') as ProjectStatus,
      category: p.category ?? 'Web/App Development',
      progressPercent: p.progressPercent,
      startDate: (p as any).startDate ? new Date((p as any).startDate.seconds * 1000).toISOString().slice(0, 10) : '',
      deadline: p.deadline ? new Date(p.deadline.seconds * 1000).toISOString().slice(0, 10) : '',
      whatsappGroupUrl: p.whatsappGroupUrl ?? '',
      projectValue: p.projectValue ?? 0,
      clientEmail: p.clientEmail ?? p.clientInfo?.email ?? '',
      builderEmailsRaw: (p.builderEmails ?? []).join(', '),
      inPortfolio: p.inPortfolio ?? false,
      milestones: p.milestones ?? [],
    });
    setEditingId(p.id);
    setShowForm(true);
    setSaveError('');
    setInviteResults(null);
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm(f => ({
      ...f,
      milestones: [...f.milestones, { id: Date.now().toString(), title: newMilestone.trim(), status: 'pending' }],
    }));
    setNewMilestone('');
  };

  const parseEmails = (raw: string): string[] =>
    raw.split(/[,\n]+/).map(e => e.trim().toLowerCase()).filter(Boolean);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      const startDate = form.startDate
        ? Timestamp.fromDate(new Date(form.startDate))
        : Timestamp.now();
      const deadline = form.deadline
        ? Timestamp.fromDate(new Date(form.deadline))
        : Timestamp.now();
      const builderEmails = parseEmails(form.builderEmailsRaw);

      const data = {
        name: form.name,
        description: form.description,
        status: form.status,
        category: form.category,
        progressPercent: Number(form.progressPercent),
        startDate,
        deadline,
        whatsappGroupUrl: form.whatsappGroupUrl,
        projectValue: Number(form.projectValue),
        clientEmail: form.clientEmail.trim().toLowerCase(),
        builderEmails,
        inPortfolio: form.inPortfolio,
        milestones: form.milestones,
        clientUid: '',
        builderUids: [],
        clientInfo: { name: '', email: form.clientEmail.trim().toLowerCase() },
      };

      if (isDemo) {
        const mockProjects = mockDb.getProjects();
        const newProjId = editingId || `proj-${Date.now()}`;
        if (editingId) {
          const updated = mockProjects.map(p => p.id === editingId ? { ...p, ...data, id: editingId } : p);
          mockDb.saveProjects(updated as any);
        } else {
          mockProjects.push({ ...data, id: newProjId } as any);
          mockDb.saveProjects(mockProjects);
        }
        setProjects(mockDb.getProjects());
        
        if (!editingId) {
          const builderEmails = parseEmails(form.builderEmailsRaw);
          const results = [];
          if (form.clientEmail) {
            results.push({ email: form.clientEmail.trim().toLowerCase(), role: 'client', inviteUrl: `${window.location.origin}/hub/invite/demo-client-token` });
          }
          builderEmails.forEach(email => {
            results.push({ email, role: 'builder', inviteUrl: `${window.location.origin}/hub/invite/demo-builder-token-${email}` });
          });
          setInviteResults(results);
        } else {
          setShowForm(false);
        }
        setSaving(false);
        return;
      }

      let projectId = editingId;
      if (editingId) {
        await updateProject(editingId, data);
      } else {
        projectId = await createProject(data as any);
      }

      // Generate invite links for new projects with client/builder emails
      if (!editingId && projectId) {
        try {
          const res = await fetch('/api/admin/generate-invites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              projectId,
              projectName: form.name,
              clientEmail: form.clientEmail.trim().toLowerCase() || undefined,
              builderEmails: builderEmails.length > 0 ? builderEmails : undefined,
            }),
          });
          const invData = await res.json();
          if (invData.ok && invData.invites?.length > 0) {
            setInviteResults(invData.invites);
            return; // keep modal open to show links
          }
        } catch {
          // Non-fatal — project was created, invites failed
        }
      }

      setShowForm(false);
    } catch (err: any) {
      setSaveError(err?.code === 'permission-denied'
        ? 'Permission denied — make sure you are signed in as admin.'
        : (err?.message ?? 'Failed to save. Please try again.'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this project? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      if (isDemo) {
        const mockProjects = mockDb.getProjects();
        const filtered = mockProjects.filter(p => p.id !== id);
        mockDb.saveProjects(filtered);
        setProjects(filtered);
      } else {
        await deleteProject(id);
      }
    } finally { setDeletingId(null); }
  };

  const origin = window.location.origin;

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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="text-white font-semibold truncate">{p.name}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status] ?? 'text-white/40 bg-white/5 border-white/10'}`}>
                      {p.status}
                    </span>
                    {p.inPortfolio && (
                      <span className="text-[10px] text-secondary font-mono border border-secondary/30 rounded-full px-2 py-0.5">Portfolio</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs truncate">{p.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => setExpandedProject(expandedProject === p.id ? null : p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    {expandedProject === p.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => openEdit(p)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all disabled:opacity-50"
                  >
                    {deletingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <ProgressBar percent={p.progressPercent} />
              <div className="flex items-center gap-4 mt-3 text-xs text-white/40 flex-wrap">
                {(p.clientEmail || p.clientInfo?.email) && (
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-cyan-400/70" /> {p.clientEmail || p.clientInfo?.email}</span>
                )}
                {p.builderEmails && p.builderEmails.length > 0 && (
                  <span className="flex items-center gap-1 text-emerald-400/70">{p.builderEmails.length} builder{p.builderEmails.length !== 1 ? 's' : ''}</span>
                )}
                {p.deadline && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(p.deadline.seconds * 1000).toLocaleDateString()}</span>
                )}
                {p.projectValue ? <span className="text-emerald-400/70">৳{p.projectValue.toLocaleString()}</span> : null}
              </div>

              {expandedProject === p.id && (
                <div className="mt-4 pt-4 border-t border-white/5 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/30 font-mono uppercase text-[10px] mb-1">Client Email</p>
                      <p className="text-white/70">{p.clientEmail || p.clientInfo?.email || '—'}</p>
                    </div>
                    {p.builderEmails && p.builderEmails.length > 0 && (
                      <div>
                        <p className="text-white/30 font-mono uppercase text-[10px] mb-1">Builder Emails</p>
                        {p.builderEmails.map(e => <p key={e} className="text-white/70">{e}</p>)}
                      </div>
                    )}
                    {p.milestones && p.milestones.length > 0 && (
                      <div className="col-span-full">
                        <p className="text-white/30 font-mono uppercase text-[10px] mb-1">Milestones</p>
                        <div className="flex flex-wrap gap-1.5">
                          {p.milestones.map(m => (
                            <span key={m.id} className={`text-[10px] px-2 py-0.5 rounded-full ${
                              m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                              m.status === 'active'    ? 'bg-primary/20 text-primary' :
                                                        'bg-white/5 text-white/40'
                            }`}>{m.title}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl rounded-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => { setShowForm(false); setInviteResults(null); }}><X className="w-4 h-4 text-white/50" /></button>
            </div>

            {/* Invite links panel — shown after successful project creation */}
            {inviteResults ? (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-emerald-400 font-semibold text-sm mb-1">Project created!</p>
                  <p className="text-white/50 text-xs">Send these invite links to the respective people. Each link can only be used to set one password.</p>
                </div>
                {inviteResults.map(inv => (
                  <div key={inv.email} className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${inv.role === 'client' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'}`}>
                        {inv.role}
                      </span>
                      <span className="text-white/60 text-xs font-mono">{inv.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
                      <Link className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      <span className="text-white/70 text-xs font-mono flex-1 truncate">{origin}{inv.inviteUrl}</span>
                      <CopyButton text={`${origin}${inv.inviteUrl}`} />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => { setShowForm(false); setInviteResults(null); }}
                  className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Project Info */}
                <section>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Project Info</p>
                  <div className="flex flex-col gap-3">
                    <input
                      required
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Project name *"
                      className="admin-input"
                    />
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Description"
                      rows={2}
                      className="admin-input resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={form.category}
                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                        className="admin-input"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select
                        value={form.status}
                        onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                        className="admin-input"
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Progress %</label>
                        <input
                          type="number" min={0} max={100}
                          value={form.progressPercent}
                          onChange={e => setForm(f => ({ ...f, progressPercent: Number(e.target.value) }))}
                          className="admin-input w-full"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Start Date</label>
                        <input
                          type="date" value={form.startDate}
                          onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))}
                          className="admin-input w-full"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Deadline</label>
                        <input
                          type="date" value={form.deadline}
                          onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                          className="admin-input w-full"
                        />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs mb-1 block">Value (৳)</label>
                        <input
                          type="number" min={0}
                          value={form.projectValue}
                          onChange={e => setForm(f => ({ ...f, projectValue: Number(e.target.value) }))}
                          className="admin-input w-full"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    <input
                      value={form.whatsappGroupUrl}
                      onChange={e => setForm(f => ({ ...f, whatsappGroupUrl: e.target.value }))}
                      placeholder="WhatsApp group URL (optional)"
                      className="admin-input"
                    />

                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, inPortfolio: !f.inPortfolio }))}
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-left"
                    >
                      {form.inPortfolio
                        ? <ToggleRight className="w-5 h-5 text-secondary flex-shrink-0" />
                        : <ToggleLeft className="w-5 h-5 text-white/30 flex-shrink-0" />}
                      <span className={form.inPortfolio ? 'text-white' : 'text-white/50'}>
                        Add to Portfolio
                      </span>
                      {form.inPortfolio && (
                        <span className="ml-auto text-[10px] text-secondary font-mono border border-secondary/30 rounded-full px-2 py-0.5">On</span>
                      )}
                    </button>
                  </div>
                </section>

                {/* Client & Builder emails */}
                <section>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Access</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Client Email</label>
                      <input
                        type="email"
                        value={form.clientEmail}
                        onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                        placeholder="client@example.com"
                        className="admin-input"
                      />
                      {!editingId && (
                        <p className="text-white/25 text-[10px] mt-1 font-mono">An invite link will be generated and shown after saving.</p>
                      )}
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Builder Email(s)</label>
                      <textarea
                        value={form.builderEmailsRaw}
                        onChange={e => setForm(f => ({ ...f, builderEmailsRaw: e.target.value }))}
                        placeholder="builder1@example.com, builder2@example.com"
                        rows={2}
                        className="admin-input resize-none"
                      />
                      {!editingId && (
                        <p className="text-white/25 text-[10px] mt-1 font-mono">Comma-separated. Invite links generated for each.</p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Milestones */}
                <section>
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Milestones</p>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={newMilestone}
                      onChange={e => setNewMilestone(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                      placeholder="Add milestone…"
                      className="admin-input flex-1"
                    />
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
                </section>

                {saveError && (
                  <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{saveError}</p>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Project & Generate Invites'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
