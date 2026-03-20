import { apiClient } from './client';
import { Order, OrderStatus } from '../types';

export async function fetchOrders(): Promise<Order[]> {
  const response = await apiClient.get('/orders');
  return response.data.orders || [];
}

export async function createOrder({ customerId, description }: { customerId: number; description: string }): Promise<Order> {
  const response = await apiClient.post('/orders', { customerId, description });
  return response.data.order;
}

export async function updateOrderStatus({
  orderId,
  staffId,
  status
}: {
  orderId: number;
  staffId: number;
  status: OrderStatus;
}): Promise<Order> {
  const response = await apiClient.patch(`/orders/${orderId}/status`, { staffId, status });
  return response.data.order;
}
