export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELED' | 'REFUNDED';

export interface OrderItem {
  gameId: number;
  title: string;
  coverImageUrl: string | null;
  unitPriceCents: number;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalCents: number;
  paymentMethod: string | null;
  createdAt: string;
  paidAt: string | null;
  items: OrderItem[];
}
