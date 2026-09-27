"use client";

import React from "react";
import { useTheme } from "../theme/theme-provider";
import { useAuth } from "../auth/auth-context";
import { LiveDateTime } from "./live-datetime";
import { Sun, Moon, Sparkles, Bookmark, User as UserIcon, LogIn } from "lucide-react";

interface HeaderProps {
  currentTab: "feed" | "favorites";
  onChangeTab: (tab: "feed" | "favorites") => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

export function Header({ currentTab, onChangeTab, onOpenAuth, onOpenDashboard }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => onChangeTab("feed")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--teal-primary)] to-[var(--teal-light)] text-white shadow-md shadow-[var(--teal-glow)] transition-transform group-hover:scale-105">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-[var(--text-primary)]">
                Raz<span className="text-[var(--teal-primary)]">Web</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-1.5 py-0.5 text-[9px] font-bold rounded-sm uppercase tracking-wider bg-[var(--teal-bg)] text-[var(--teal-primary)]">
                AI & Tech
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => onChangeTab("feed")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentTab === "feed"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              Feed Principal
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth();
                } else {
                  onChangeTab("favorites");
                }
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === "favorites"
                  ? "bg-[var(--teal-primary)] text-white shadow-xs"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Favoritos</span>
              {user && user._count?.favorites ? (
                <span className="ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full bg-[var(--teal-bg)] text-[var(--teal-primary)] font-bold">
                  {user._count.favorites}
                </span>
              ) : null}
            </button>
          </nav>
        </div>

        {/* Live Date & Time Center/Right */}
        <LiveDateTime />

        {/* Actions: Theme Toggle & User Auth */}
        <div className="flex items-center gap-2.5">
          {/* Light/Dark Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="p-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--teal-primary)] transition-all cursor-pointer shadow-xs"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[var(--teal-primary)]" />
            )}
          </button>

          {/* User Button */}
          {!loading && user ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--teal-primary)] transition-all cursor-pointer shadow-xs"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--teal-bg)] text-[var(--teal-primary)] font-bold text-xs">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[var(--text-primary)] max-w-[100px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Ingresar</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
