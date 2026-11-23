"use client";

import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Botão de envio que desabilita e mostra o estado enquanto a action roda. */
export function SubmitButton({
  children,
  pendingLabel = "Aguarde…",
  className,
}: {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-full bg-brand px-5 py-3 text-[15px] font-semibold text-brand-ink transition-opacity",
        "hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
