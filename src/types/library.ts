export interface LibraryItem {
  libraryItemId: number;
  gameId: number;
  title: string;
  slug: string;
  coverImageUrl: string | null;
  playtimeMinutes: number;
  lastPlayedAt: string | null;
  acquiredAt: string;
}
