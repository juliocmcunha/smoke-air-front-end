import type { Category } from './game';
import type { Role } from './user';

export type UserStatus = 'ACTIVE' | 'BLOCKED';

export interface AdminUserSummary {
  id: number;
  username: string;
  displayName: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface AdminUserCreatePayload {
  username: string;
  displayName: string;
  email: string;
  password: string;
  role: Role;
}

export interface AdminUserUpdatePayload {
  displayName: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface AdminGameSummary {
  id: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  priceCents: number;
  finalPriceCents: number;
  discountPercent: number;
  featured: boolean;
  active: boolean;
  averageRating: number;
}

export interface AdminGameDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  developer: string | null;
  publisher: string | null;
  releaseDate: string | null;
  priceCents: number;
  discountPercent: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  trailerUrl: string | null;
  featured: boolean;
  active: boolean;
  categories: Category[];
  screenshots: string[];
}

export interface GameUpsertPayload {
  title: string;
  shortDescription: string;
  description: string;
  developer: string;
  publisher: string;
  releaseDate: string | null;
  priceCents: number;
  discountPercent: number;
  coverImageUrl: string;
  bannerImageUrl: string;
  trailerUrl: string;
  featured: boolean;
  active: boolean;
  categorySlugs: string[];
  screenshotUrls: string[];
}

export interface GameDeletionResult {
  hardDeleted: boolean;
  message: string;
}
