import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Plus, Loader2, TrendingUp, DollarSign } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject, Payment, UserProfile } from '../../types';
import { recordPayment, updatePayment, calcBuilderEligibility } from '../../services/paymentService';
import { getAllUsers } from '../../services/userService';
import EmptyState from '../shared/EmptyState';

export default function AdminPaymentsSection() {
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ projectId: '', builderUid: '', projectValue: 0, builderSharePercent: 20, clientPaidAmount: 0, builderPaidAmount: 0 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'projects'), s => { setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as GTProject))); setLoading(false); });
    const u2 = onSnapshot(collection(db, 'payments'), s => setPayments(s.docs.map(d => ({ id: d.id, ...d.data() } as Payment))));
    getAllUsers().then(setUsers);
    return () => { u1(); u2(); };
  }, []);

  const nameFor = (uid: string) => users.find(u => u.uid === uid)?.displayName ?? uid.slice(0, 8) + '…';

  const filteredPayments = selectedProject ? payments.filter(p => p.projectId === selectedProject) : payments;

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await recordPayment(form as any); setShowNew(false); } finally { setSaving(false); }
  };

  const handleUpdate = async (id: string, field: 'clientPaidAmount' | 'builderPaidAmount', value: number) => {
    await updatePayment(id, { [field]: value });
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Payments</h2>
          <p className="text-white/40 text-sm">Track and record client & builder payments</p>
        </div>
        <button onClick={() => setShowNew(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all">
          <Plus className="w-4 h-4" /> New Record
        </button>
      </div>

      <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="admin-input mb-4 max-w-xs">
        <option value="">All projects</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      {filteredPayments.length === 0 ? (
        <EmptyState title="No payment records" description="Create a payment record for a project." />
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPayments.map(p => {
            const { builderShareAmount, builderEligible, builderDue, locked } = calcBuilderEligibility(p);
            const project = projects.find(pr => pr.id === p.projectId);
            return (
              <div key={p.id} className="glass-card rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-semibold text-sm">{project?.name ?? p.projectId.slice(0, 12)}</h3>
                    <p className="text-white/40 text-xs">Builder: {nameFor(p.builderUid)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono text-sm font-bold">৳{p.projectValue.toLocaleString()}</p>
                    <p className="text-white/40 text-xs">Project value</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Share %', value: `${p.builderSharePercent}%`, sub: `৳${builderShareAmount.toLocaleString()}` },
                    { label: 'Client Paid', value: `৳${p.clientPaidAmount.toLocaleString()}`, sub: `${Math.round((p.clientPaidAmount / p.projectValue) * 100)}% of total` },
                    { label: 'Builder Eligible', value: `৳${builderEligible.toLocaleString()}`, sub: 'unlocked so far', highlight: true },
                    { label: 'Builder Due', value: `৳${builderDue.toLocaleString()}`, sub: `paid: ৳${p.builderPaidAmount.toLocaleString()}`, highlight: builderDue > 0 },
                  ].map(c => (
                    <div key={c.label} className={`p-3 rounded-xl ${c.highlight ? 'bg-primary/10 border border-primary/20' : 'bg-white/5'}`}>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1">{c.label}</p>
                      <p className={`font-mono font-bold text-sm ${c.highlight ? 'text-primary' : 'text-white'}`}>{c.value}</p>
                      <p className="text-white/30 text-[10px]">{c.sub}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-white/40 text-xs mb-1 block">Update client paid (৳)</label>
                    <input type="number" defaultValue={p.clientPaidAmount}
                      onBlur={e => handleUpdate(p.id, 'clientPaidAmount', Number(e.target.value))}
                      className="admin-input text-sm" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs mb-1 block">Update builder paid (৳)</label>
                    <input type="number" defaultValue={p.builderPaidAmount}
                      onBlur={e => handleUpdate(p.id, 'builderPaidAmount', Number(e.target.value))}
                      className="admin-input text-sm" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNew && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-card w-full max-w-md rounded-2xl p-6">
            <h3 className="text-white font-bold mb-4">New Payment Record</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <select required value={form.projectId} onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))} className="admin-input">
                <option value="">Select project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select required value={form.builderUid} onChange={e => setForm(f => ({ ...f, builderUid: e.target.value }))} className="admin-input">
                <option value="">Select builder</option>
                {users.filter(u => u.role === 'builder').map(u => <option key={u.uid} value={u.uid}>{u.displayName || u.email}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-white/40 text-xs block mb-1">Project Value (৳)</label><input type="number" required value={form.projectValue} onChange={e => setForm(f => ({ ...f, projectValue: Number(e.target.value) }))} className="admin-input" /></div>
                <div><label className="text-white/40 text-xs block mb-1">Builder Share %</label><input type="number" min={0} max={100} value={form.builderSharePercent} onChange={e => setForm(f => ({ ...f, builderSharePercent: Number(e.target.value) }))} className="admin-input" /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowNew(false)} className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
