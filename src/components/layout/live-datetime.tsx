"use client";

import React, { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";

export function LiveDateTime() {
  const [dateTime, setDateTime] = useState<{ date: string; time: string }>({
    date: "",
    time: "",
  });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      
      const dateFormatted = new Intl.DateTimeFormat("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(now);

      const timeFormatted = new Intl.DateTimeFormat("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now);

      setDateTime({
        date: dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1),
        time: timeFormatted,
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!dateTime.time) {
    return (
      <div className="hidden md:flex items-center gap-2 text-xs text-[var(--text-muted)] animate-pulse">
        <Clock className="w-3.5 h-3.5 text-[var(--teal-primary)]" />
        <span>Cargando hora...</span>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-card)] text-xs text-[var(--text-secondary)] shadow-xs">
      <div className="flex items-center gap-1.5 font-medium">
        <Calendar className="w-3.5 h-3.5 text-[var(--teal-primary)]" />
        <span>{dateTime.date}</span>
      </div>
      <span className="text-[var(--border-color)]">|</span>
      <div className="flex items-center gap-1.5 font-mono text-[var(--teal-primary)] font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>{dateTime.time}</span>
      </div>
    </div>
  );
}
