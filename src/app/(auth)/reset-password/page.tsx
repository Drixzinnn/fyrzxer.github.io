import { ResetForm } from "./ResetForm";

export const metadata = { title: "Nova senha" };

export default function ResetPasswordPage() {
  return (
    <>
      <h1 className="mb-5 font-display text-2xl font-bold">Criar nova senha</h1>
      <ResetForm />
    </>
  );
}
