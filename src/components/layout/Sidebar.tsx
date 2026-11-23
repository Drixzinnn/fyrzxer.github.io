"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./ThemeToggle";
import { Wordmark } from "./Wordmark";

/** Navegação lateral (desktop). Em telas menores que lg fica oculta. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-line px-4 py-6 lg:flex">
      <Wordmark className="mb-8 px-3" />
      <nav aria-label="Principal" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl2 px-3 py-3 text-[15px] transition-colors",
                active ? "bg-brand/10 font-semibold text-brand" : "font-medium text-muted hover:bg-raised hover:text-ink",
              )}
            >
              <Icon size={24} strokeWidth={active ? 2.5 : 2} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
      <ThemeToggle withLabel />
    </aside>
  );
}
