"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NewsItemEntity } from "@/domain/entities/news";
import { navigateWithTransition } from "@/lib/navigate-with-transition";
import { Calendar, ArrowRight } from "lucide-react";

interface FeaturedStoryProps {
  news: NewsItemEntity;
}

export function FeaturedStory({ news }: FeaturedStoryProps) {
  const router = useRouter();

  const dateFormatted = new Date(news.publishedAt).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });

  const openArticle = () => {
    if (news.id) {
      navigateWithTransition(router, `/noticia/${news.id}`);
    } else {
      window.open(news.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <article
      className="group mb-8 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-lg shadow-[var(--teal-glow)]/5 cursor-pointer craft-card animate-fade-slide"
      onClick={openArticle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openArticle();
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Portada: ${news.title}`}
    >
      <div className="lg:col-span-5 relative aspect-[16/10] lg:aspect-auto lg:min-h-[280px] overflow-hidden bg-slate-900/20">
        <img
          src={
            news.imageUrl ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"
          }
          alt=""
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-black/10 lg:to-black/30 pointer-events-none" />
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[var(--teal-primary)] text-black">
          En portada
        </span>
      </div>

      <div className="lg:col-span-7 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
          <span className="px-2.5 py-0.5 rounded-md font-semibold bg-[var(--teal-bg)] text-[var(--teal-primary)] border border-[var(--teal-primary)]/20">
            {news.category}
          </span>
          <span className="font-medium text-[var(--text-secondary)]">{news.sourceName}</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateFormatted}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-primary)] leading-tight tracking-tight group-hover:text-[var(--teal-primary)] transition-colors duration-200">
          {news.title}
        </h2>

        <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed line-clamp-3 font-[family-name:var(--font-reading)]">
          {news.summary}
        </p>

        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-[var(--teal-primary)] group-hover:translate-x-1 transition-transform duration-200">
          <span>Leer artículo completo</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </article>
  );
}
