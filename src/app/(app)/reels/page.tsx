import { Clapperboard } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";

export const metadata = { title: "Reels" };

export default function Page() {
  return (
    <EmptyState
      icon={Clapperboard}
      title="Vídeos curtos em tela cheia"
      description="O feed vertical de Reels chega na fase 4."
    />
  );
}
