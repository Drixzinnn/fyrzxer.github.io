"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { firstErrors, profileSchema, str } from "@/lib/validation";

export interface ProfileFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function updateProfileAction(_prev: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const parsed = profileSchema.safeParse({
    full_name: str(formData, "full_name"),
    username: str(formData, "username"),
    bio: str(formData, "bio"),
    website: str(formData, "website"),
    category: str(formData, "category"),
    account_type: str(formData, "account_type"),
    is_private: formData.get("is_private") === "on",
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/profile");

  // A foto só vale se estiver na pasta do próprio usuário no bucket de avatares.
  const avatarUrl = str(formData, "avatar_url");
  let avatar_url: string | null | undefined;
  if (avatarUrl) {
    const allowedPrefix = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${user.id}/`;
    if (!avatarUrl.startsWith(allowedPrefix)) return { error: "Foto de perfil inválida. Envie a imagem novamente." };
    avatar_url = avatarUrl;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ ...parsed.data, ...(avatar_url ? { avatar_url } : {}) })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") return { fieldErrors: { username: "Esse @usuário já está em uso." } };
    if (error.code === "23514") return { fieldErrors: { username: "Esse @usuário não está disponível." } };
    return { error: "Não foi possível salvar agora. Tente novamente." };
  }

  revalidatePath(`/${parsed.data.username}`);
  redirect(`/${parsed.data.username}`);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
