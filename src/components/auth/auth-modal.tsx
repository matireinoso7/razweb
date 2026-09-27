"use client";

import React, { useState } from "react";
import { useAuth } from "./auth-context";
import { X, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { refreshUser } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload = mode === "login" ? { email, password } : { name, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al procesar la solicitud");
      }

      await refreshUser();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-modal-backdrop">
      <div className="relative w-full max-w-md p-7 bg-[var(--bg-card)] backdrop-blur-2xl border border-[var(--border-color)] rounded-3xl shadow-2xl animate-modal-content">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] press-scale transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--teal-bg)] text-[var(--teal-primary)] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
            {mode === "login" ? "Iniciar Sesión" : "Crear una Cuenta"}
          </h2>
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            {mode === "login"
              ? "Accede a tus noticias guardadas y panel personalizado"
              : "Únete a la comunidad de tecnología e inteligencia artificial"}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 text-sm text-red-600 bg-red-500/10 border border-red-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal-primary)] focus:ring-1 focus:ring-[var(--teal-primary)] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal-primary)] focus:ring-1 focus:ring-[var(--teal-primary)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--teal-primary)] focus:ring-1 focus:ring-[var(--teal-primary)] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm text-black bg-[var(--teal-primary)] hover:bg-[var(--teal-dark)] btn-magnetic transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[var(--text-secondary)]">
          {mode === "login" ? (
            <p>
              ¿No tienes una cuenta?{" "}
              <button
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="font-semibold text-[var(--teal-primary)] hover:underline cursor-pointer"
              >
                Regístrate gratis
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-semibold text-[var(--teal-primary)] hover:underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
