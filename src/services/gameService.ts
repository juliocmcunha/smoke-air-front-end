import { api } from './api';
import type { Page } from '@/types/common';
import type { Category, GameDetail, GameSummary, Review } from '@/types/game';

export interface GameSearchParams {
  search?: string;
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export const gameService = {
  async search(params: GameSearchParams = {}): Promise<Page<GameSummary>> {
    const { data } = await api.get<Page<GameSummary>>('/games', { params });
    return data;
  },

  async featured(): Promise<GameSummary[]> {
    const { data } = await api.get<GameSummary[]>('/games/featured');
    return data;
  },

  async getBySlug(slug: string): Promise<GameDetail> {
    const { data } = await api.get<GameDetail>(`/games/${slug}`);
    return data;
  },

  async listCategories(): Promise<Category[]> {
    const { data } = await api.get<Category[]>('/categories');
    return data;
  },

  async listReviews(gameId: number): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/games/${gameId}/reviews`);
    return data;
  },

  async createReview(gameId: number, rating: number, comment: string): Promise<Review> {
    const { data } = await api.post<Review>(`/games/${gameId}/reviews`, { rating, comment });
    return data;
  },
};
