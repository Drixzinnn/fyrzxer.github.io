"use client";

import { useActionState, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { compressSquareImage } from "@/lib/image";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/profile";
import { updateProfileAction, type ProfileFormState } from "../actions";

const initial: ProfileFormState = {};
const MAX_INPUT_BYTES = 10 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/webp"];

export function EditProfileForm({ profile }: { profile: Profile }) {
  const [state, action] = useActionState(updateProfileAction, initial);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPickFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    if (!ACCEPTED.includes(file.type)) return setUploadError("Use uma imagem JPG, PNG ou WebP.");
    if (file.size > MAX_INPUT_BYTES) return setUploadError("A imagem passa de 10 MB.");

    setUploading(true);
    try {
      const blob = await compressSquareImage(file);
      const supabase = createClient();
      const path = `${profile.id}/avatar-${Date.now()}.jpg`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000" });
      if (error) throw error;
      setAvatarUrl(supabase.storage.from("avatars").getPublicUrl(path).data.publicUrl);
    } catch {
      setUploadError("Não foi possível enviar a foto. Tente novamente.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const textareaClass =
    "w-full rounded-xl2 border border-line bg-surface px-4 py-3 text-[15px] outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/25";

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl2 bg-flare/10 px-4 py-3 text-sm text-flare">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Avatar src={avatarUrl || null} name={profile.full_name || profile.username} size={72} />
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="rounded-full bg-raised px-4 py-2 text-sm font-semibold transition-colors hover:bg-line disabled:opacity-60"
          >
            {uploading ? "Enviando…" : "Trocar foto"}
          </button>
          {uploadError && (
            <p role="alert" className="mt-1.5 text-sm text-flare">
              {uploadError}
            </p>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPTED.join(",")}
          className="sr-only"
          aria-label="Escolher foto de perfil"
          onChange={(e) => onPickFile(e.target.files?.[0])}
        />
        <input type="hidden" name="avatar_url" value={avatarUrl} />
      </div>

      <Field label="Nome" name="full_name" defaultValue={profile.full_name} maxLength={50} required error={state.fieldErrors?.full_name} />
      <Field
        label="@usuário"
        name="username"
        defaultValue={profile.username}
        autoCapitalize="none"
        spellCheck={false}
        maxLength={30}
        required
        error={state.fieldErrors?.username}
      />

      <div className="space-y-1.5">
        <label htmlFor="bio" className="block text-sm font-semibold">
          Bio
        </label>
        <textarea id="bio" name="bio" rows={3} maxLength={150} defaultValue={profile.bio} className={textareaClass} aria-describedby="bio-hint" />
        <p id="bio-hint" className="text-sm text-muted">
          Até 150 caracteres.
        </p>
        {state.fieldErrors?.bio && (
          <p role="alert" className="text-sm text-flare">
            {state.fieldErrors.bio}
          </p>
        )}
      </div>

      <Field label="Link" name="website" type="text" inputMode="url" defaultValue={profile.website ?? ""} placeholder="seusite.com" error={state.fieldErrors?.website} />
      <Field label="Categoria" name="category" defaultValue={profile.category ?? ""} maxLength={40} placeholder="Ex.: Fotógrafo" error={state.fieldErrors?.category} />

      <div className="space-y-1.5">
        <label htmlFor="account_type" className="block text-sm font-semibold">
          Tipo de conta
        </label>
        <select id="account_type" name="account_type" defaultValue={profile.account_type} className={textareaClass}>
          <option value="personal">Pessoal</option>
          <option value="creator">Criador de conteúdo</option>
          <option value="business">Comercial</option>
        </select>
      </div>

      <label className="flex items-start gap-3 rounded-xl2 border border-line bg-surface p-4">
        <input type="checkbox" name="is_private" defaultChecked={profile.is_private} className="mt-1 h-4 w-4 accent-[rgb(var(--brand))]" />
        <span>
          <span className="block text-[15px] font-semibold">Conta privada</span>
          <span className="block text-sm text-muted">Só quem você aprovar poderá ver suas publicações.</span>
        </span>
      </label>

      <SubmitButton pendingLabel="Salvando…" className={uploading ? "pointer-events-none opacity-60" : ""}>
        Salvar alterações
      </SubmitButton>
    </form>
  );
}
