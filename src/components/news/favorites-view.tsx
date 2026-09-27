"use client";

import React, { useEffect, useState, useCallback } from "react";
import { NewsItemEntity } from "@/domain/entities/news";
import { NewsCard } from "./news-card";
import { NewsDetailModal } from "./news-detail-modal";
import { Bookmark, Sparkles, Loader2, ArrowLeft } from "lucide-react";

interface FavoritesViewProps {
  onBackToFeed: () => void;
  onOpenAuth: () => void;
}

export function FavoritesView({ onBackToFeed, onOpenAuth }: FavoritesViewProps) {
  const [favorites, setFavorites] = useState<NewsItemEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<NewsItemEntity | null>(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/favorites");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data.favorites || []);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleFavoriteToggled = (newsId: string, isFav: boolean) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((item) => item.id !== newsId));
      if (selectedNews && selectedNews.id === newsId) {
        setSelectedNews(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header View con Glassmorphism */}
      <div className="flex items-center justify-between p-6 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl shadow-xl shadow-[var(--teal-glow)]/10">
        <div className="flex items-center gap-3.5">
          <button
            onClick={onBackToFeed}
            className="p-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-primary)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] transition-colors cursor-pointer"
            aria-label="Volver al feed principal"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[var(--teal-primary)] fill-[var(--teal-primary)]" />
              <span>Mis Noticias Guardadas</span>
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Colección personalizada de artículos, papers y publicaciones de IA
            </p>
          </div>
        </div>

        <span className="text-xs px-3.5 py-1.5 rounded-full bg-[var(--teal-bg)] text-[var(--teal-primary)] font-semibold border border-[var(--teal-primary)]/20">
          {favorites.length} guardadas
        </span>
      </div>

      {loading && (
        <div className="py-20 flex justify-center items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="w-5 h-5 text-[var(--teal-primary)] animate-spin" />
          <span>Cargando tus favoritos...</span>
        </div>
      )}

      {!loading && favorites.length === 0 && (
        <div className="py-20 text-center rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl shadow-xl shadow-[var(--teal-glow)]/10">
          <Bookmark className="w-12 h-12 text-[var(--teal-primary)] mx-auto mb-3 opacity-40" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            Aún no tienes noticias guardadas
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Explora el feed de noticias y presiona el ícono de marcador en las noticias o papers que quieras conservar.
          </p>
          <button
            onClick={onBackToFeed}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[var(--teal-primary)] text-white text-xs font-semibold cursor-pointer shadow-xs hover:bg-[var(--teal-dark)] transition-colors"
          >
            Explorar Feed Principal
          </button>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((news) => (
            <NewsCard
              key={news.id || news.url}
              news={news}
              onOpenAuth={onOpenAuth}
              onOpenDetail={(item) => setSelectedNews(item)}
              onFavoriteToggled={handleFavoriteToggled}
            />
          ))}
        </div>
      )}

      {/* Dynamic Expansion Modal for reading favorites */}
      <NewsDetailModal
        news={selectedNews}
        isOpen={Boolean(selectedNews)}
        onClose={() => setSelectedNews(null)}
        onOpenAuth={onOpenAuth}
        onFavoriteToggled={handleFavoriteToggled}
      />
    </div>
  );
}
