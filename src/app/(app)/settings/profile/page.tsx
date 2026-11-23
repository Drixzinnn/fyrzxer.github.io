import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types/profile";
import { logoutAction } from "../actions";
import { EditProfileForm } from "./EditProfileForm";

export const metadata = { title: "Editar perfil" };

export default async function EditProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/profile");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle<Profile>();
  if (!profile) {
    return (
      <p role="alert" className="p-6 text-center text-muted">
        Não encontramos seu perfil. Confirme se a migração SQL da fase 1 foi executada no Supabase.
      </p>
    );
  }

  return (
    <div className="px-5 py-6">
      <h1 className="mb-6 font-display text-2xl font-bold">Editar perfil</h1>
      <EditProfileForm profile={profile} />
      <form action={logoutAction} className="mt-8 border-t border-line pt-6">
        <button type="submit" className="w-full rounded-full border border-line px-5 py-3 text-[15px] font-semibold text-flare transition-colors hover:bg-flare/10">
          Sair da conta
        </button>
      </form>
    </div>
  );
}
