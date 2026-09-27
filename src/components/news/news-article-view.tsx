"use client";

import React, { useLayoutEffect, useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
  Link2,
} from "lucide-react";

interface NewsArticleViewProps {
  news: NewsItemEntity;
  onOpenAuth: () => void;
}

export function NewsArticleView({ news: initialNews, onOpenAuth }: NewsArticleViewProps) {
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(initialNews.isFavorite || false);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [initialNews.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!initialNews.id) return;

    setToggling(true);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newsItemId: initialNews.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setIsFavorite(data.isFavorited);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setToggling(false);
    }
  };

  const handleShare = () => {
    const url =
      typeof window !== "undefined" && initialNews.id
        ? `${window.location.origin}/noticia/${initialNews.id}`
        : initialNews.url;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getSourceBadge = () => {
    switch (initialNews.sourceType) {
      case "AI_PAPER":
        return {
          icon: <BookOpen className="w-4 h-4" />,
          label: "Investigación (arXiv)",
        };
      case "X_POST":
        return {
          icon: <MessageSquare className="w-4 h-4" />,
          label: "Canal oficial en X",
        };
      case "TECH_NEWS":
      default:
        return {
          icon: <Cpu className="w-4 h-4" />,
          label: "Noticiero tecnológico",
        };
    }
  };

  const badge = getSourceBadge();
  const dateFormatted = new Date(initialNews.publishedAt).toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const bodyText = initialNews.content || initialNews.summary;
  const showLead =
    initialNews.content &&
    initialNews.summary &&
    initialNews.content.trim() !== initialNews.summary.trim();

  return (
    <article className="article-enter min-h-[60vh] pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--teal-primary)] press-scale transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al feed
        </Link>
      </div>

      <header className="relative w-full max-h-[min(50vh,520px)] min-h-[240px] overflow-hidden bg-slate-950">
        <img
          src={
            initialNews.imageUrl ||
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80"
          }
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-black/50 to-black/30" />
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-10">
        <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-primary)]">
            {badge.icon}
            {badge.label}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[var(--teal-bg)] text-[var(--teal-primary)] font-semibold border border-[var(--teal-primary)]/20">
            {initialNews.category}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-[var(--text-primary)] leading-[1.12] tracking-tight">
          {initialNews.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--text-muted)] border-b border-[var(--border-color)] pb-6">
          <span className="flex items-center gap-1.5">
            <UserIcon className="w-4 h-4 text-[var(--teal-primary)]" />
            {initialNews.author || initialNews.sourceName}
          </span>
          <span className="flex items-center gap-1.5 capitalize">
            <Calendar className="w-4 h-4" />
            {dateFormatted}
          </span>
        </div>

        {showLead && (
          <p className="prose-reading prose-lead mt-8 text-xl sm:text-[1.35rem] text-[var(--text-primary)] font-medium leading-relaxed">
            {initialNews.summary}
          </p>
        )}

        <div className="prose-reading mt-8 space-y-5 whitespace-pre-line">
          {bodyText}
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-color)]">
          <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--teal-primary)] mb-2">
              <Link2 className="w-3.5 h-3.5" />
              Fuente original
            </div>
            <p className="font-semibold text-[var(--text-primary)]">{initialNews.sourceName}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 break-all">{initialNews.url}</p>
            <a
              href={initialNews.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] text-black font-bold text-sm btn-magnetic"
            >
              Leer en {initialNews.sourceName}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-30 p-3 sm:p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)]/95 backdrop-blur-xl safe-area-pb">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 sm:flex-none p-3 min-h-[48px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] press-scale"
            aria-label="Compartir"
          >
            {copied ? <Check className="w-5 h-5 mx-auto text-emerald-500" /> : <Share2 className="w-5 h-5 mx-auto" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={toggling}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 min-h-[48px] rounded-xl text-sm font-semibold border press-scale ${
              isFavorite
                ? "bg-[var(--teal-primary)] text-black border-[var(--teal-primary)]"
                : "border-[var(--border-color)] bg-[var(--bg-primary)]"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? "fill-black" : ""}`} />
            <span className="hidden sm:inline">{isFavorite ? "Guardado" : "Guardar"}</span>
          </button>
          <a
            href={initialNews.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[2] flex items-center justify-center gap-2 px-4 min-h-[48px] rounded-xl bg-[var(--teal-primary)] text-black font-bold text-sm btn-magnetic"
          >
            Fuente
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
