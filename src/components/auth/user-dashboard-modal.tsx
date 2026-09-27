"use client";

import React, { useState } from "react";
import { useAuth } from "./auth-context";
import { User, Bookmark, LogOut, X, Calendar, ShieldCheck, Mail } from "lucide-react";

interface UserDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateFavorites: () => void;
}

export function UserDashboardModal({ isOpen, onClose, onNavigateFavorites }: UserDashboardModalProps) {
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  if (!isOpen || !user) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          aria-label="Cerrar panel"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--teal-bg)] text-[var(--teal-primary)] font-bold text-xl border border-[var(--teal-primary)]/20 shadow-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">{user.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <Mail className="w-3.5 h-3.5" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[11px] text-[var(--teal-primary)] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Cuenta Activa - JWT Verificado</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Guardados</span>
              <Bookmark className="w-4 h-4 text-[var(--teal-primary)]" />
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">
              {user._count?.favorites ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
              <span>Tipo de Membresía</span>
              <Calendar className="w-4 h-4 text-[var(--teal-primary)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              Lector Pro AI
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <button
            onClick={() => {
              onClose();
              onNavigateFavorites();
            }}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-[var(--border-color)] hover:border-[var(--teal-primary)] text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4 text-[var(--teal-primary)]" />
              <span>Ver mis Noticias Favoritas</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--teal-bg)] text-[var(--teal-primary)] font-semibold">
              {user._count?.favorites ?? 0}
            </span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full py-2.5 px-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOut ? "Cerrando sesión..." : "Cerrar Sesión"}</span>
        </button>
      </div>
    </div>
  );
}
