import { useState, useEffect, FormEvent } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { mockDb } from '../../lib/mockData';
import { Loader2, Save, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';

interface GBPStatus {
  status: 'open' | 'closed';
  nextBatchDate: string | null;
}

interface HomepageStats {
  projectsDelivered: number;
  countriesServed: number;
  buildersInProgram: number;
}

export default function AdminSiteSettings() {
  const { isDemo, setIsDemo } = useAuth();
  const [gbpStatus, setGbpStatus] = useState<GBPStatus>({ status: 'open', nextBatchDate: null });
  const [stats, setStats] = useState<HomepageStats>({ projectsDelivered: 0, countriesServed: 0, buildersInProgram: 0 });
  const [loading, setLoading] = useState(true);
  const [savingGBP, setSavingGBP] = useState(false);
  const [savingStats, setSavingStats] = useState(false);
  const [gbpSaved, setGbpSaved] = useState(false);
  const [statsSaved, setStatsSaved] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setGbpStatus(mockDb.getGbpStatus() as any);
      setStats(mockDb.getHomepageStats());
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [gbpSnap, statsSnap] = await Promise.all([
          getDoc(doc(db, 'site_config', 'gbp_status')),
          getDoc(doc(db, 'site_config', 'homepage_stats')),
        ]);
        if (gbpSnap.exists()) setGbpStatus(gbpSnap.data() as GBPStatus);
        if (statsSnap.exists()) setStats(statsSnap.data() as HomepageStats);
      } catch (err) {
        console.warn("Firestore error in AdminSiteSettings, falling back to Demo Mode:", err);
        setIsDemo(true);
      }
      setLoading(false);
    };
    load();
  }, [isDemo]);

  const saveGBP = async () => {
    setSavingGBP(true);
    try {
      if (isDemo) {
        mockDb.saveGbpStatus(gbpStatus);
        setGbpSaved(true);
        setTimeout(() => setGbpSaved(false), 2000);
      } else {
        await setDoc(doc(db, 'site_config', 'gbp_status'), gbpStatus);
        setGbpSaved(true);
        setTimeout(() => setGbpSaved(false), 2000);
      }
    } finally { setSavingGBP(false); }
  };

  const saveStats = async () => {
    setSavingStats(true);
    try {
      if (isDemo) {
        mockDb.saveHomepageStats(stats);
        setStatsSaved(true);
        setTimeout(() => setStatsSaved(false), 2000);
      } else {
        await setDoc(doc(db, 'site_config', 'homepage_stats'), stats);
        setStatsSaved(true);
        setTimeout(() => setStatsSaved(false), 2000);
      }
    } finally { setSavingStats(false); }
  };

  if (loading) return <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-primary animate-spin" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="mb-7">
        <h2 className="text-white font-bold text-xl">Site Settings</h2>
        <p className="text-white/40 text-sm mt-1">Control live site configuration from here</p>
      </div>

      {/* GBP Status */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <h3 className="text-white font-semibold text-sm mb-4">GBP Status</h3>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setGbpStatus(s => ({ ...s, status: s.status === 'open' ? 'closed' : 'open' }))}
            className="flex items-center gap-2 text-sm font-semibold"
          >
            {gbpStatus.status === 'open'
              ? <ToggleRight className="w-7 h-7 text-emerald-400" />
              : <ToggleLeft className="w-7 h-7 text-white/30" />
            }
            <span className={gbpStatus.status === 'open' ? 'text-emerald-400' : 'text-white/40'}>
              Applications are {gbpStatus.status === 'open' ? 'OPEN' : 'CLOSED'}
            </span>
          </button>
        </div>
        <div className="mb-4">
          <label className="text-white/40 text-xs mb-1 block">Next Batch Date (displayed on GBP page)</label>
          <input
            value={gbpStatus.nextBatchDate ?? ''}
            onChange={e => setGbpStatus(s => ({ ...s, nextBatchDate: e.target.value || null }))}
            placeholder="e.g. September 2025"
            className="admin-input w-full"
          />
        </div>
        <button
          onClick={saveGBP}
          disabled={savingGBP}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60"
        >
          {savingGBP ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {gbpSaved ? 'Saved!' : 'Save GBP Settings'}
        </button>
      </div>

      {/* Homepage Stats */}
      <div className="glass-card rounded-2xl p-6 mb-5">
        <h3 className="text-white font-semibold text-sm mb-4">Homepage Stats</h3>
        <p className="text-white/40 text-xs mb-4">These numbers appear on the homepage hero section in real time.</p>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { key: 'projectsDelivered', label: 'Projects Delivered' },
            { key: 'countriesServed', label: 'Countries Served' },
            { key: 'buildersInProgram', label: 'Builders in Program' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-white/40 text-xs mb-1 block">{f.label}</label>
              <input
                type="number"
                min={0}
                value={(stats as any)[f.key]}
                onChange={e => setStats(s => ({ ...s, [f.key]: Number(e.target.value) }))}
                className="admin-input w-full"
              />
            </div>
          ))}
        </div>
        <button
          onClick={saveStats}
          disabled={savingStats}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/80 hover:bg-primary text-white text-sm font-semibold transition-all disabled:opacity-60"
        >
          {savingStats ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {statsSaved ? 'Saved!' : 'Save Stats'}
        </button>
      </div>

      {/* Admin Password */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-white font-semibold text-sm mb-2">Admin Account</h3>
        <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-white/80 text-sm">
            The admin panel is protected by a fixed passcode checked directly on the server — no external auth provider. To change it, edit the <strong>/api/auth/admin</strong> handler in <strong>api/index.ts</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
