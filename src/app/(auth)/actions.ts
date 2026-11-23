"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  firstErrors,
  forgotSchema,
  loginSchema,
  resetSchema,
  safeRedirectPath,
  signupSchema,
  str,
} from "@/lib/validation";

export interface FormState {
  error?: string;
  message?: string;
  fieldErrors?: Record<string, string>;
}

/** URL pública do app, usada nos links enviados por e-mail. */
async function siteUrl(): Promise<string> {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function loginAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({ email: str(formData, "email"), password: str(formData, "password") });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return { error: "Confirme seu e-mail antes de entrar. Procure o link na sua caixa de entrada." };
    }
    // Mensagem única para senha errada e e-mail inexistente (não revela quais contas existem).
    return { error: "E-mail ou senha incorretos." };
  }

  redirect(safeRedirectPath(str(formData, "next")));
}

export async function signupAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    email: str(formData, "email"),
    password: str(formData, "password"),
    username: str(formData, "username"),
    full_name: str(formData, "full_name"),
  });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };
  const { email, password, username, full_name } = parsed.data;

  const supabase = await createClient();

  const { data: available } = await supabase.rpc("username_available", { u: username });
  if (available === false) return { fieldErrors: { username: "Esse @usuário já está em uso." } };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, full_name },
      emailRedirectTo: `${await siteUrl()}/auth/callback?next=/feed`,
    },
  });

  if (error) {
    if (error.code === "weak_password") return { fieldErrors: { password: "Essa senha é fraca demais. Tente outra." } };
    return { error: "Não foi possível criar a conta agora. Tente novamente em instantes." };
  }

  // Com confirmação de e-mail desligada no Supabase, a sessão já vem pronta.
  if (data.session) redirect("/feed");

  return { message: `Enviamos um link de confirmação para ${email}. Abra o e-mail para ativar a conta.` };
}

export async function forgotPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = forgotSchema.safeParse({ email: str(formData, "email") });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${await siteUrl()}/auth/callback?next=/reset-password`,
  });

  // Resposta igual exista ou não a conta, para não revelar quem está cadastrado.
  return { message: "Se esse e-mail estiver cadastrado, enviamos um link para criar uma nova senha." };
}

export async function resetPasswordAction(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = resetSchema.safeParse({ password: str(formData, "password"), confirm: str(formData, "confirm") });
  if (!parsed.success) return { fieldErrors: firstErrors(parsed.error) };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "O link expirou. Peça um novo em “Esqueci minha senha”." };

  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) {
    if (error.code === "same_password") return { fieldErrors: { password: "Escolha uma senha diferente da atual." } };
    return { error: "Não foi possível atualizar a senha. Tente novamente." };
  }

  redirect("/feed");
}
