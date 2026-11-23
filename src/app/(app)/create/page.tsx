import { PlusSquare } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Criar" };

export default function Page() {
  return (
    <EmptyState
      icon={PlusSquare}
      title="Publicar"
      description="Upload de fotos e vídeos com carrossel chega na fase 2."
    />
  );
}
