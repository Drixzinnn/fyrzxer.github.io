import { BadgeCheck, Globe, Grid3x3, Lock } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";

type Props = { params: Promise<{ username: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `@${decodeURIComponent(username)}` };
}

const ACCOUNT_LABEL: Record<Profile["account_type"], string | null> = {
  personal: null,
  creator: "Criador de conteúdo",
  business: "Conta comercial",
};

export default async function ProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const [{ data: profile }, { data: auth }] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("username", decodeURIComponent(username).toLowerCase())
      .maybeSingle<Profile>(),
    supabase.auth.getUser(),
  ]);

  if (!profile) notFound();

  const isOwn = auth.user?.id === profile.id;
  const accountLabel = ACCOUNT_LABEL[profile.account_type];
  const websiteLabel = profile.website?.replace(/^https?:\/\//i, "").replace(/\/$/, "");

  return (
    <article>
      <header className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-5">
          <Avatar src={profile.avatar_url} name={profile.full_name || profile.username} size={88} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h1 className="truncate font-display text-xl font-bold">@{profile.username}</h1>
              {profile.is_verified && <BadgeCheck size={20} className="shrink-0 text-brand" aria-label="Conta verificada" />}
              {profile.is_private && <Lock size={16} className="shrink-0 text-muted" aria-label="Conta privada" />}
            </div>
            <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
              {[
                ["publicações", 0],
                ["seguidores", 0],
                ["seguindo", 0],
              ].map(([label, value]) => (
                <div key={label}>
                  <dd className="font-display text-lg font-bold leading-none">{value}</dd>
                  <dt className="mt-1 text-xs text-muted">{label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-4 space-y-1 text-[15px]">
          {profile.full_name && <p className="font-semibold">{profile.full_name}</p>}
          {(profile.category || accountLabel) && <p className="text-sm text-muted">{profile.category ?? accountLabel}</p>}
          {profile.bio && <p className="whitespace-pre-line">{profile.bio}</p>}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
            >
              <Globe size={16} aria-hidden />
              {websiteLabel}
            </a>
          )}
        </div>

        {isOwn && (
          <Link
            href="/settings/profile"
            className="mt-5 block rounded-full bg-raised px-5 py-2.5 text-center text-[15px] font-semibold transition-colors hover:bg-line"
          >
            Editar perfil
          </Link>
        )}
      </header>

      <div className="border-t border-line">
        <EmptyState
          icon={Grid3x3}
          title="Nenhuma publicação ainda"
          description={
            isOwn
              ? "Suas fotos e vídeos vão aparecer aqui quando a publicação chegar, na fase 2."
              : "Quando esta pessoa publicar, o conteúdo aparece aqui."
          }
        />
      </div>
    </article>
  );
}
