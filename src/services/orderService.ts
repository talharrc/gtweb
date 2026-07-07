import { Order, OrderStatus, DeliveredCredential, OrderItem } from '../types';

async function parseJsonOrThrow(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `Request failed (${res.status})`);
  return data;
}

export async function createOrder(data: {
  customerName: string;
  customerPhone?: string;
  items: Pick<OrderItem, 'productId' | 'planId' | 'quantity'>[];
  paymentMethod: Order['paymentMethod'];
  senderNumber: string;
  trxId: string;
}): Promise<string> {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });
  const json = await parseJsonOrThrow(res);
  return json.id;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  extra?: { adminNote?: string }
): Promise<void> {
  const res = await fetch(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status, adminNote: extra?.adminNote }),
  });
  await parseJsonOrThrow(res);
}

export async function deliverCredentials(id: string, credentials: DeliveredCredential[]): Promise<void> {
  const res = await fetch(`/api/admin/orders/${id}/credentials`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ credentials }),
  });
  await parseJsonOrThrow(res);
}

export async function getOrdersByCustomer(): Promise<Order[]> {
  const res = await fetch('/api/orders/mine', { credentials: 'include' });
  const json = await parseJsonOrThrow(res);
  return json.orders;
}

export async function getAllOrders(): Promise<Order[]> {
  const res = await fetch('/api/admin/orders', { credentials: 'include' });
  const json = await parseJsonOrThrow(res);
  return json.orders;
}
