import { ImagePlus } from "lucide-react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { FeedTabs } from "./FeedTabs";

export const metadata = { title: "Início" };

export default function FeedPage() {
  return (
    <>
      <FeedTabs />
      <EmptyState
        icon={ImagePlus}
        title="Seu feed ainda está vazio"
        description="Quando você seguir pessoas ou publicar, as fotos e vídeos aparecem aqui."
        action={
          <Link
            href="/create"
            className="inline-flex rounded-full bg-brand px-5 py-2.5 text-[15px] font-semibold text-brand-ink transition-opacity hover:opacity-90"
          >
            Fazer a primeira publicação
          </Link>
        }
      />
    </>
  );
}
