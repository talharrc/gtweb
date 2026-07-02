import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Star } from 'lucide-react';
import { SpacePost } from '../../types/space';
import { CATEGORY_META } from './CategoryIcon';

export default function FeaturedCarousel({ posts }: { posts: SpacePost[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (posts.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % posts.length), 6000);
    return () => clearInterval(timer);
  }, [posts.length]);

  if (posts.length === 0) return null;
  const post = posts[index % posts.length];

  return (
    <div className="relative space-card overflow-hidden mb-6 p-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="relative"
        >
          {post.imageUrl && (
            <img src={post.imageUrl} alt="" className="w-full h-48 sm:h-64 object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#22D3EE] mb-2">
              <Star className="w-3 h-3" /> Featured · {CATEGORY_META[post.category].label}
            </span>
            <Link to={`/space/post/${post.id}`}>
              <h3 className="text-white font-bold text-xl sm:text-2xl leading-tight hover:text-space-gradient transition-colors">
                {post.title}
              </h3>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {posts.length > 1 && (
        <div className="absolute top-3 right-3 flex gap-1.5">
          {posts.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setIndex(i)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-[#22D3EE] w-4' : 'bg-white/30'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
