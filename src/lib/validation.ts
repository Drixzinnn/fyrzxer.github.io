import { z, type ZodError } from "zod";

/** Mesma lista da função SQL is_reserved_username (o banco é a palavra final). */
const RESERVED_USERNAMES = new Set([
  "feed", "explore", "reels", "messages", "notifications", "create", "profile", "settings",
  "login", "signup", "logout", "auth", "api", "admin", "help", "about", "privacy", "terms",
  "stories", "direct", "accounts", "support", "fyrzxer",
]);

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Use pelo menos 3 caracteres.")
  .max(30, "Use no máximo 30 caracteres.")
  .regex(/^[a-z0-9._]+$/, "Use só letras minúsculas, números, ponto e sublinhado.")
  .refine((u) => !/^\.|\.$|\.\./.test(u), "Não comece nem termine com ponto, nem use dois pontos seguidos.")
  .refine((u) => !RESERVED_USERNAMES.has(u), "Esse @usuário não está disponível.");

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, "Informe seu e-mail.")
  .max(254, "E-mail muito longo.")
  .email("E-mail inválido.");

export const passwordSchema = z
  .string()
  .min(8, "Use pelo menos 8 caracteres.")
  .max(72, "Use no máximo 72 caracteres.")
  .regex(/[A-Za-z]/, "Inclua pelo menos uma letra.")
  .regex(/\d/, "Inclua pelo menos um número.");

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});

export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  full_name: z.string().trim().min(1, "Informe seu nome.").max(50, "Use no máximo 50 caracteres."),
});

export const forgotSchema = z.object({ email: emailSchema });

export const resetSchema = z
  .object({ password: passwordSchema, confirm: z.string() })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "As senhas não coincidem." });

function normalizeWebsite(value: string): string | null {
  if (!value) return null;
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const profileSchema = z.object({
  full_name: z.string().trim().min(1, "Informe seu nome.").max(50, "Use no máximo 50 caracteres."),
  username: usernameSchema,
  bio: z.string().trim().max(150, "A bio pode ter até 150 caracteres."),
  website: z
    .string()
    .trim()
    .max(190, "Link muito longo.")
    .transform(normalizeWebsite)
    .refine((v) => v === null || isHttpUrl(v), "Link inválido."),
  category: z
    .string()
    .trim()
    .max(40, "Use no máximo 40 caracteres.")
    .transform((v) => (v === "" ? null : v)),
  account_type: z.enum(["personal", "creator", "business"]),
  is_private: z.boolean(),
});

/** Primeira mensagem de erro de cada campo: { campo: "mensagem" }. */
export function firstErrors(error: ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

/** Lê um campo de FormData sempre como string (null vira ""). */
export function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

/** Aceita só caminhos internos, evitando redirecionamento para sites de fora. */
export function safeRedirectPath(path: string | null | undefined, fallback = "/feed"): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}
