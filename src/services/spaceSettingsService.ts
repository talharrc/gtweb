import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SpaceDailyTheme } from '../types/space';

// Read-only from the client — space_settings is written exclusively by the
// scheduled Cloud Function via firebase-admin (see firestore.rules).
export async function getDailyTheme(): Promise<SpaceDailyTheme | null> {
  const snap = await getDoc(doc(db, 'space_settings', 'dailyTheme'));
  return snap.exists() ? (snap.data() as SpaceDailyTheme) : null;
}
