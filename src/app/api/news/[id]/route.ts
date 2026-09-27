import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaNewsRepository } from "@/infrastructure/repositories/prisma-news-repository";

const newsRepository = new PrismaNewsRepository();

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getSession();
    const item = await newsRepository.getById(id, session?.userId);

    if (!item) {
      return NextResponse.json({ error: "Noticia no encontrada" }, { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching news item:", error);
    return NextResponse.json({ error: "Error al cargar la noticia" }, { status: 500 });
  }
}
