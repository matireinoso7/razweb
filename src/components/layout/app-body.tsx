"use client";

import React from "react";
import { useAuth } from "../auth/auth-context";
import { Bookmark } from "lucide-react";

interface AppBodyProps {
  currentTab: "feed" | "favorites";
  onChangeTab: (tab: "feed" | "favorites") => void;
  onOpenAuth: () => void;
  children: React.ReactNode;
}

export function AppBody({
  currentTab,
  onChangeTab,
  onOpenAuth,
  children,
}: AppBodyProps) {
  const { user } = useAuth();

  return (
    <div className="app-body flex-1 w-full border-t border-[var(--border-color)] bg-[var(--bg-primary)]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <nav
          aria-label="Secciones principales"
          className="mb-6 flex items-center justify-center sm:justify-start"
        >
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[var(--bg-card)]/90 backdrop-blur-xl border border-[var(--border-color)] shadow-xs">
            <button
              type="button"
              onClick={() => onChangeTab("feed")}
              className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold press-scale transition-all cursor-pointer ${
                currentTab === "feed"
                  ? "bg-[var(--teal-primary)] text-black font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              Principal
            </button>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  onOpenAuth();
                } else {
                  onChangeTab("favorites");
                }
              }}
              className={`min-h-[44px] px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold press-scale transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === "favorites"
                  ? "bg-[var(--teal-primary)] text-black font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${currentTab === "favorites" ? "fill-black" : ""}`} />
              <span>Favoritos</span>
              {user && user._count?.favorites ? (
                <span
                  className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    currentTab === "favorites"
                      ? "bg-black text-white"
                      : "bg-[var(--teal-bg)] text-[var(--teal-primary)]"
                  }`}
                >
                  {user._count.favorites}
                </span>
              ) : null}
            </button>
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
