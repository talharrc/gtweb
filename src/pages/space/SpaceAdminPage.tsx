import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  collection, query, where, orderBy, onSnapshot, getCountFromServer, Timestamp,
} from 'firebase/firestore';
import { Star, Pin, Check, X } from 'lucide-react';
import { db } from '../../lib/firebase';
import { SpacePost, SpaceReport } from '../../types/space';
import { resolveSpaceReport } from '../../services/spaceReportService';
import { deleteSpacePost, setPostFeatured, setPostPinned } from '../../services/spacePostService';

function useStats() {
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, postsThisWeek: 0 });

  useEffect(() => {
    (async () => {
      const usersSnap = await getCountFromServer(collection(db, 'space_users'));
      const postsSnap = await getCountFromServer(collection(db, 'space_posts'));
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const weekSnap = await getCountFromServer(
        query(collection(db, 'space_posts'), where('createdAt', '>=', Timestamp.fromDate(weekAgo))),
      );
      setStats({
        totalUsers: usersSnap.data().count,
        totalPosts: postsSnap.data().count,
        postsThisWeek: weekSnap.data().count,
      });
    })();
  }, []);

  return stats;
}

function usePendingReports() {
  const [reports, setReports] = useState<SpaceReport[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'space_reports'), where('status', '==', 'pending'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setReports(snap.docs.map((d) => d.data() as SpaceReport)));
    return unsub;
  }, []);

  return reports;
}

function useAllPosts() {
  const [posts, setPosts] = useState<SpacePost[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'space_posts'), where('status', '==', 'active'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setPosts(snap.docs.map((d) => d.data() as SpacePost)));
    return unsub;
  }, []);

  return posts;
}

export default function SpaceAdminPage() {
  const stats = useStats();
  const reports = usePendingReports();
  const posts = useAllPosts();

  const handleRemove = async (report: SpaceReport) => {
    if (report.targetType === 'post') await deleteSpacePost(report.targetId);
    await resolveSpaceReport(report.id, 'resolved');
  };

  const handleDismiss = async (report: SpaceReport) => {
    await resolveSpaceReport(report.id, 'dismissed');
  };

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-white font-bold text-2xl">GalaxaSpace Admin</h1>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total users', value: stats.totalUsers },
          { label: 'Total posts', value: stats.totalPosts },
          { label: 'Posts this week', value: stats.postsThisWeek },
        ].map((tile) => (
          <div key={tile.label} className="space-card p-4 text-center">
            <p className="text-white font-bold text-2xl">{tile.value}</p>
            <p className="text-space-text-muted text-xs mt-1">{tile.label}</p>
          </div>
        ))}
      </div>

      <section>
        <h2 className="text-white font-bold text-lg mb-3">Pending reports ({reports.length})</h2>
        {reports.length === 0 ? (
          <p className="text-space-text-muted text-sm">No open reports.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <div key={report.id} className="space-card p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold capitalize">{report.targetType} · {report.reason}</p>
                  <p className="text-space-text-muted text-xs truncate">Target: {report.targetId}</p>
                </div>
                <button
                  onClick={() => handleRemove(report)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold"
                >
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
                <button
                  onClick={() => handleDismiss(report)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-space-text-secondary text-xs font-semibold"
                >
                  <Check className="w-3.5 h-3.5" /> Dismiss
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-3">All posts</h2>
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div key={post.id} className="space-card p-4 flex items-center gap-3">
              <Link to={`/space/post/${post.id}`} className="flex-1 min-w-0 text-white text-sm font-semibold truncate hover:text-[#22D3EE]">
                {post.title}
              </Link>
              <button
                onClick={() => setPostFeatured(post.id, !post.isFeatured)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  post.isFeatured ? 'space-upvote-active' : 'bg-white/5 border border-white/10 text-space-text-secondary'
                }`}
              >
                <Star className="w-3.5 h-3.5" /> Featured
              </button>
              <button
                onClick={() => setPostPinned(post.id, !post.isPinned)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
                  post.isPinned ? 'space-upvote-active' : 'bg-white/5 border border-white/10 text-space-text-secondary'
                }`}
              >
                <Pin className="w-3.5 h-3.5" /> Pinned
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
