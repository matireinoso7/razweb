"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { NewsItemEntity, SourceType } from "@/domain/entities/news";
import { NewsCard } from "./news-card";
import { FeaturedStory } from "./featured-story";
import { NewsToolbar } from "./news-toolbar";
import { Loader2, AlertCircle, Sparkles } from "lucide-react";

interface NewsGridProps {
  onOpenAuth: () => void;
  initialSourceType?: SourceType | "ALL";
}

export function NewsGrid({ onOpenAuth, initialSourceType = "ALL" }: NewsGridProps) {
  const [items, setItems] = useState<NewsItemEntity[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [sourceType, setSourceType] = useState<SourceType | "ALL">(initialSourceType);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const observerTarget = useRef<HTMLDivElement | null>(null);

  const fetchNews = useCallback(
    async (pageToLoad: number, append: boolean = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: pageToLoad.toString(),
          limit: "9",
        });

        if (sourceType !== "ALL") params.append("sourceType", sourceType);
        if (category !== "All") params.append("category", category);
        if (search.trim()) params.append("search", search.trim());

        const res = await fetch(`/api/news?${params.toString()}`);
        if (!res.ok) throw new Error("Error al consultar las noticias.");

        const data = await res.json();

        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setHasMore(data.hasMore);
        setPage(pageToLoad);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Error al cargar noticias";
        setError(message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sourceType, category, search]
  );

  useEffect(() => {
    fetchNews(1, false);
  }, [fetchNews]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          fetchNews(page + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [hasMore, loading, loadingMore, page, fetchNews]);

  const handleSyncLatest = async () => {
    setSyncing(true);
    try {
      await fetch("/api/news", { method: "POST" });
      await fetchNews(1, false);
    } catch (err) {
      console.error("Sync error:", err);
    } finally {
      setSyncing(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleFavoriteToggled = (newsId: string, isFav: boolean) => {
    setItems((prev) =>
      prev.map((item) => (item.id === newsId ? { ...item, isFavorite: isFav } : item))
    );
  };

  const featuredItem = items.length > 0 && !search.trim() ? items[0] : null;
  const gridItems =
    featuredItem && items.length > 1 ? items.slice(1) : featuredItem ? [] : items;

  return (
    <div className="space-y-2">
      {featuredItem && !loading && <FeaturedStory news={featuredItem} />}

      <NewsToolbar
        sourceType={sourceType}
        onSourceTypeChange={setSourceType}
        category={category}
        onCategoryChange={setCategory}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={handleSearchSubmit}
        syncing={syncing}
        onSync={handleSyncLatest}
      />

      {error && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchNews(1, false)}
            className="px-3.5 py-1.5 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 press-scale cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {loading && items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 space-y-4 animate-pulse"
            >
              <div className="aspect-16/10 w-full bg-[var(--bg-card-hover)] rounded-2xl" />
              <div className="h-5 bg-[var(--bg-card-hover)] rounded-md w-3/4" />
              <div className="space-y-2">
                <div className="h-3.5 bg-[var(--bg-card-hover)] rounded-md w-full" />
                <div className="h-3.5 bg-[var(--bg-card-hover)] rounded-md w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="py-20 text-center rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] animate-fade-slide">
          <Sparkles className="w-12 h-12 text-[var(--teal-primary)] mx-auto mb-3 opacity-60" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">No se encontraron noticias</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Prueba ajustando los filtros o buscando otro término.
          </p>
          <button
            type="button"
            onClick={() => {
              setCategory("All");
              setSourceType("ALL");
              setSearch("");
              setSearchInput("");
            }}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[var(--teal-primary)] text-black font-bold text-xs btn-magnetic cursor-pointer"
          >
            Restablecer filtros
          </button>
        </div>
      )}

      {gridItems.length > 0 && (
        <>
          {featuredItem && (
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-muted)] mb-4">
              Más noticias
            </h3>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridItems.map((news, index) => (
              <div
                key={`${news.id || news.url}-${index}`}
                className="animate-fade-slide"
                style={{ animationDelay: `${Math.min(index * 35, 300)}ms` }}
              >
                <NewsCard
                  news={news}
                  onOpenAuth={onOpenAuth}
                  onFavoriteToggled={handleFavoriteToggled}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && featuredItem && gridItems.length === 0 && items.length === 1 && (
        <p className="text-center text-sm text-[var(--text-muted)] py-8">
          Solo hay un resultado con estos filtros. Desplázate para cargar más al cambiar filtros.
        </p>
      )}

      <div ref={observerTarget} className="py-6 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="w-5 h-5 text-[var(--teal-primary)] animate-spin" />
            <span>Cargando más noticias…</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <div className="text-xs text-[var(--text-muted)] font-medium">
            Fin del feed por ahora.
          </div>
        )}
      </div>
    </div>
  );
}
