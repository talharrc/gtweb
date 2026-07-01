import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../types';
import { mockDb } from '../lib/mockData';
import { useAuth } from '../context/AuthContext';

export function useStoreProducts() {
  const { isDemo, setIsDemo } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (isDemo) {
      setProducts(mockDb.getProducts().filter(p => p.isActive));
      setLoadingProducts(false);
      return;
    }

    let active = true;
    const fallbackTimer = setTimeout(() => {
      if (active) {
        console.warn('Firestore load timed out for store products, falling back to Demo Mode');
        setIsDemo(true);
        setLoadingProducts(false);
      }
    }, 2500);

    const handleError = (error: unknown) => {
      console.warn('Firestore error loading store products, falling back to Demo Mode:', error);
      if (active) {
        setIsDemo(true);
        setLoadingProducts(false);
      }
    };

    const unsub = onSnapshot(collection(db, 'products'), snap => {
      if (!active) return;
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
      setProducts(all.filter(p => p.isActive));
      setLoadingProducts(false);
    }, handleError);

    return () => {
      active = false;
      clearTimeout(fallbackTimer);
      unsub();
    };
  }, [isDemo]);

  return { products, loadingProducts };
}
