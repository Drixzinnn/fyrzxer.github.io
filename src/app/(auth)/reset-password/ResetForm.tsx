"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { resetPasswordAction, type FormState } from "../actions";
import { FormMessage } from "../FormMessage";

const initial: FormState = {};

export function ResetForm() {
  const [state, action] = useActionState(resetPasswordAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <Field
        label="Nova senha"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="Mínimo de 8 caracteres, com letras e números."
        error={state.fieldErrors?.password}
      />
      <Field
        label="Repita a nova senha"
        name="confirm"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirm}
      />
      <SubmitButton pendingLabel="Salvando…">Salvar nova senha</SubmitButton>
    </form>
  );
}
