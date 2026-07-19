import type { User } from '@/types/user';

/**
 * Pequeno wrapper sobre o localStorage. Centralizado aqui para que, se um
 * dia vocês trocarem a estratégia de armazenamento (ex.: cookies httpOnly
 * setados pelo back-end), só precise mexer neste arquivo.
 */
const ACCESS_TOKEN_KEY = 'gamestore.accessToken';
const REFRESH_TOKEN_KEY = 'gamestore.refreshToken';
const USER_KEY = 'gamestore.user';

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },
  setSession(accessToken: string, refreshToken: string, user: User) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  setAccessToken(accessToken: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  },
  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
