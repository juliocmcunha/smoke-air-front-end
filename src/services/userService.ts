import { api } from './api';
import { tokenStorage } from './tokenStorage';
import type { User } from '@/types/user';

export interface UpdateProfilePayload {
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
}

export const userService = {
  async getProfile(): Promise<User> {
    const { data } = await api.get<User>('/users/me');
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await api.put<User>('/users/me', payload);
    tokenStorage.setUser(data);
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.put('/users/me/password', { currentPassword, newPassword });
  },
};
