import { create } from "zustand";

export type FeedTab = "for-you" | "following" | "favorites";

interface FeedState {
  tab: FeedTab;
  setTab: (tab: FeedTab) => void;
}

/** Aba ativa do feed. A lógica de relevância entra na Fase 2. */
export const useFeedStore = create<FeedState>((set) => ({
  tab: "for-you",
  setTab: (tab) => set({ tab }),
}));
