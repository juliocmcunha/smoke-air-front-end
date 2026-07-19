export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  displayName: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  role: Role;
  memberSince: string;
}
