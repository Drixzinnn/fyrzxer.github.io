import { Wordmark } from "@/components/layout/Wordmark";

/** Cartão centralizado para login, cadastro e recuperação de senha. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <Wordmark className="text-4xl" />
      </div>
      <div className="rounded-xl2 border border-line bg-surface p-6 shadow-sm">{children}</div>
    </main>
  );
}
