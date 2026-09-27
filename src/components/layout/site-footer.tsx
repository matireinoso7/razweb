"use client";

import React from "react";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-[var(--border-color)] bg-[var(--bg-card)] backdrop-blur-2xl py-8 px-4 sm:px-6 lg:px-8 text-xs text-[var(--text-muted)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="font-bold text-[var(--text-primary)] tracking-wide">RazWeb</span>
          <span>&copy; {new Date().getFullYear()} — Portal de IA y tecnología</span>
        </div>
        <span className="flex items-center gap-1.5 text-[var(--teal-primary)] font-semibold">
          <span className="w-2 h-2 rounded-full bg-[var(--teal-primary)] animate-pulse" />
          Sistema de ingesta activo
        </span>
      </div>
    </footer>
  );
}
