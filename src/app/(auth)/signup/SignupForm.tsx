"use client";

import { useActionState } from "react";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { signupAction, type FormState } from "../actions";
import { FormMessage } from "../FormMessage";

const initial: FormState = {};

export function SignupForm() {
  const [state, action] = useActionState(signupAction, initial);

  return (
    <form action={action} className="space-y-4" noValidate>
      <FormMessage state={state} />
      <Field label="E-mail" name="email" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <Field
        label="Nome completo"
        name="full_name"
        autoComplete="name"
        maxLength={50}
        required
        error={state.fieldErrors?.full_name}
      />
      <Field
        label="@usuário"
        name="username"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        maxLength={30}
        required
        hint="Letras minúsculas, números, ponto e sublinhado."
        error={state.fieldErrors?.username}
      />
      <Field
        label="Senha"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="Mínimo de 8 caracteres, com letras e números."
        error={state.fieldErrors?.password}
      />
      <SubmitButton pendingLabel="Criando conta…">Criar conta</SubmitButton>
    </form>
  );
}
