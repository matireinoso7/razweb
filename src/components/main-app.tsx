"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { NewsGrid } from "@/components/news/news-grid";
import { FavoritesView } from "@/components/news/favorites-view";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboardModal } from "@/components/auth/user-dashboard-modal";
import { Sparkles } from "lucide-react";

export function MainApp() {
  const [currentTab, setCurrentTab] = useState<"feed" | "favorites">("feed");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      {/* Header con Controles a la derecha, Logo centrado con espaciado amplio y Tabs debajo */}
      <Header
        currentTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      {/* Hero Banner centrado y limpio con efecto blur/glassmorphism sobre el fondo tech */}
      {currentTab === "feed" && (
        <section className="relative overflow-hidden py-14 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            {/* Contenedor Flotante Glassmorphism para Título y Descripción */}
            <div className="w-full p-8 sm:p-12 rounded-3xl bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-color)] shadow-xl shadow-[var(--teal-glow)]/10 flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[var(--teal-bg)] text-[var(--teal-primary)] border border-[var(--teal-primary)]/25 mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Radar de Vanguardia en Inteligencia Artificial</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-normal text-[var(--text-primary)] max-w-3xl leading-[1.18] my-2">
                Noticias, Papers de Investigación y Novedades de IA
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-2xl font-normal">
                Información en tiempo real curada desde los principales noticieros tecnológicos (TechCrunch, The Verge, Wired), papers científicos de arXiv y publicaciones oficiales de OpenAI, Anthropic, Google DeepMind y Meta AI.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {currentTab === "feed" ? (
          <NewsGrid onOpenAuth={() => setAuthModalOpen(true)} />
        ) : (
          <FavoritesView
            onBackToFeed={() => setCurrentTab("feed")}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer con Blur Glassmorphism */}
      <footer className="mt-12 border-t border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl py-8 px-4 sm:px-6 lg:px-8 text-xs text-[var(--text-muted)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-primary)] tracking-wide">RazWeb</span>
            <span>&copy; {new Date().getFullYear()} - Portal de Noticias de Inteligencia Artificial & Tecnología</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[var(--teal-primary)] font-semibold">
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
