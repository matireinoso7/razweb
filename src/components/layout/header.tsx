"use client";

import React from "react";
import { useTheme } from "../theme/theme-provider";
import { useAuth } from "../auth/auth-context";
import { LiveDateTime } from "./live-datetime";
import { Sun, Moon, Sparkles, LogIn } from "lucide-react";

interface HeaderProps {
  onGoHome: () => void;
  onOpenAuth: () => void;
  onOpenDashboard: () => void;
}

export function Header({ onGoHome, onOpenAuth, onOpenDashboard }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="relative flex items-center justify-between min-h-[52px] gap-3">
          <div className="hidden lg:block w-48 shrink-0 pointer-events-none" aria-hidden />

          <div className="flex-1 lg:flex-initial flex items-center justify-center min-w-0">
            <button
              type="button"
              onClick={onGoHome}
              className="flex items-center gap-3 sm:gap-4 px-3 py-2 rounded-2xl hover:bg-[var(--bg-card-hover)] press-scale transition-all cursor-pointer group select-none"
            >
              <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[var(--teal-dark)] via-[var(--teal-primary)] to-[var(--teal-light)] text-black font-bold shadow-md shadow-[var(--teal-glow)] transition-transform duration-200 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-black" />
              </div>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                <span className="text-xl sm:text-2xl font-black tracking-wider text-[var(--text-primary)] transition-colors duration-150 group-hover:text-[var(--teal-primary)]">
                  Raz<span className="text-[var(--teal-primary)] group-hover:text-[var(--text-primary)]">Web</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-widest bg-[var(--teal-bg)] text-[var(--teal-primary)] border border-[var(--teal-primary)]/20">
                  AI & Tech
                </span>
              </div>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 sm:gap-3 z-10 lg:w-48 shrink-0">
            <LiveDateTime />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              className="p-2.5 min-h-[44px] min-w-[44px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-[var(--teal-primary)] press-scale transition-all cursor-pointer shadow-xs"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-emerald-400" />
              ) : (
                <Moon className="w-4 h-4 text-[var(--teal-primary)]" />
              )}
            </button>

            {!loading && user ? (
              <button
                type="button"
                onClick={onOpenDashboard}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 min-h-[44px] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:border-[var(--teal-primary)] press-scale transition-all cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[var(--teal-bg)] text-[var(--teal-primary)] font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline-block text-xs font-semibold text-[var(--text-primary)] max-w-[90px] truncate">
                  {user.name}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-2 min-h-[44px] rounded-2xl bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] text-black font-bold text-xs btn-magnetic cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline-block">Ingresar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
