import React, { useState, FormEvent } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useForms } from '../../hooks/useForms';
import { submitForm } from '../../services/formService';
import { GTForm, FormField } from '../../types';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

function FormRenderer({ form }: { key?: React.Key; form: GTForm }) {
  const [values, setValues] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try { await submitForm(form.id, values); setDone(true); } finally { setSubmitting(false); }
  };

  if (form.status === 'submitted') {
    return (
      <div className="glass-card rounded-2xl p-5 flex items-center gap-3 opacity-60">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <div>
          <p className="text-white font-semibold text-sm">{form.title}</p>
          <p className="text-white/40 text-xs">Submitted</p>
        </div>
        <StatusBadge status="submitted" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="glass-card rounded-2xl p-5 flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
        <p className="text-white font-semibold text-sm">{form.title} — submitted!</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3">
          <StatusBadge status="pending" />
          <p className="text-white font-semibold text-sm text-left">{form.title}</p>
          <p className="text-white/30 text-xs hidden sm:block">{form.fields.length} fields</p>
        </div>
        <span className="text-white/30 text-xs">{open ? 'Hide' : 'Fill form →'}</span>
      </button>
      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 border-t border-white/5">
          <div className="pt-4 flex flex-col gap-3">
            {form.fields.map((field: FormField) => (
              <div key={field.key}>
                <label className="text-white/60 text-xs mb-1.5 block">
                  {field.label} {field.required && <span className="text-red-400">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    rows={3}
                    required={field.required}
                    value={values[field.key] as string ?? ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="admin-input resize-none"
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={values[field.key] as string ?? ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="admin-input"
                  >
                    <option value="">Select…</option>
                    {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : field.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={values[field.key] as boolean ?? false}
                      onChange={e => setValues(v => ({ ...v, [field.key]: e.target.checked }))}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="text-white/70 text-sm">Yes</span>
                  </label>
                ) : (
                  <input
                    type="text"
                    required={field.required}
                    value={values[field.key] as string ?? ''}
                    onChange={e => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    className="admin-input"
                  />
                )}
              </div>
            ))}
            <button type="submit" disabled={submitting} className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function RequirementsForms() {
  const { projects } = useProjects();
  const project = projects[0] ?? null;
  const { forms, loading } = useForms(project?.id ?? null);

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-white font-bold text-2xl mb-1">Requirements & Forms</h2>
        <p className="text-white/40 text-sm">Fill forms requested by your project team</p>
      </div>
      {forms.length === 0 ? (
        <EmptyState title="No forms yet" description="Your team will request information here when needed." />
      ) : (
        <div className="flex flex-col gap-3">
          {forms.map(f => <FormRenderer key={f.id} form={f} />)}
        </div>
      )}
    </div>
  );
}
