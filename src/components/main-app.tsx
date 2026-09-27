"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { NewsGrid } from "@/components/news/news-grid";
import { FavoritesView } from "@/components/news/favorites-view";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboardModal } from "@/components/auth/user-dashboard-modal";
import { Sparkles, Terminal, Shield, Zap, ArrowUpRight } from "lucide-react";

export function MainApp() {
  const [currentTab, setCurrentTab] = useState<"feed" | "favorites">("feed");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      {/* Hero Banner only on Feed */}
      {currentTab === "feed" && (
        <section className="relative overflow-hidden border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--teal-bg)]/30 to-transparent py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--teal-bg)] text-[var(--teal-primary)] border border-[var(--teal-primary)]/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Radar de Vanguardia en Inteligencia Artificial</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">
                Noticias, Papers de Investigación y Novedades de IA
              </h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
                Información en tiempo real curada desde los principales noticieros tecnológicos (TechCrunch, The Verge, Wired), papers científicos de arXiv y publicaciones oficiales de OpenAI, Anthropic, Google DeepMind y Meta AI.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--teal-bg)] text-[var(--teal-primary)]">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Ingesta Multi-Fuente</div>
                  <div className="text-[11px] text-[var(--text-muted)]">RSS + arXiv + X API Feeds</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">Arquitectura SOLID</div>
                  <div className="text-[11px] text-[var(--text-muted)]">Next.js + Prisma + JWT</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === "feed" ? (
          <NewsGrid onOpenAuth={() => setAuthModalOpen(true)} />
        ) : (
          <FavoritesView
            onBackToFeed={() => setCurrentTab("feed")}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)] py-8 px-4 sm:px-6 lg:px-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-primary)]">RazWeb</span>
            <span>&copy; {new Date().getFullYear()} - Portal de Noticias de Inteligencia Artificial & Tecnología</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[var(--teal-primary)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--teal-primary)] animate-pulse" />
              Sistema de Ingesta Activo
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <UserDashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onNavigateFavorites={() => setCurrentTab("favorites")}
      />
    </div>
  );
}
