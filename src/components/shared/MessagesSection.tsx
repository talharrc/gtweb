import { useState, useEffect, useRef, FormEvent } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Send, Loader2 } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { sendMessage, GTMessage } from '../../services/messageService';

interface MessagesSectionProps {
  projectId: string | null;
}

interface BubbleProps { msg: GTMessage; myUid: string; key?: string; }
function MessageBubble({ msg, myUid }: BubbleProps) {
  const isMe = msg.senderUid === myUid;
  const time = msg.createdAt
    ? new Date(msg.createdAt.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[75%] ${isMe ? 'order-last' : ''}`}>
        {!isMe && (
          <p className="text-white/40 text-[10px] font-mono mb-1 px-1">
            {msg.senderName} · {msg.senderRole}
          </p>
        )}
        <div className={`rounded-2xl px-4 py-2.5 text-sm ${
          isMe
            ? 'bg-primary/25 border border-primary/30 text-white rounded-br-sm'
            : 'bg-white/5 border border-white/10 text-white/80 rounded-bl-sm'
        }`}>
          {msg.body}
        </div>
        <p className={`text-white/25 text-[10px] mt-1 ${isMe ? 'text-right pr-1' : 'pl-1'}`}>{time}</p>
      </div>
    </div>
  );
}

export default function MessagesSection({ projectId }: MessagesSectionProps) {
  const { firebaseUser, userProfile, role } = useAuth();
  const [messages, setMessages] = useState<GTMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const uid = firebaseUser?.uid ?? '';
  const displayName = firebaseUser?.displayName ?? userProfile?.displayName ?? 'User';

  useEffect(() => {
    if (!projectId) { setLoading(false); return; }

    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'asc'),
    );

    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() } as GTMessage)));
      setLoading(false);
    }, () => setLoading(false));

    return () => unsub();
  }, [projectId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !projectId || !uid) return;
    setSending(true);
    try {
      await sendMessage(projectId, uid, displayName, role as any, body);
      setBody('');
    } finally {
      setSending(false);
    }
  };

  if (!projectId) {
    return (
      <div className="text-center py-12 text-white/30 text-sm">
        No project loaded. Contact GalaxaTech.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <div className="mb-4">
        <h2 className="text-white font-bold text-2xl">Messages</h2>
        <p className="text-white/40 text-sm">Project thread with GalaxaTech</p>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto glass-card rounded-2xl p-4 mb-4 min-h-0">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-white/30 text-sm text-center py-8">
            No messages yet. Send the first one below.
          </p>
        ) : (
          messages.map((m: GTMessage) => {
            const msgUid: string = uid;
            return <MessageBubble key={m.id} msg={m} myUid={msgUid} />;
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Type a message…"
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary/40"
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e as any);
            }
          }}
        />
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="px-4 py-2.5 rounded-xl bg-primary/80 hover:bg-primary text-white transition-all disabled:opacity-50 flex-shrink-0"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
