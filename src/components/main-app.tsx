"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { AppBody } from "@/components/layout/app-body";
import { SiteFooter } from "@/components/layout/site-footer";
import { NewsGrid } from "@/components/news/news-grid";
import { FavoritesView } from "@/components/news/favorites-view";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboardModal } from "@/components/auth/user-dashboard-modal";

export function MainApp() {
  const [currentTab, setCurrentTab] = useState<"feed" | "favorites">("feed");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header
        onGoHome={() => setCurrentTab("feed")}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />

      <AppBody
        currentTab={currentTab}
        onChangeTab={(tab) => setCurrentTab(tab)}
        onOpenAuth={() => setAuthModalOpen(true)}
      >
        {currentTab === "feed" && (
          <p className="text-center sm:text-left text-sm text-[var(--text-secondary)] mb-6 max-w-2xl">
            Radar en vivo de IA, investigación y tecnología — curado desde medios, arXiv y canales oficiales.
          </p>
        )}

        {currentTab === "feed" ? (
          <NewsGrid onOpenAuth={() => setAuthModalOpen(true)} />
        ) : (
          <FavoritesView
            onBackToFeed={() => setCurrentTab("feed")}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </AppBody>

      <SiteFooter />

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserDashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onNavigateFavorites={() => setCurrentTab("favorites")}
      />
    </div>
  );
}
