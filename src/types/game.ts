export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface GameSummary {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  coverImageUrl: string | null;
  priceCents: number;
  finalPriceCents: number;
  discountPercent: number;
  averageRating: number;
  featured: boolean;
}

export interface GameDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  developer: string | null;
  publisher: string | null;
  releaseDate: string | null;
  priceCents: number;
  finalPriceCents: number;
  discountPercent: number;
  coverImageUrl: string | null;
  bannerImageUrl: string | null;
  trailerUrl: string | null;
  averageRating: number;
  categories: Category[];
  screenshots: string[];
  ownedByCurrentUser: boolean;
}

export interface Review {
  id: number;
  username: string;
  userAvatarUrl: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
}
