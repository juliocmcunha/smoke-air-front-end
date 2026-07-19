import { createContext, useCallback, useMemo, useState, type ReactNode } from 'react';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/services/tokenStorage';
import type { LoginPayload, RegisterPayload } from '@/types/auth';
import type { User } from '@/types/user';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => tokenStorage.getUser());

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload);
    setUserState(response.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await authService.register(payload);
    setUserState(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUserState(null);
  }, []);

  const setUser = useCallback((updatedUser: User) => {
    tokenStorage.setUser(updatedUser);
    setUserState(updatedUser);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: !!user, login, register, logout, setUser }),
    [user, login, register, logout, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
