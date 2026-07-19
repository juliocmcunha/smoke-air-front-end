import { api } from './api';
import type { GameSummary } from '@/types/game';

export const wishlistService = {
  async getWishlist(): Promise<GameSummary[]> {
    const { data } = await api.get<GameSummary[]>('/wishlist');
    return data;
  },

  async add(gameId: number): Promise<void> {
    await api.post(`/wishlist/${gameId}`);
  },

  async remove(gameId: number): Promise<void> {
    await api.delete(`/wishlist/${gameId}`);
  },
};
