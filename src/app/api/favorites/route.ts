import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { PrismaNewsRepository } from "@/infrastructure/repositories/prisma-news-repository";
import { z } from "zod";

const newsRepository = new PrismaNewsRepository();

const toggleFavoriteSchema = z.object({
  newsItemId: z.string().uuid("ID de noticia inválido"),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const favorites = await newsRepository.getFavorites(session.userId);
    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Error al obtener favoritos" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Debes iniciar sesión para guardar favoritos" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = toggleFavoriteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0]?.message || "Datos inválidos" },
        { status: 400 }
      );
    }

    const isFavorited = await newsRepository.toggleFavorite(
      session.userId,
      result.data.newsItemId
    );

    return NextResponse.json({
      success: true,
      isFavorited,
      message: isFavorited
        ? "Noticia agregada a tus favoritos"
        : "Noticia eliminada de tus favoritos",
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Error al modificar favoritos" },
      { status: 500 }
    );
  }
}
