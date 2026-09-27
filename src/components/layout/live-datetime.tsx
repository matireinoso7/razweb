"use client";

import React, { useEffect, useState } from "react";

function capitalizeFirst(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function LiveDateTime() {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const dateFormatted = new Intl.DateTimeFormat("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(now);

      const timeFormatted = new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setDateTime({
        date: capitalizeFirst(dateFormatted),
        time: timeFormatted,
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!dateTime.time) {
    return (
      <div className="hidden sm:flex flex-col items-center text-center text-xs text-[var(--text-muted)] animate-pulse min-w-[140px]">
        <span>Sincronizando…</span>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex flex-col items-center justify-center text-center px-3 py-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-xs min-w-[140px] max-w-[220px]">
      <time
        dateTime={new Date().toISOString().split("T")[0]}
        className="text-[10px] sm:text-[11px] font-medium text-[var(--text-secondary)] leading-snug"
      >
        {dateTime.date}
      </time>
      <time
        className="mt-1 text-sm font-mono font-semibold text-[var(--teal-primary)] tabular-nums tracking-wide"
      >
        {dateTime.time}
      </time>
    </div>
  );
}
