import { NewsItemEntity, SourceType } from "../entities/news";

export interface INewsProvider {
  readonly name: string;
  readonly sourceType: SourceType;
  fetchLatestNews(): Promise<NewsItemEntity[]>;
}

export interface INewsRepository {
  saveMany(items: NewsItemEntity[]): Promise<number>;
  getPaginated(params: {
    page: number;
    limit: number;
    sourceType?: SourceType;
    category?: string;
    search?: string;
    userId?: string;
  }): Promise<{ items: NewsItemEntity[]; total: number; hasMore: boolean }>;
  getFavorites(userId: string): Promise<NewsItemEntity[]>;
  toggleFavorite(userId: string, newsItemId: string): Promise<boolean>;
}
