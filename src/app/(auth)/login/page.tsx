import Link from "next/link";
import { safeRedirectPath } from "@/lib/validation";
import { Divider } from "../Divider";
import { OAuthButtons } from "../OAuthButtons";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Entrar" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const target = safeRedirectPath(next);

  return (
    <>
      <h1 className="mb-5 font-display text-2xl font-bold">Entrar</h1>
      {error === "callback" && (
        <p role="alert" className="mb-4 rounded-xl2 bg-flare/10 px-4 py-3 text-sm text-flare">
          O link de acesso é inválido ou expirou. Tente entrar de novo.
        </p>
      )}
      <LoginForm next={target} />
      <Divider />
      <OAuthButtons next={target} />
      <p className="mt-6 text-center text-sm text-muted">
        Não tem conta?{" "}
        <Link href="/signup" className="font-semibold text-brand hover:underline">
          Cadastre-se
        </Link>
      </p>
    </>
  );
}
