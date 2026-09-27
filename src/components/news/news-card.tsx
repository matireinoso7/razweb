"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NewsItemEntity } from "@/domain/entities/news";
import { navigateWithTransition } from "@/lib/navigate-with-transition";
import { useAuth } from "../auth/auth-context";
import {
  Bookmark,
  Share2,
  Calendar,
  User as UserIcon,
  Check,
  Cpu,
  BookOpen,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

interface NewsCardProps {
  news: NewsItemEntity;
  onOpenAuth: () => void;
  onFavoriteToggled?: (newsId: string, isFav: boolean) => void;
}

export function NewsCard({ news, onOpenAuth, onFavoriteToggled }: NewsCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(news.isFavorite || false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      onOpenAuth();
      return;
    }

    if (!news.id) return;

    setToggling(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsItemId: news.id }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorited);
        if (onFavoriteToggled && news.id) {
          onFavoriteToggled(news.id, data.isFavorited);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(news.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCardClick = () => {
    if (news.id) {
      navigateWithTransition(router, `/noticia/${news.id}`);
    } else {
      window.open(news.url, "_blank", "noopener,noreferrer");
    }
  };

  const getSourceBadge = () => {
    switch (news.sourceType) {
      case "AI_PAPER":
        return {
          icon: <BookOpen className="w-3.5 h-3.5" />,
          label: "Research Paper",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "X_POST":
        return {
          icon: <MessageSquare className="w-3.5 h-3.5" />,
          label: "X (Twitter) Feed",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "TECH_NEWS":
      default:
        return {
          icon: <Cpu className="w-3.5 h-3.5" />,
          label: "Tech Media",
          bg: "bg-[var(--teal-bg)] text-[var(--teal-primary)] border-[var(--teal-primary)]/20",
        };
    }
  };

  const badge = getSourceBadge();
  const dateFormatted = new Date(news.publishedAt).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl craft-card cursor-pointer select-none"
    >
      {/* Card Header & Image (Emil Kowalski / Impeccable: image is passive, container carries feedback) */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-900/10">
        <img
          src={news.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 var(--ease-out) group-hover:scale-103"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Source Badge with subtle border glow */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-md bg-black/65 text-white border-white/20 transition-transform duration-200 group-hover:translate-x-0.5">
          {badge.icon}
          <span>{badge.label}</span>
        </div>

        {/* Favorite & Share Buttons with press-scale feedback */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          <button
            onClick={handleShare}
            aria-label="Compartir enlace"
            className="p-2 rounded-full bg-black/65 hover:bg-black/90 text-white backdrop-blur-md press-scale transition-all cursor-pointer shadow-md hover:scale-110"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleToggleFavorite}
            disabled={toggling}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className={`p-2 rounded-full backdrop-blur-md press-scale transition-all cursor-pointer shadow-md hover:scale-110 ${
              isFavorite
                ? "bg-[var(--teal-primary)] text-black font-bold"
                : "bg-black/65 hover:bg-black/90 text-white"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? "fill-black" : ""}`} />
          </button>
        </div>

        {/* Source Name on Image Bottom */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-200">
          <span className="font-semibold truncate max-w-[65%] tracking-wide">{news.sourceName}</span>
          <div className="flex items-center gap-1 text-[11px] opacity-90">
            <Calendar className="w-3 h-3" />
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Card Content with refined typography and micro-interactions */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2.5">
          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-md border border-[var(--border-color)] text-[var(--teal-primary)] bg-[var(--teal-bg)] transition-colors duration-150 group-hover:border-[var(--teal-primary)]/40">
            {news.category}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] line-clamp-2 leading-snug transition-colors duration-150 group-hover:text-[var(--teal-primary)]">
          {news.title}
        </h3>

        <p className="mt-3 text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {news.summary}
        </p>

        {/* Card Footer with animated directional arrow on hover */}
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]/70 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] truncate max-w-[55%]">
            <UserIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{news.author || news.sourceName}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[var(--teal-primary)] font-bold transition-all duration-200 group-hover:translate-x-1.5">
            <span>Leer completo</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-115" />
          </div>
        </div>
      </div>
    </article>
  );
}
