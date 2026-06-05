import { useState, useEffect, FormEvent } from 'react';
import {
  collection, onSnapshot, Timestamp, addDoc, serverTimestamp, setDoc, doc,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword, signOut as fbSignOut,
} from 'firebase/auth';
import {
  Plus, Edit2, Archive, X, Loader2, Calendar, Copy, Check,
  ChevronDown, ChevronUp, User, Hammer, KeyRound, RefreshCw,
} from 'lucide-react';
import { db, secondaryAuth } from '../../lib/firebase';
import { GTProject, Milestone, BuilderInfo } from '../../types';
import { createProject, updateProject, archiveProject } from '../../services/projectService';
import { generatePassword, slugify } from '../../services/credentialService';
import StatusBadge from '../shared/StatusBadge';
import ProgressBar from '../shared/ProgressBar';
import EmptyState from '../shared/EmptyState';

const CATEGORIES = ['Web/App Development', 'Digital Marketing', 'AI Automation', 'Digital Finance', 'Other'];
const SPECIALTIES = ['Frontend', 'Backend', 'Full-stack', 'Design', 'DevOps', 'Marketing', 'Other'];

interface BuilderForm {
  name: string;
  specialty: string;
  email: string;
  username: string;
  password: string;
}

const emptyBuilder = (): BuilderForm => ({
  name: '', specialty: 'Full-stack', email: '', username: '', password: generatePassword(),
});

const EMPTY_FORM = {
  name: '', description: '', status: 'active' as GTProject['status'],
  progressPercent: 0, deadline: '', whatsappGroupUrl: '',
  category: 'Web/App Development', projectValue: 0,
  clientName: '', clientCompany: '', clientEmail: '', clientPhone: '',
  clientUsername: '', clientPassword: generatePassword(),
  milestones: [] as Milestone[],
  builders: [emptyBuilder()] as BuilderForm[],
};

interface CreatedCredential {
  role: string;
  displayName: string;
  username: string;
  password: string;
}

async function createHubFirebaseAccount(
  username: string,
  password: string,
  displayName: string,
  role: 'client' | 'builder',
  projectId: string,
): Promise<string> {
  const email = `${username.trim().toLowerCase()}@gt.hub`;
  const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
  const uid = cred.user.uid;
  // Sign out of secondary app immediately after getting uid
  await fbSignOut(secondaryAuth);

  // Write user profile to Firestore so Firestore rules can verify role
  await setDoc(doc(db, 'users', uid), {
    uid,
    email,
    role,
    displayName,
    projectId,
    projectIds: [projectId],
    createdAt: serverTimestamp(),
    lastLogin: null,
  });

  return uid;
}

