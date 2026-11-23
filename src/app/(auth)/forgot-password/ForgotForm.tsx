"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { forgotPasswordAction, type FormState } from "../actions";
import { FormMessage } from "../FormMessage";

const initial: FormState = {};

export function ForgotForm() {
  const [state, action] = useActionState(forgotPasswordAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <SubmitButton pendingLabel="Enviando…">Enviar link</SubmitButton>
    </form>
  );
}
