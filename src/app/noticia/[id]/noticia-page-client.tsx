"use client";

import React, { useState } from "react";
import { NewsItemEntity } from "@/domain/entities/news";
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { NewsArticleView } from "@/components/news/news-article-view";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserDashboardModal } from "@/components/auth/user-dashboard-modal";
import { useRouter } from "next/navigation";

interface NoticiaPageClientProps {
  news: NewsItemEntity;
}

export function NoticiaPageClient({ news }: NoticiaPageClientProps) {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <Header
        onGoHome={() => router.push("/")}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenDashboard={() => setDashboardOpen(true)}
      />
      <main className="flex-1 app-body border-t border-[var(--border-color)]">
        <NewsArticleView
          key={news.id}
          news={news}
          onOpenAuth={() => setAuthModalOpen(true)}
        />
      </main>
      <SiteFooter />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <UserDashboardModal
        isOpen={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        onNavigateFavorites={() => router.push("/")}
      />
    </div>
  );
}
