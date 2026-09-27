import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { PrismaNewsRepository } from "@/infrastructure/repositories/prisma-news-repository";
import { NoticiaPageClient } from "./noticia-page-client";

const newsRepository = new PrismaNewsRepository();

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await newsRepository.getById(id);
  if (!item) {
    return { title: "Noticia no encontrada — RazWeb" };
  }
  return {
    title: `${item.title} — RazWeb`,
    description: item.summary,
  };
}

export default async function NoticiaPage({ params }: PageProps) {
  const { id } = await params;
  const session = await getSession();
  const news = await newsRepository.getById(id, session?.userId);

  if (!news) {
    notFound();
  }

  return <NoticiaPageClient news={news} />;
}
