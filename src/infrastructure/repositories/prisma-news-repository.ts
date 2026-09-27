import { NewsItemEntity, SourceType } from "@/domain/entities/news";
import { INewsProvider, INewsRepository } from "@/domain/interfaces/news-provider";
import { prisma } from "@/lib/prisma";

export class PrismaNewsRepository implements INewsRepository {
  async saveMany(items: NewsItemEntity[]): Promise<number> {
    let savedCount = 0;
    for (const item of items) {
      try {
        await prisma.newsItem.upsert({
          where: { url: item.url },
          update: {
            title: item.title,
            summary: item.summary,
            content: item.content,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            category: item.category,
            imageUrl: item.imageUrl,
            author: item.author,
            publishedAt: item.publishedAt,
          },
          create: {
            title: item.title,
            summary: item.summary,
            content: item.content,
            url: item.url,
            sourceName: item.sourceName,
            sourceType: item.sourceType,
            category: item.category,
            imageUrl: item.imageUrl,
            author: item.author,
            publishedAt: item.publishedAt,
          },
        });
        savedCount++;
      } catch (err) {
        console.error("Error upserting news item:", err);
      }
    }
    return savedCount;
  }

  async getPaginated(params: {
    page: number;
    limit: number;
    sourceType?: SourceType;
    category?: string;
    search?: string;
    userId?: string;
  }): Promise<{ items: NewsItemEntity[]; total: number; hasMore: boolean }> {
    const { page, limit, sourceType, category, search, userId } = params;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (sourceType && sourceType !== ("ALL" as unknown as SourceType)) {
      where.sourceType = sourceType;
    }

    if (category && category !== "All") {
      where.category = category;
    }

    if (search && search.trim().length > 0) {
      where.OR = [
        { title: { contains: search } },
        { summary: { contains: search } },
        { sourceName: { contains: search } },
      ];
    }

    const [total, records] = await Promise.all([
      prisma.newsItem.count({ where }),
      prisma.newsItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: "desc" },
        include: userId
          ? {
              favorites: {
                where: { userId },
                select: { id: true },
              },
            }
          : undefined,
      }),
    ]);

    const items: NewsItemEntity[] = records.map((r: any) => ({
      id: r.id,
      title: r.title,
      summary: r.summary,
      content: r.content || undefined,
      url: r.url,
      sourceName: r.sourceName,
      sourceType: r.sourceType as SourceType,
      category: r.category,
      imageUrl: r.imageUrl || undefined,
      author: r.author || undefined,
      publishedAt: r.publishedAt,
      createdAt: r.createdAt,
      isFavorite: userId && r.favorites && r.favorites.length > 0 ? true : false,
    }));

    return {
      items,
      total,
      hasMore: skip + items.length < total,
    };
  }

  async getById(id: string, userId?: string): Promise<NewsItemEntity | null> {
    const record = await prisma.newsItem.findUnique({
      where: { id },
      include: userId
        ? {
            favorites: {
              where: { userId },
              select: { id: true },
            },
          }
        : undefined,
    });

    if (!record) return null;

    type RecordWithFavorites = typeof record & { favorites?: { id: string }[] };
    const withFavorites = record as RecordWithFavorites;

    return {
      id: record.id,
      title: record.title,
      summary: record.summary,
      content: record.content || undefined,
      url: record.url,
      sourceName: record.sourceName,
      sourceType: record.sourceType as SourceType,
      category: record.category,
      imageUrl: record.imageUrl || undefined,
      author: record.author || undefined,
      publishedAt: record.publishedAt,
      createdAt: record.createdAt,
      isFavorite:
        Boolean(userId) &&
        Array.isArray(withFavorites.favorites) &&
        withFavorites.favorites.length > 0,
    };
  }

  async getFavorites(userId: string): Promise<NewsItemEntity[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { newsItem: true },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((fav: any) => ({
      id: fav.newsItem.id,
      title: fav.newsItem.title,
      summary: fav.newsItem.summary,
      content: fav.newsItem.content || undefined,
      url: fav.newsItem.url,
      sourceName: fav.newsItem.sourceName,
      sourceType: fav.newsItem.sourceType as SourceType,
      category: fav.newsItem.category,
      imageUrl: fav.newsItem.imageUrl || undefined,
      author: fav.newsItem.author || undefined,
      publishedAt: fav.newsItem.publishedAt,
      createdAt: fav.newsItem.createdAt,
      isFavorite: true,
    }));
  }

  async toggleFavorite(userId: string, newsItemId: string): Promise<boolean> {
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_newsItemId: {
          userId,
          newsItemId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: { id: existing.id },
      });
      return false; // Removed from favorites
    } else {
      await prisma.favorite.create({
        data: {
          userId,
          newsItemId,
        },
      });
      return true; // Added to favorites
    }
  }
}

export class NewsIngestionService {
  constructor(
    private providers: INewsProvider[],
    private repository: INewsRepository
  ) {}

  async runIngestion(): Promise<{ totalFetched: number; totalSaved: number }> {
    let totalFetched = 0;
    const allItems: NewsItemEntity[] = [];

    for (const provider of this.providers) {
      try {
        const items = await provider.fetchLatestNews();
        totalFetched += items.length;
        allItems.push(...items);
      } catch (err) {
        console.error(`Error in provider ${provider.name}:`, err);
      }
    }

    const totalSaved = await this.repository.saveMany(allItems);
    return { totalFetched, totalSaved };
  }
}
