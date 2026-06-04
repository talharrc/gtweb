import { useState, useEffect, FormEvent } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { Upload, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { GTProject, GTDocument } from '../../types';
import { uploadDocument } from '../../services/documentService';
import StatusBadge from '../shared/StatusBadge';
import EmptyState from '../shared/EmptyState';

const DOC_TYPES: GTDocument['type'][] = ['agreement', 'proposal', 'invoice', 'deliverable', 'handover'];

export default function AdminDocumentsSection() {
  const [projects, setProjects] = useState<GTProject[]>([]);
  const [documents, setDocuments] = useState<GTDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState('');
  const [form, setForm] = useState({ type: 'agreement' as GTDocument['type'], version: '1.0', isLatest: true });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'projects'), s => { setProjects(s.docs.map(d => ({ id: d.id, ...d.data() } as GTProject))); setLoading(false); });
    const u2 = onSnapshot(collection(db, 'documents'), s => setDocuments(s.docs.map(d => ({ id: d.id, ...d.data() } as GTDocument))));
    return () => { u1(); u2(); };
  }, []);

  const filtered = selectedProject ? documents.filter(d => d.projectId === selectedProject) : documents;

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file || !selectedProject) return;
    setUploading(true);
    try {
      await uploadDocument(selectedProject, file, { ...form, projectId: selectedProject, name: file.name, uploadedBy: 'admin' }, setProgress);
      setFile(null);
      setProgress(0);
    } finally { setUploading(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div>
      <h2 className="text-white font-bold text-xl mb-1">Documents</h2>
      <p className="text-white/40 text-sm mb-6">Upload agreements, invoices, deliverables to Firebase Storage</p>

      <div className="glass-card rounded-2xl p-5 mb-6">
        <h3 className="text-white font-semibold text-sm mb-3">Upload Document</h3>
        <form onSubmit={handleUpload} className="flex flex-col gap-3">
          <select required value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="admin-input">
            <option value="">Select project</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as GTDocument['type'] }))} className="admin-input">
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input value={form.version} onChange={e => setForm(f => ({ ...f, version: e.target.value }))} placeholder="Version (e.g. 1.0)" className="admin-input" />
          </div>
          <label className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition-all">
            <Upload className="w-4 h-4 text-white/40 flex-shrink-0" />
            <span className="text-white/50 text-sm">{file ? file.name : 'Click to choose file'}</span>
            <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
          </label>
          {uploading && (
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${progress}%` }} />
            </div>
          )}
          <button type="submit" disabled={uploading || !file || !selectedProject} className="py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : 'Upload'}
          </button>
        </form>
      </div>

      <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)} className="admin-input mb-4 max-w-xs">
        <option value="">All projects</option>
        {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select>

      {filtered.length === 0 ? (
        <EmptyState title="No documents" description="Upload the first document above." />
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(d => (
            <div key={d.id} className="glass-card rounded-xl px-4 py-3 flex items-center gap-3">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{d.name}</p>
                <p className="text-white/40 text-xs">{d.type} · v{d.version}</p>
              </div>
              {d.isLatest && <StatusBadge status="active" />}
              <a href={d.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
