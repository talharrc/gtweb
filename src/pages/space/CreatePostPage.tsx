import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';
import { useSpaceAuth } from '../../context/SpaceAuthContext';
import { newSpacePostId, createSpacePost } from '../../services/spacePostService';
import { SPACE_CATEGORIES, SpaceCategory } from '../../types/space';
import { CATEGORY_META } from '../../components/space/CategoryIcon';

const MAX_TAGS = 5;
const MAX_LINKS = 5;

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { firebaseUser } = useSpaceAuth();

  const [category, setCategory] = useState<SpaceCategory>('tools');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linksInput, setLinksInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firebaseUser) { setError('You must be signed in to post.'); return; }
    if (!title.trim() || !body.trim()) { setError('Title and body are required.'); return; }

    const links = linksInput.split('\n').map((l) => l.trim()).filter(Boolean).slice(0, MAX_LINKS);
    const tags = tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, MAX_TAGS);

    setSubmitting(true);
    try {
      const postId = newSpacePostId();
      let imageUrl = '';

      if (imageFile) {
        const storageRef = ref(storage, `space/${postId}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      await createSpacePost(postId, {
        authorId: firebaseUser.uid,
        category,
        title: title.trim(),
        body: body.trim(),
        links,
        tags,
        imageUrl,
      });

      navigate(`/space/post/${postId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create post.');
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-card p-6 sm:p-8">
      <h1 className="text-white font-bold text-2xl mb-6">Create a post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-space-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 block">Category</label>
          <div className="flex flex-wrap gap-2">
            {SPACE_CATEGORIES.map((cat) => {
              const meta = CATEGORY_META[cat];
              const Icon = meta.icon;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    category === cat ? 'btn-primary-space text-white' : 'bg-white/5 border border-white/10 text-space-text-secondary hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" /> {meta.label}
                </button>
              );
            })}
          </div>
        </div>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="admin-input"
          maxLength={140}
        />

        <textarea
          placeholder="Share the details…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          className="admin-input resize-none"
        />

        <textarea
          placeholder="Links (one per line, optional)"
          value={linksInput}
          onChange={(e) => setLinksInput(e.target.value)}
          rows={2}
          className="admin-input resize-none"
        />

        <input
          type="text"
          placeholder="Tags, comma separated (optional, max 5)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          className="admin-input"
        />

        <div>
          <label className="text-space-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 block">
            Image / screenshot (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-white text-sm"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary-space py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50">
          {submitting ? 'Posting…' : 'Post to GalaxaSpace'}
        </button>
      </form>
    </div>
  );
}