export default function AdminProjectsSection() {
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [newMilestone, setNewMilestone] = useState('');
  const [createdCredentials, setCreatedCredentials] = useState<CreatedCredential[] | null>(null);
  const [createdProjectName, setCreatedProjectName] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'projects'),
      (snap) => {
        setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTProject)));
        setLoading(false);
      },
      () => setLoading(false),
    );
    return () => unsub();
  }, []);

  const updateClientUsername = (projectName: string) => {
    setForm(f => ({ ...f, clientUsername: `client_${slugify(projectName)}` }));
  };

  const openNew = () => {
    const pw = generatePassword();
    setForm({ ...EMPTY_FORM, clientPassword: pw, builders: [emptyBuilder()] });
    setEditingId(null);
    setShowForm(true);
    setSaveError('');
  };

  const openEdit = (p: GTProject) => {
    setForm({
      name: p.name, description: p.description, status: p.status,
      progressPercent: p.progressPercent,
      deadline: p.deadline ? new Date(p.deadline.seconds * 1000).toISOString().slice(0, 10) : '',
      whatsappGroupUrl: p.whatsappGroupUrl ?? '',
      category: p.category ?? 'Web/App Development',
      projectValue: p.projectValue ?? 0,
      clientName: p.clientInfo?.name ?? '',
      clientCompany: p.clientInfo?.company ?? '',
      clientEmail: p.clientInfo?.email ?? '',
      clientPhone: p.clientInfo?.phone ?? '',
      clientUsername: '',
      clientPassword: generatePassword(),
      milestones: p.milestones ?? [],
      builders: p.builders?.map(b => ({
        name: b.name, specialty: b.specialty ?? 'Full-stack',
        email: b.email ?? '', username: '', password: generatePassword(),
      })) ?? [emptyBuilder()],
    });
    setEditingId(p.id);
    setShowForm(true);
    setSaveError('');
  };

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setForm(f => ({
      ...f,
      milestones: [...f.milestones, { id: Date.now().toString(), title: newMilestone, status: 'pending' }],
    }));
    setNewMilestone('');
  };

  const updateBuilder = (i: number, field: keyof BuilderForm, value: string) => {
    setForm(f => {
      const builders = [...f.builders];
      builders[i] = { ...builders[i], [field]: value };
      if (field === 'name') {
        builders[i].username = `builder_${slugify(f.name || 'project')}_${i}`;
      }
      return { ...f, builders };
    });
  };

  const addBuilder = () => setForm(f => ({ ...f, builders: [...f.builders, emptyBuilder()] }));
  const removeBuilder = (i: number) => setForm(f => ({ ...f, builders: f.builders.filter((_, j) => j !== i) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError('');

    try {
      const deadline = form.deadline
        ? Timestamp.fromDate(new Date(form.deadline))
        : Timestamp.now();

      if (editingId) {
        const builderInfos: BuilderInfo[] = form.builders.map((b, i) => ({
          uid: `builder_${editingId}_${i}`,
          name: b.name,
          specialty: b.specialty,
          email: b.email || undefined,
        }));
        await updateProject(editingId, {
          name: form.name, description: form.description,
          status: form.status, progressPercent: Number(form.progressPercent),
          deadline, whatsappGroupUrl: form.whatsappGroupUrl,
          category: form.category, projectValue: Number(form.projectValue),
          clientInfo: {
            name: form.clientName, company: form.clientCompany || undefined,
            email: form.clientEmail || undefined, phone: form.clientPhone || undefined,
          },
          builders: builderInfos, milestones: form.milestones,
        });
        setShowForm(false);
        return;
      }

      // ── New project ──────────────────────────────────────────────────────────

      // 1. Create project stub to get the Firestore doc ID
      const projectId = await createProject({
        name: form.name, description: form.description,
        status: form.status, progressPercent: Number(form.progressPercent),
        deadline, whatsappGroupUrl: form.whatsappGroupUrl,
        category: form.category, projectValue: Number(form.projectValue),
        clientInfo: {
          name: form.clientName, company: form.clientCompany || undefined,
          email: form.clientEmail || undefined, phone: form.clientPhone || undefined,
        },
        milestones: form.milestones,
        clientUid: 'pending', builderUids: [], builders: [],
      } as any);

      // 2. Create Firebase Auth accounts and Firestore user docs
      const clientUsername = (form.clientUsername || `client_${slugify(form.name)}`).toLowerCase();
      const newCreds: CreatedCredential[] = [];

      let clientUid: string;
      try {
        clientUid = await createHubFirebaseAccount(
          clientUsername, form.clientPassword,
          form.clientName || 'Client', 'client', projectId,
        );
      } catch (authErr: any) {
        // If Firebase Auth account already exists, re-use by querying; otherwise surface error
        if (authErr?.code === 'auth/email-already-in-use') {
          setSaveError(`Username "${clientUsername}" is already taken. Choose a different client username.`);
          setSaving(false);
          return;
        }
        throw authErr;
      }
      newCreds.push({ role: 'Client', displayName: form.clientName || 'Client', username: clientUsername, password: form.clientPassword });

      const builderUids: string[] = [];
      const builderInfos: BuilderInfo[] = [];

      for (let i = 0; i < form.builders.length; i++) {
        const b = form.builders[i];
        const builderUsername = (b.username || `builder_${slugify(form.name)}_${i}`).toLowerCase();
        let builderUid: string;
        try {
          builderUid = await createHubFirebaseAccount(
            builderUsername, b.password,
            b.name || `Builder ${i + 1}`, 'builder', projectId,
          );
        } catch (authErr: any) {
          if (authErr?.code === 'auth/email-already-in-use') {
            setSaveError(`Builder username "${builderUsername}" is already taken. Choose a different username.`);
            setSaving(false);
            return;
          }
          throw authErr;
        }
        builderUids.push(builderUid);
        builderInfos.push({ uid: builderUid, name: b.name, specialty: b.specialty, email: b.email || undefined });
        newCreds.push({ role: 'Builder', displayName: b.name || `Builder ${i + 1}`, username: builderUsername, password: b.password });
      }

      // 3. Update project with real UIDs
      await updateProject(projectId, { clientUid, builderUids, builders: builderInfos });

      // 4. Create initial payment record
      if (Number(form.projectValue) > 0) {
        await addDoc(collection(db, 'payments'), {
          projectId, projectValue: Number(form.projectValue),
          builderUid: builderUids[0] ?? '',
          builderSharePercent: 0,
          clientPaidAmount: 0, builderPaidAmount: 0,
          paymentHistory: [],
          createdAt: serverTimestamp(),
        });
      }

      setCreatedProjectName(form.name);
      setCreatedCredentials(newCreds);
      setShowForm(false);
    } catch (err: any) {
      const msg = err?.code === 'permission-denied'
        ? 'Permission denied — make sure you are signed in as admin.'
        : (err?.message ?? 'Failed to save. Please try again.');
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  const copyAll = () => {
    if (!createdCredentials) return;
    const lines = [
      `Project: ${createdProjectName}`,
      '─────────────────────────',
      ...createdCredentials.map(c =>
        `${c.role.toUpperCase()} — ${c.displayName}\n  Username: ${c.username}\n  Password: ${c.password}`
      ),
      '',
      'Hub URLs:',
      `  Client  → ${window.location.origin}/hub/client`,
      `  Builder → ${window.location.origin}/hub/builder`,
    ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
                    {p.category && <span className="text-[10px] text-white/30 font-mono">{p.category}</span>}
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
                  <button onClick={() => archiveProject(p.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-all">
                    <Archive className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <ProgressBar percent={p.progressPercent} />
              <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                {p.clientInfo?.name && <span className="flex items-center gap-1"><User className="w-3 h-3" /> {p.clientInfo.name}</span>}
                <span className="flex items-center gap-1"><Hammer className="w-3 h-3" /> {p.builderUids?.length ?? 0} builder{(p.builderUids?.length ?? 0) !== 1 ? 's' : ''}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                  {p.deadline ? new Date(p.deadline.seconds * 1000).toLocaleDateString() : 'No deadline'}
                </span>
                {p.projectValue ? <span className="text-emerald-400/70">৳{p.projectValue.toLocaleString()}</span> : null}
              </div>

              {expandedProject === p.id && (
                <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3 text-xs">
                  {p.clientInfo && (
                    <div>
                      <p className="text-white/30 font-mono uppercase text-[10px] mb-1">Client</p>
                      <p className="text-white/70">{p.clientInfo.name}</p>
                      {p.clientInfo.company && <p className="text-white/40">{p.clientInfo.company}</p>}
                      {p.clientInfo.email && <p className="text-white/40">{p.clientInfo.email}</p>}
                      {p.clientInfo.phone && <p className="text-white/40">{p.clientInfo.phone}</p>}
                    </div>
                  )}
                  {p.builders && p.builders.length > 0 && (
                    <div>
                      <p className="text-white/30 font-mono uppercase text-[10px] mb-1">Builders</p>
                      {p.builders.map((b, i) => (
                        <div key={i} className="mb-1">
                          <p className="text-white/70">{b.name} <span className="text-white/30">({b.specialty})</span></p>
                          {b.email && <p className="text-white/40">{b.email}</p>}
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

      {/* Credentials Summary Modal */}
      {createdCredentials && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                <h3 className="text-white font-bold">Credentials Created</h3>
              </div>
              <button onClick={() => setCreatedCredentials(null)}><X className="w-4 h-4 text-white/50" /></button>
            </div>
            <p className="text-white/40 text-xs mb-4 font-mono">Project: {createdProjectName}</p>

            <div className="flex flex-col gap-3 mb-5">
              {createdCredentials.map((c, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3.5 border border-white/10">
                  <div className="flex items-center gap-1.5 mb-2">
                    {c.role === 'Client' ? <User className="w-3.5 h-3.5 text-cyan-400" /> : <Hammer className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className={`text-xs font-bold ${c.role === 'Client' ? 'text-cyan-400' : 'text-emerald-400'}`}>{c.role}</span>
                    <span className="text-white/50 text-xs">— {c.displayName}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <p className="text-white/30 mb-0.5">Username</p>
                      <p className="text-white/80">{c.username}</p>
                    </div>
                    <div>
                      <p className="text-white/30 mb-0.5">Password</p>
                      <p className="text-white/80">{c.password}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-4 text-xs font-mono text-white/50">
              <p>Client Hub  → <span className="text-white/70">{window.location.origin}/hub/client</span></p>
              <p>Builder Hub → <span className="text-white/70">{window.location.origin}/hub/builder</span></p>
            </div>

            <button onClick={copyAll} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy All Credentials'}
            </button>
          </div>
        </div>
      )}

      {/* Project Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-2xl rounded-2xl p-6 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editingId ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-white/50" /></button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Project Info */}
              <section>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Project Info</p>
                <div className="flex flex-col gap-3">
                  <input required value={form.name}
                    onChange={e => { setForm(f => ({ ...f, name: e.target.value })); if (!editingId) updateClientUsername(e.target.value); }}
                    placeholder="Project name *" className="admin-input" />
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Description" rows={2} className="admin-input resize-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="admin-input">
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as GTProject['status'] }))} className="admin-input">
                      {['active', 'paused', 'completed', 'archived'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Progress %</label>
                      <input type="number" min={0} max={100} value={form.progressPercent}
                        onChange={e => setForm(f => ({ ...f, progressPercent: Number(e.target.value) }))} className="admin-input w-full" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Deadline</label>
                      <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} className="admin-input w-full" />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Project Value (৳)</label>
                      <input type="number" min={0} value={form.projectValue}
                        onChange={e => setForm(f => ({ ...f, projectValue: Number(e.target.value) }))} className="admin-input w-full" placeholder="0" />
                    </div>
                  </div>
                  <input value={form.whatsappGroupUrl} onChange={e => setForm(f => ({ ...f, whatsappGroupUrl: e.target.value }))}
                    placeholder="WhatsApp group URL (optional)" className="admin-input" />
                </div>
              </section>

              {/* Milestones */}
              <section>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Milestones</p>
                <div className="flex gap-2 mb-2">
                  <input value={newMilestone} onChange={e => setNewMilestone(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                    placeholder="Add milestone…" className="admin-input flex-1" />
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

              {/* Client Info */}
              <section>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-3">Client Info</p>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input required value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                      placeholder="Client full name *" className="admin-input" />
                    <input value={form.clientCompany} onChange={e => setForm(f => ({ ...f, clientCompany: e.target.value }))}
                      placeholder="Company name" className="admin-input" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="email" value={form.clientEmail} onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                      placeholder="Contact email" className="admin-input" />
                    <input value={form.clientPhone} onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
                      placeholder="Contact phone" className="admin-input" />
                  </div>
                  {!editingId && (
                    <>
                      <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                        <KeyRound className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                        <span className="text-cyan-400/70 text-[10px] font-mono">Client Login Credentials</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input value={form.clientUsername}
                          onChange={e => setForm(f => ({ ...f, clientUsername: e.target.value.toLowerCase() }))}
                          placeholder="Username" className="admin-input font-mono text-sm" />
                        <div className="flex gap-1.5">
                          <input value={form.clientPassword}
                            onChange={e => setForm(f => ({ ...f, clientPassword: e.target.value }))}
                            placeholder="Password" className="admin-input font-mono text-sm flex-1" />
                          <button type="button" onClick={() => setForm(f => ({ ...f, clientPassword: generatePassword() }))}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex-shrink-0">
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Builders */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Builders</p>
                  <button type="button" onClick={addBuilder} className="flex items-center gap-1 text-xs text-primary/80 hover:text-primary transition-colors">
                    <Plus className="w-3 h-3" /> Add Builder
                  </button>
                </div>
                {form.builders.map((b, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-emerald-400/70 text-[10px] font-mono uppercase">Builder {i + 1}</span>
                      {form.builders.length > 1 && (
                        <button type="button" onClick={() => removeBuilder(i)} className="text-white/30 hover:text-red-400 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="grid grid-cols-2 gap-2.5">
                        <input required value={b.name} onChange={e => updateBuilder(i, 'name', e.target.value)}
                          placeholder="Builder name *" className="admin-input" />
                        <select value={b.specialty} onChange={e => updateBuilder(i, 'specialty', e.target.value)} className="admin-input">
                          {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <input type="email" value={b.email} onChange={e => updateBuilder(i, 'email', e.target.value)}
                        placeholder="Contact email (optional)" className="admin-input" />
                      {!editingId && (
                        <>
                          <div className="flex items-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <KeyRound className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span className="text-emerald-400/70 text-[10px] font-mono">Builder Login Credentials</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            <input value={b.username} onChange={e => updateBuilder(i, 'username', e.target.value.toLowerCase())}
                              placeholder="Username" className="admin-input font-mono text-sm" />
                            <div className="flex gap-1.5">
                              <input value={b.password} onChange={e => updateBuilder(i, 'password', e.target.value)}
                                placeholder="Password" className="admin-input font-mono text-sm flex-1" />
                              <button type="button" onClick={() => updateBuilder(i, 'password', generatePassword())}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all flex-shrink-0">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </section>

              {saveError && (
                <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{saveError}</p>
              )}

              <button type="submit" disabled={saving}
                className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Save Changes' : 'Create Project & Generate Credentials'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
