import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Atalho "Perfil" da navegação: leva para a página pública da própria pessoa. */
export default async function MyProfileRedirect() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const { data: profile } = await supabase.from("profiles").select("username").eq("id", user.id).maybeSingle<{ username: string }>();
  if (!profile) redirect("/settings/profile");

  redirect(`/${profile.username}`);
}
