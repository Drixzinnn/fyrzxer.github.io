"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Antes de montar não sabemos o tema real; evita ícone errado no primeiro render.
  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Usar tema claro" : "Usar tema escuro";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={label}
      className="flex items-center gap-3 rounded-xl2 px-3 py-3 text-muted transition-colors hover:bg-raised hover:text-ink"
    >
      {isDark ? <Sun size={24} aria-hidden /> : <Moon size={24} aria-hidden />}
      {withLabel && <span className="text-[15px] font-medium">{isDark ? "Tema claro" : "Tema escuro"}</span>}
    </button>
  );
}
