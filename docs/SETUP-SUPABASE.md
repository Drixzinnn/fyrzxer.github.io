# Configurar o Supabase (Fase 1)

## 1. Criar o projeto
1. Acesse https://supabase.com/dashboard e clique em **New project**.
2. Anote a **Project URL** e a chave **anon public** em *Project Settings > API*.
3. Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. Rodar a migração
1. No painel: **SQL Editor > New query**.
2. Cole todo o conteúdo de `supabase/migrations/0001_auth_profiles.sql` e clique em **Run**.
3. Confira em **Table Editor** que a tabela `profiles` existe e em **Storage** que o bucket `avatars` foi criado.

A migração cria: tabela `profiles` com RLS, perfil automático no cadastro, checagem de @usuário disponível e o bucket de fotos com políticas por pasta.

## 3. Configurar a autenticação
Em **Authentication > URL Configuration**:
- **Site URL:** `http://localhost:3000` (em produção, a URL da Vercel)
- **Redirect URLs:** `http://localhost:3000/auth/callback` (e a URL de produção + `/auth/callback`)

Em **Authentication > Sign In / Providers**:
- **Email:** mantenha ativo. Para testar sem confirmar e-mail, desative "Confirm email" (reative em produção).
- **Google:** crie credenciais OAuth no Google Cloud Console, com a URL de callback exibida no painel do Supabase, e cole Client ID e Secret.
- **Apple:** exige conta Apple Developer paga (Services ID e chave). Sem ela, o botão "Continuar com Apple" retorna erro, e isso é esperado.

## 4. Rodar
```bash
npm install
npm run dev
```
Crie uma conta em http://localhost:3000/signup. O perfil aparece em `/seu_usuario`.

## Observações
- O envio de e-mails do plano gratuito do Supabase tem limite baixo por hora. Para uso real, configure um SMTP próprio em *Authentication > SMTP Settings*.
- A autenticação em dois fatores e o selo de verificado (`is_verified`, que só o admin altera) ficam para a fase 7.
