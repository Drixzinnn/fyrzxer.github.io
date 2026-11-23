import type { FormState } from "./actions";

/** Erro geral ou mensagem de sucesso de um formulário. */
export function FormMessage({ state }: { state: FormState }) {
  if (state.error) {
    return (
      <p role="alert" className="rounded-xl2 bg-flare/10 px-4 py-3 text-sm text-flare">
        {state.error}
      </p>
    );
  }
  if (state.message) {
    return (
      <p role="status" className="rounded-xl2 bg-brand/10 px-4 py-3 text-sm text-ink">
        {state.message}
      </p>
    );
  }
  return null;
}
