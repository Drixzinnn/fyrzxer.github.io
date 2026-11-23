import { Heart } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Notificações" };

export default function Page() {
  return (
    <EmptyState
      icon={Heart}
      title="Nada de novo por enquanto"
      description="Curtidas, comentários e novos seguidores aparecem aqui quando houver atividade."
    />
  );
}
