import { api } from './api';
import type { Page } from '@/types/common';
import type {
  AdminGameDetail,
  AdminGameSummary,
  AdminUserCreatePayload,
  AdminUserSummary,
  AdminUserUpdatePayload,
  GameDeletionResult,
  GameUpsertPayload,
} from '@/types/admin';

export interface AdminListParams {
  search?: string;
  page?: number;
  size?: number;
}

export const adminService = {
  // ---- Usuários ----
  async listUsers(params: AdminListParams = {}): Promise<Page<AdminUserSummary>> {
    const { data } = await api.get<Page<AdminUserSummary>>('/admin/users', { params });
    return data;
  },

  async getUser(id: number): Promise<AdminUserSummary> {
    const { data } = await api.get<AdminUserSummary>(`/admin/users/${id}`);
    return data;
  },

  async createUser(payload: AdminUserCreatePayload): Promise<AdminUserSummary> {
    const { data } = await api.post<AdminUserSummary>('/admin/users', payload);
    return data;
  },

  async updateUser(id: number, payload: AdminUserUpdatePayload): Promise<AdminUserSummary> {
    const { data } = await api.put<AdminUserSummary>(`/admin/users/${id}`, payload);
    return data;
  },

  async resetUserPassword(id: number, newPassword: string): Promise<void> {
    await api.put(`/admin/users/${id}/password`, { newPassword });
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  // ---- Jogos ----
  async listGames(params: AdminListParams = {}): Promise<Page<AdminGameSummary>> {
    const { data } = await api.get<Page<AdminGameSummary>>('/admin/games', { params });
    return data;
  },

  async getGame(id: number): Promise<AdminGameDetail> {
    const { data } = await api.get<AdminGameDetail>(`/admin/games/${id}`);
    return data;
  },

  async createGame(payload: GameUpsertPayload): Promise<AdminGameDetail> {
    const { data } = await api.post<AdminGameDetail>('/admin/games', payload);
    return data;
  },

  async updateGame(id: number, payload: GameUpsertPayload): Promise<AdminGameDetail> {
    const { data } = await api.put<AdminGameDetail>(`/admin/games/${id}`, payload);
    return data;
  },

  async setGameActive(id: number, active: boolean): Promise<AdminGameSummary> {
    const { data } = await api.patch<AdminGameSummary>(`/admin/games/${id}/active`, { active });
    return data;
  },

  async deleteGame(id: number): Promise<GameDeletionResult> {
    const { data } = await api.delete<GameDeletionResult>(`/admin/games/${id}`);
    return data;
  },
};
