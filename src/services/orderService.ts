import { api } from './api';
import type { Order } from '@/types/order';

export const orderService = {
  async checkout(gameIds: number[], paymentMethod = 'SIMULADO'): Promise<Order> {
    const { data } = await api.post<Order>('/orders/checkout', { gameIds, paymentMethod });
    return data;
  },

  async getOrders(): Promise<Order[]> {
    const { data } = await api.get<Order[]>('/orders');
    return data;
  },
};
