"use client";

import React, { useState } from "react";
import { NewsItemEntity } from "@/domain/entities/news";
import { useAuth } from "../auth/auth-context";
import {
  Bookmark,
  ExternalLink,
  Share2,
  Calendar,
  User as UserIcon,
  Check,
  Cpu,
  BookOpen,
  MessageSquare,
} from "lucide-react";

interface NewsCardProps {
  news: NewsItemEntity;
  onOpenAuth: () => void;
  onFavoriteToggled?: (newsId: string, isFav: boolean) => void;
}

export function NewsCard({ news, onOpenAuth, onFavoriteToggled }: NewsCardProps) {
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

  const getSourceBadge = () => {
    switch (news.sourceType) {
      case "AI_PAPER":
        return {
          icon: <BookOpen className="w-3 h-3" />,
          label: "Research Paper",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "X_POST":
        return {
          icon: <MessageSquare className="w-3 h-3" />,
          label: "X (Twitter) Feed",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "TECH_NEWS":
      default:
        return {
          icon: <Cpu className="w-3 h-3" />,
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
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all duration-200 hover:shadow-xl hover:border-[var(--teal-primary)]/50">
      {/* Card Header & Image */}
      <div className="relative aspect-16/9 w-full overflow-hidden bg-slate-900/10">
        <img
          src={news.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
          alt={news.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Source Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-xs bg-black/60 text-white border-white/20">
          {badge.icon}
          <span>{badge.label}</span>
        </div>

        {/* Favorite & Share Buttons */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            aria-label="Compartir enlace"
            className="p-2 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleToggleFavorite}
            disabled={toggling}
            aria-label={isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
            className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-xs ${
              isFavorite
                ? "bg-[var(--teal-primary)] text-white"
                : "bg-black/60 hover:bg-black/80 text-white"
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Source Name on Image Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-200">
          <span className="font-medium truncate max-w-[65%]">{news.sourceName}</span>
          <div className="flex items-center gap-1 text-[11px] opacity-90">
            <Calendar className="w-3 h-3" />
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <span className="inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md border border-[var(--border-color)] text-[var(--teal-primary)] bg-[var(--teal-bg)]">
            {news.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-[var(--text-primary)] line-clamp-2 leading-snug group-hover:text-[var(--teal-primary)] transition-colors">
          <a href={news.url} target="_blank" rel="noopener noreferrer">
            {news.title}
          </a>
        </h3>

        <p className="mt-2.5 text-xs text-[var(--text-secondary)] line-clamp-3 leading-relaxed">
          {news.summary}
        </p>

        {/* Card Footer */}
        <div className="mt-5 pt-3 border-t border-[var(--border-color)]/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[var(--text-muted)] truncate max-w-[60%]">
            <UserIcon className="w-3 h-3 shrink-0" />
            <span className="truncate">{news.author || news.sourceName}</span>
          </div>

          <a
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[var(--teal-primary)] font-semibold hover:underline"
          >
            <span>Leer</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
