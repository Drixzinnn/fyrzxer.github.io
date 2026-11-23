import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Explorar" };

export default function Page() {
  return (
    <EmptyState
      icon={Compass}
      title="Descubra novos perfis e posts"
      description="Conteúdo recomendado e busca por pessoas, hashtags e locais chegam na fase 6."
    />
  );
}
