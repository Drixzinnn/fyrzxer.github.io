import { cn } from "@/lib/utils";

/** Bloco de carregamento com brilho que passa de lado a lado. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("relative overflow-hidden rounded-xl2 bg-raised", className)}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-surface/60 to-transparent" />
    </div>
  );
}

/** Esqueleto de um post do feed. */
export function PostSkeleton() {
  return (
    <div className="space-y-3" role="status" aria-label="Carregando publicação">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="aspect-[4/5] w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
