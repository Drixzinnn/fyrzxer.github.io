import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string | null;
  name: string;
  size?: number;
  className?: string;
}

/** Foto de perfil; sem foto, mostra a inicial do nome. */
export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const initial = (name.trim()[0] ?? "?").toUpperCase();
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand/15 font-display font-bold text-brand",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {src ? (
        <Image src={src} alt={`Foto de ${name}`} fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden>{initial}</span>
      )}
    </span>
  );
}
