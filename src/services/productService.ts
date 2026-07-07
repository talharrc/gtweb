import { Product } from '../types';

async function parseJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data;
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt'>): Promise<string> {
  const res = await fetch('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await parseJsonOrThrow(res);
  return json.id;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updates),
  });
  await parseJsonOrThrow(res);
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE', credentials: 'include' });
  await parseJsonOrThrow(res);
}

export async function setProductActive(id: string, isActive: boolean): Promise<void> {
  const res = await fetch(`/api/admin/products/${id}/active`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ isActive }),
  });
  await parseJsonOrThrow(res);
}
