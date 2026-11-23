import Link from "next/link";
import { Divider } from "../Divider";
import { OAuthButtons } from "../OAuthButtons";
import { SignupForm } from "./SignupForm";

export const metadata = { title: "Criar conta" };

export default function SignupPage() {
  return (
    <>
      <h1 className="mb-5 font-display text-2xl font-bold">Criar conta</h1>
      <OAuthButtons />
      <Divider />
      <SignupForm />
      <p className="mt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
