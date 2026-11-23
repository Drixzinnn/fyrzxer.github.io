import Link from "next/link";
import { ForgotForm } from "./ForgotForm";

export const metadata = { title: "Recuperar senha" };

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="font-display text-2xl font-bold">Recuperar senha</h1>
      <p className="mb-5 mt-2 text-sm text-muted">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
      <ForgotForm />
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-brand hover:underline">
          Voltar para o login
        </Link>
      </p>
    </>
  );
}
