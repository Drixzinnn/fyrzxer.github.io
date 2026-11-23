"use client";

import { cn } from "@/lib/utils";
import { useFeedStore, type FeedTab } from "@/stores/feed-store";

const TABS: { id: FeedTab; label: string }[] = [
  { id: "for-you", label: "Para você" },
  { id: "following", label: "Seguindo" },
  { id: "favorites", label: "Favoritos" },
];

export function FeedTabs() {
  const { tab, setTab } = useFeedStore();

  return (
    <div role="tablist" aria-label="Tipo de feed" className="flex gap-1 border-b border-line px-2">
      {TABS.map(({ id, label }) => {
        const selected = tab === id;
        return (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={selected}
            onClick={() => setTab(id)}
            className={cn(
              "relative px-4 py-3 text-[15px] font-semibold transition-colors",
              selected ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {label}
            {selected && <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand" />}
          </button>
        );
      })}
    </div>
  );
}
