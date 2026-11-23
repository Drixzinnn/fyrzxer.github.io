"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Provider = "google" | "apple";

/** Entrar com Google ou Apple (precisam estar ativados no painel do Supabase). */
export function OAuthButtons({ next = "/feed" }: { next?: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<Provider | null>(null);

  async function signIn(provider: Provider) {
    setError(null);
    setLoading(provider);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (oauthError) {
      setError("Não foi possível iniciar o login. Tente novamente.");
      setLoading(null);
    }
  }

  const base =
    "w-full rounded-full border border-line bg-surface px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-raised disabled:opacity-60";

  return (
    <div className="space-y-2">
      <button type="button" className={base} disabled={loading !== null} onClick={() => signIn("google")}>
        {loading === "google" ? "Abrindo Google…" : "Continuar com Google"}
      </button>
      <button type="button" className={base} disabled={loading !== null} onClick={() => signIn("apple")}>
        {loading === "apple" ? "Abrindo Apple…" : "Continuar com Apple"}
      </button>
      {error && (
        <p role="alert" className="text-sm text-flare">
          {error}
        </p>
      )}
    </div>
  );
}
