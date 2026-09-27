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
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)]/80 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top Row: Left Controls (Date/Time, Theme, User Profile) + Centered Brand/Logo */}
        <div className="relative flex items-center justify-between min-h-[48px]">
          {/* Left: Fecha y hora, Selección Modo Claro/Oscuro y Perfil */}
          <div className="flex items-center gap-2 sm:gap-3 z-10">
            <LiveDateTime />

            {/* Selector de modo claro / oscuro */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="p-2 sm:p-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--teal-primary)] transition-all cursor-pointer shadow-xs"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--teal-primary)]" />
              )}
            </button>

            {/* Perfil de usuario / Login */}
            {!loading && user ? (
              <button
                onClick={onOpenDashboard}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--teal-primary)] transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--teal-bg)] text-[var(--teal-primary)] font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-[var(--text-primary)] max-w-[100px] truncate">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block">Ingresar</span>
              </button>
            )}
          </div>

          {/* Center: Nombre y Logo de la web centrados */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              onClick={() => onChangeTab("feed")}
              className="pointer-events-auto flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-[var(--teal-dark)] via-[var(--teal-primary)] to-[var(--teal-light)] text-black font-bold shadow-md shadow-[var(--teal-glow)] transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-[var(--text-primary)]">
                  Raz<span className="text-[var(--teal-primary)]">Web</span>
                </span>
                <span className="ml-2 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider bg-[var(--teal-bg)] text-[var(--teal-primary)] border border-[var(--teal-primary)]/20">
                  AI & Tech
                </span>
              </div>
            </div>
          </div>

          {/* Right Spacer placeholder for balanced flex */}
          <div className="hidden sm:block w-24 pointer-events-none" />
        </div>

        {/* Bottom Row: Títulos de Navegación (Principal / Favoritos) por debajo del título de la web */}
        <div className="mt-3 flex items-center justify-center">
          <nav className="inline-flex items-center p-1 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-xs">
            <button
              onClick={() => onChangeTab("feed")}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                currentTab === "feed"
                  ? "bg-[var(--teal-primary)] text-black font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              Principal
            </button>
            <button
              onClick={() => {
                if (!user) {
                  onOpenAuth();
                } else {
                  onChangeTab("favorites");
                }
              }}
              className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentTab === "favorites"
                  ? "bg-[var(--teal-primary)] text-black font-bold shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${currentTab === "favorites" ? "fill-black" : ""}`} />
              <span>Favoritos</span>
              {user && user._count?.favorites ? (
                <span
                  className={`ml-1 text-[11px] px-2 py-0.2 rounded-full font-bold ${
                    currentTab === "favorites"
                      ? "bg-black text-white"
                      : "bg-[var(--teal-bg)] text-[var(--teal-primary)]"
                  }`}
                >
                  {user._count.favorites}
                </span>
              ) : null}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
