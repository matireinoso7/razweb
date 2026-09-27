"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { NewsItemEntity, SourceType } from "@/domain/entities/news";
import { NewsCard } from "./news-card";
import { Loader2, RefreshCw, AlertCircle, Sparkles, SlidersHorizontal, Search } from "lucide-react";

interface NewsGridProps {
  onOpenAuth: () => void;
  initialSourceType?: SourceType | "ALL";
}

const CATEGORIES = [
  "All",
  "AI Frontier & Models",
  "AI & Startups",
  "Research Papers",
  "Tech & Ethics",
  "Scientific Discovery & Gemini",
  "Open Weights & Llama",
];

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
      } catch (err: any) {
        setError(err.message || "Error al cargar noticias");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sourceType, category, search]
  );

  // Initial load or filter change
  useEffect(() => {
    fetchNews(1, false);
  }, [fetchNews]);

  // Infinite Scroll via IntersectionObserver
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

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Source Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
            <button
              onClick={() => setSourceType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceType === "ALL"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Todas las Fuentes
            </button>
            <button
              onClick={() => setSourceType("TECH_NEWS")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceType === "TECH_NEWS"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Noticieros Tech
            </button>
            <button
              onClick={() => setSourceType("AI_PAPER")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceType === "AI_PAPER"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Papers arXiv
            </button>
            <button
              onClick={() => setSourceType("X_POST")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                sourceType === "X_POST"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              Empresas AI en X
            </button>
          </div>

          {/* Sync Button & Search Bar */}
          <div className="flex items-center gap-2">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Buscar noticias..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal-primary)]"
              />
            </form>

            <button
              onClick={handleSyncLatest}
              disabled={syncing}
              title="Actualizar y sincronizar fuentes"
              className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--teal-primary)] transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <div className="flex items-center gap-1 text-[var(--text-muted)] shrink-0 font-medium mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtro:</span>
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs shrink-0 transition-colors cursor-pointer ${
                category === cat
                  ? "bg-[var(--teal-primary)] text-white font-medium shadow-xs"
                  : "bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
              }`}
            >
              {cat === "All" ? "Todos los temas" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => fetchNews(1, false)}
            className="px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && items.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 space-y-4 animate-pulse"
            >
              <div className="aspect-16/9 w-full bg-[var(--bg-card-hover)] rounded-xl" />
              <div className="h-4 bg-[var(--bg-card-hover)] rounded-md w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-[var(--bg-card-hover)] rounded-md w-full" />
                <div className="h-3 bg-[var(--bg-card-hover)] rounded-md w-5/6" />
              </div>
              <div className="h-8 bg-[var(--bg-card-hover)] rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && !error && (
        <div className="py-16 text-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
          <Sparkles className="w-12 h-12 text-[var(--teal-primary)] mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No se encontraron noticias</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-sm mx-auto">
            Prueba ajustando los filtros de categoría o buscando otro término.
          </p>
          <button
            onClick={() => {
              setCategory("All");
              setSourceType("ALL");
              setSearch("");
              setSearchInput("");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-[var(--teal-primary)] text-white text-xs font-semibold cursor-pointer"
          >
            Restablecer Filtros
          </button>
        </div>
      )}

      {/* Card Grid */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((news, index) => (
            <NewsCard
              key={`${news.id || news.url}-${index}`}
              news={news}
              onOpenAuth={onOpenAuth}
            />
          ))}
        </div>
      )}

      {/* Infinite Scroll Trigger & Loader */}
      <div ref={observerTarget} className="py-6 flex justify-center">
        {loadingMore && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
            <Loader2 className="w-5 h-5 text-[var(--teal-primary)] animate-spin" />
            <span>Cargando más noticias...</span>
          </div>
        )}
        {!hasMore && items.length > 0 && (
          <div className="text-xs text-[var(--text-muted)] font-medium">
            Has llegado al final de las noticias por ahora.
          </div>
        )}
      </div>
    </div>
  );
}
