import { useState } from 'react';
import { X } from 'lucide-react';
import { useSpaceAuth } from '../../context/SpaceAuthContext';
import { createSpaceReport } from '../../services/spaceReportService';
import { ReportReason, ReportTargetType } from '../../types/space';

const REASONS: { value: ReportReason; label: string }[] = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate' },
  { value: 'off-topic', label: 'Off-topic' },
  { value: 'other', label: 'Other' },
];

interface ReportModalProps {
  targetType: ReportTargetType;
  targetId: string;
  onClose: () => void;
}

export default function ReportModal({ targetType, targetId, onClose }: ReportModalProps) {
  const { firebaseUser } = useSpaceAuth();
  const [reason, setReason] = useState<ReportReason>('spam');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!firebaseUser) return;
    setSubmitting(true);
    await createSpaceReport({ targetType, targetId, reporterId: firebaseUser.uid, reason });
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="space-card p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Report {targetType}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {submitted ? (
          <p className="text-emerald-400 text-sm">Thanks — our moderators will take a look.</p>
        ) : (
          <>
            <div className="flex flex-col gap-2 mb-5">
              {REASONS.map((r) => (
                <label key={r.value} className="flex items-center gap-2 text-sm text-space-text-secondary cursor-pointer">
                  <input type="radio" name="reason" checked={reason === r.value} onChange={() => setReason(r.value)} />
                  {r.label}
                </label>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full btn-primary-space py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-50"
            >
              {submitting ? 'Submitting…' : 'Submit report'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
