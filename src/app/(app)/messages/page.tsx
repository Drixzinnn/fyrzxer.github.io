import { MessageCircle } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Mensagens" };

export default function Page() {
  return (
    <EmptyState
      icon={MessageCircle}
      title="Suas conversas ficam aqui"
      description="Mensagens diretas em tempo real chegam na fase 5."
    />
  );
}
