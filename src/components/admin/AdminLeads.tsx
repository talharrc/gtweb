import { useEffect, useState, useMemo } from 'react';
import { collection, onSnapshot, doc, updateDoc, orderBy, query, Timestamp } from 'firebase/firestore';
import { Loader2, Download, Search } from 'lucide-react';
import { db } from '../../lib/firebase';
import EmptyState from '../shared/EmptyState';

interface Lead {
  id: string;
  source: 'audit' | 'contact' | 'gbp';
  name?: string;
  email?: string;
  phone?: string;
  type?: string;
  submittedAt?: Timestamp;
  note?: string;
}

function toCSV(leads: Lead[]): string {
  const header = 'Source,Name,Email,Phone,Type,Date,Note';
  const rows = leads.map(l => [
    l.source, l.name ?? '', l.email ?? '', l.phone ?? '', l.type ?? '',
    l.submittedAt ? new Date(l.submittedAt.seconds * 1000).toLocaleDateString() : '',
    (l.note ?? '').replace(/,/g, ';'),
  ].join(','));
  return [header, ...rows].join('\n');
}

export default function AdminLeads() {
  const [auditLeads, setAuditLeads] = useState<Lead[]>([]);
  const [contactLeads, setContactLeads] = useState<Lead[]>([]);
  const [gbpLeads, setGbpLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');

  useEffect(() => {
    let loaded = 0;
    const done = () => { if (++loaded === 3) setLoading(false); };

    const u1 = onSnapshot(query(collection(db, 'audit_submissions'), orderBy('submittedAt', 'desc')), s => {
      setAuditLeads(s.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, source: 'audit',
          name: data.formData?.businessName ?? data.formData?.name ?? data.businessName,
          email: data.formData?.email ?? data.contactEmail,
          phone: data.formData?.phone ?? data.contactPhone,
          type: data.type ?? 'Audit',
          submittedAt: data.submittedAt,
          note: data.adminNote,
        } as Lead;
      }));
      done();
    }, done);

    const u2 = onSnapshot(query(collection(db, 'contact_submissions'), orderBy('submittedAt', 'desc')), s => {
      setContactLeads(s.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, source: 'contact',
          name: data.name, email: data.email, phone: data.phone,
          type: 'Contact Form', submittedAt: data.submittedAt, note: data.adminNote,
        } as Lead;
      }));
      done();
    }, done);

    const u3 = onSnapshot(query(collection(db, 'gbp_applications'), orderBy('submittedAt', 'desc')), s => {
      setGbpLeads(s.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, source: 'gbp',
          name: data.name, email: data.email, phone: data.phone,
          type: `GBP · ${data.track ?? ''}`, submittedAt: data.submittedAt, note: data.adminNote,
        } as Lead;
      }));
      done();
    }, done);

    return () => { u1(); u2(); u3(); };
  }, []);

  const allLeads = useMemo(() => {
    let leads = [...auditLeads, ...contactLeads, ...gbpLeads];
    if (filterSource) leads = leads.filter(l => l.source === filterSource);
    if (search) {
      const q = search.toLowerCase();
      leads = leads.filter(l =>
        (l.name ?? '').toLowerCase().includes(q) ||
        (l.email ?? '').toLowerCase().includes(q) ||
        (l.phone ?? '').toLowerCase().includes(q)
      );
    }
    return leads.sort((a, b) => (b.submittedAt?.seconds ?? 0) - (a.submittedAt?.seconds ?? 0));
  }, [auditLeads, contactLeads, gbpLeads, search, filterSource]);

  const updateNote = async (lead: Lead, note: string) => {
    const col = lead.source === 'audit' ? 'audit_submissions'
      : lead.source === 'contact' ? 'contact_submissions'
      : 'gbp_applications';
    await updateDoc(doc(db, col, lead.id), { adminNote: note });
  };

  const exportCSV = () => {
    const csv = toCSV(allLeads);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white font-bold text-xl">Leads</h2>
          <p className="text-white/40 text-sm">{allLeads.length} contacts across all sources</p>
        </div>
        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email, phone…" className="admin-input pl-9 w-full" />
        </div>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)} className="admin-input max-w-[160px]">
          <option value="">All sources</option>
          <option value="audit">Audit</option>
          <option value="contact">Contact</option>
          <option value="gbp">GBP</option>
        </select>
      </div>

      {allLeads.length === 0 ? (
        <EmptyState title="No leads yet" description="Leads from audit submissions, contact forms, and GBP applications will appear here." />
      ) : (
        <div className="flex flex-col gap-3">
          {allLeads.map(lead => (
            <div key={lead.source + lead.id} className="glass-card rounded-2xl p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-white font-semibold text-sm">{lead.name || '(No name)'}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {lead.email && <p className="text-white/50 text-xs">{lead.email}</p>}
                    {lead.phone && <p className="text-white/50 text-xs">{lead.phone}</p>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    lead.source === 'audit' ? 'bg-amber-500/10 text-amber-400'
                    : lead.source === 'contact' ? 'bg-primary/10 text-primary'
                    : 'bg-emerald-500/10 text-emerald-400'
                  }`}>{lead.type}</span>
                  <p className="text-white/30 text-[10px] mt-1">
                    {lead.submittedAt ? new Date(lead.submittedAt.seconds * 1000).toLocaleDateString() : ''}
                  </p>
                </div>
              </div>
              <input
                defaultValue={lead.note ?? ''}
                onBlur={e => updateNote(lead, e.target.value)}
                placeholder="Add follow-up note…"
                className="admin-input text-xs w-full"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
