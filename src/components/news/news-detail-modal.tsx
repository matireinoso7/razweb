"use client";

import React, { useState, useEffect } from "react";
import { NewsItemEntity } from "@/domain/entities/news";
import { useAuth } from "../auth/auth-context";
import {
  X,
  Bookmark,
  ExternalLink,
  Share2,
  Calendar,
  User as UserIcon,
  Check,
  Cpu,
  BookOpen,
  MessageSquare,
  Sparkles,
  Link2,
} from "lucide-react";

interface NewsDetailModalProps {
  news: NewsItemEntity | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onFavoriteToggled?: (newsId: string, isFav: boolean) => void;
}

export function NewsDetailModal({
  news,
  isOpen,
  onClose,
  onOpenAuth,
  onFavoriteToggled,
}: NewsDetailModalProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (news) {
      setIsFavorite(news.isFavorite || false);
    }
  }, [news]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !news) return null;

  const handleToggleFavorite = async () => {
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

  const handleShare = () => {
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
          icon: <BookOpen className="w-4 h-4" />,
          label: "Investigación Científica (arXiv)",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
        };
      case "X_POST":
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          label: "Canal Oficial en X (Twitter)",
          bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
        };
      case "TECH_NEWS":
      default:
        return {
          icon: <Cpu className="w-4 h-4" />,
          label: "Noticiero Tecnológico",
          bg: "bg-[var(--teal-bg)] text-[var(--teal-primary)] border-[var(--teal-primary)]/20",
        };
    }
  };

  const badge = getSourceBadge();
  const dateFormatted = new Date(news.publishedAt).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const fullContent = news.content || news.summary;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-modal-backdrop overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl my-auto max-h-[90vh] flex flex-col bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl shadow-2xl overflow-hidden animate-modal-content transition-all"
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar artículo"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md press-scale transition-all cursor-pointer shadow-md hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Media */}
        <div className="relative aspect-21/9 w-full overflow-hidden bg-slate-950 shrink-0">
          <img
            src={news.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] via-black/40 to-black/20" />

          {/* Badges and metadata over media */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border shadow-xs bg-black/60 text-white border-white/20">
              {badge.icon}
              <span>{badge.label}</span>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md border bg-black/50 text-slate-200 border-white/10">
              {news.category}
            </span>
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-1.5 font-medium">
              <UserIcon className="w-3.5 h-3.5 text-[var(--teal-light)]" />
              <span>{news.author || news.sourceName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{dateFormatted}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Title with Generous Font Size */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tight">
            {news.title}
          </h1>

          {/* Lead Summary Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--teal-bg)]/40 border border-[var(--teal-primary)]/20 text-[var(--text-primary)] text-base sm:text-lg font-medium leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-[var(--teal-primary)] shrink-0 mt-0.5" />
              <p>{news.summary}</p>
            </div>
          </div>

          {/* Full Extracted Article Body */}
          <div className="space-y-4 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed font-normal whitespace-pre-line">
            {fullContent}
          </div>

          {/* Dedicated Source Attribution Box at the bottom */}
          <div className="pt-6 mt-8 border-t border-[var(--border-color)]">
            <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--teal-primary)]">
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Fuente Original Consultada</span>
                </div>
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  {news.sourceName}
                </div>
                <p className="text-xs text-[var(--text-muted)] truncate max-w-md">
                  {news.url}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] press-scale transition-all cursor-pointer shadow-xs"
                  title="Copiar enlace"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>

                <button
                  onClick={handleToggleFavorite}
                  disabled={toggling}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border press-scale transition-all cursor-pointer shadow-xs ${
                    isFavorite
                      ? "bg-[var(--teal-primary)] text-black font-bold border-[var(--teal-primary)]"
                      : "border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-primary)]"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-black" : ""}`} />
                  <span>{isFavorite ? "Guardado" : "Guardar"}</span>
                </button>

                <a
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] text-black font-bold text-xs btn-magnetic shadow-xs"
                >
                  <span>Visitar Fuente</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
