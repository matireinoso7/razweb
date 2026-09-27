"use client";

import React from "react";
import { SourceType } from "@/domain/entities/news";
import { RefreshCw, SlidersHorizontal, Search } from "lucide-react";

const CATEGORIES = [
  "All",
  "AI Frontier & Models",
  "AI & Startups",
  "Research Papers",
  "Tech & Ethics",
  "Scientific Discovery & Gemini",
  "Open Weights & Llama",
];

interface NewsToolbarProps {
  sourceType: SourceType | "ALL";
  onSourceTypeChange: (type: SourceType | "ALL") => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  syncing: boolean;
  onSync: () => void;
}

export function NewsToolbar({
  sourceType,
  onSourceTypeChange,
  category,
  onCategoryChange,
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  syncing,
  onSync,
}: NewsToolbarProps) {
  const sourceBtn = (type: SourceType | "ALL", label: string) => (
    <button
      key={type}
      type="button"
      onClick={() => onSourceTypeChange(type)}
      className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold press-scale transition-all cursor-pointer whitespace-nowrap ${
        sourceType === type
          ? "bg-[var(--teal-primary)] text-black font-bold shadow-xs"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-3 mb-8 pb-6 border-b border-[var(--border-color)]">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          {sourceBtn("ALL", "Todas")}
          {sourceBtn("TECH_NEWS", "Tech")}
          {sourceBtn("AI_PAPER", "arXiv")}
          {sourceBtn("X_POST", "Empresas AI")}
        </div>

        <div className="flex items-center gap-2 w-full lg:w-auto">
          <form onSubmit={onSearchSubmit} className="relative flex-1 lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Buscar noticias…"
              className="w-full pl-10 pr-3 py-2.5 min-h-[44px] text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--teal-primary)] focus:ring-1 focus:ring-[var(--teal-primary)]"
            />
          </form>
          <button
            type="button"
            onClick={onSync}
            disabled={syncing}
            title="Sincronizar fuentes"
            className="p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--teal-primary)] btn-magnetic cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <div className="flex items-center gap-1 text-[var(--text-muted)] shrink-0 font-semibold mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Tema</span>
        </div>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={`px-3.5 py-2 min-h-[36px] rounded-full text-xs shrink-0 chip-hover cursor-pointer ${
              category === cat
                ? "bg-[var(--teal-primary)] text-black font-bold shadow-xs"
                : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-color)]"
            }`}
          >
            {cat === "All" ? "Todos" : cat}
          </button>
        ))}
      </div>
    </div>
  );
}
