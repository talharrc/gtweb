import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceDailyTheme } from '../types/space';

export function useSpaceDailyTheme() {
  const [theme, setTheme] = useState<SpaceDailyTheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'space_settings', 'dailyTheme'),
      (snap) => {
        setTheme(snap.exists() ? (snap.data() as SpaceDailyTheme) : null);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  return { theme, loading };
}
