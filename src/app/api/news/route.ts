import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaNewsRepository, NewsIngestionService } from "@/infrastructure/repositories/prisma-news-repository";
import { RssNewsProvider } from "@/infrastructure/providers/rss-provider";
import { ArxivPapersProvider } from "@/infrastructure/providers/arxiv-provider";
import { SocialXProvider } from "@/infrastructure/providers/x-provider";
import { SourceType } from "@/domain/entities/news";
import { prisma } from "@/lib/prisma";

const newsRepository = new PrismaNewsRepository();
const ingestionService = new NewsIngestionService(
  [new RssNewsProvider(), new ArxivPapersProvider(), new SocialXProvider()],
  newsRepository
);

// Automatic auto-seed flag
let isSeeded = false;

async function ensureInitialData() {
  if (isSeeded) return;
  const count = await prisma.newsItem.count();
  if (count === 0) {
    await ingestionService.runIngestion();
  }
  isSeeded = true;
}

export async function GET(req: NextRequest) {
  try {
    await ensureInitialData();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(30, Math.max(1, parseInt(searchParams.get("limit") || "9", 10)));
    const sourceType = (searchParams.get("sourceType") as SourceType) || undefined;
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const session = await getSession();

    const data = await newsRepository.getPaginated({
      page,
      limit,
      sourceType,
      category,
      search,
      userId: session?.userId,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error al cargar las noticias", items: [], total: 0, hasMore: false },
      { status: 500 }
    );
  }
}

// Ingestion trigger endpoint (protected or manual sync)
export async function POST() {
  try {
    const result = await ingestionService.runIngestion();
    return NextResponse.json({
      success: true,
      message: "Ingesta de noticias completada con éxito",
      ...result,
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: "Error durante la ingesta de noticias" },
      { status: 500 }
    );
  }
}
