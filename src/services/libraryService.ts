import { api } from './api';
import type { LibraryItem } from '@/types/library';

export const libraryService = {
  async getLibrary(): Promise<LibraryItem[]> {
    const { data } = await api.get<LibraryItem[]>('/library');
    return data;
  },

  async recordPlaySession(gameId: number, minutes = 30): Promise<LibraryItem> {
    const { data } = await api.post<LibraryItem>(`/library/${gameId}/play`, { minutes });
    return data;
  },
};
