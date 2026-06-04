import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Payment } from '../types';

export async function recordPayment(data: Omit<Payment, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, 'payments'), data);
  return ref.id;
}

export async function updatePayment(id: string, updates: Partial<Payment>) {
  await updateDoc(doc(db, 'payments', id), updates as any);
}

/** Derived builder eligibility — pure function, no Firestore write */
export function calcBuilderEligibility(p: Payment) {
  const builderShareAmount = p.projectValue * (p.builderSharePercent / 100);
  const builderEligible = p.projectValue > 0
    ? (p.clientPaidAmount / p.projectValue) * builderShareAmount
    : 0;
  const builderDue = builderEligible - p.builderPaidAmount;
  const locked = builderShareAmount - builderEligible;
  return { builderShareAmount, builderEligible, builderDue, locked };
}
