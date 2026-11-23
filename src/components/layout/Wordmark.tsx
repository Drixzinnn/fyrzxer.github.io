import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logotipo: minúsculas, com o "z" em destaque como a faísca da marca. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/feed"
      aria-label="fyrzxer, ir para o início"
      className={cn("font-display text-2xl font-extrabold tracking-tight", className)}
    >
      fyr<span className="text-flare">z</span>xer
    </Link>
  );
}
