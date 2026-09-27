export type SourceType = "TECH_NEWS" | "AI_PAPER" | "X_POST";

export interface NewsItemEntity {
  id?: string;
  title: string;
  summary: string;
  content?: string;
  url: string;
  sourceName: string;
  sourceType: SourceType;
  category: string;
  imageUrl?: string;
  author?: string;
  publishedAt: Date;
  createdAt?: Date;
  isFavorite?: boolean;
}

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}
