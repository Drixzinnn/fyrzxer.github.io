-- fyrzxer · Fase 1: perfis, RLS e storage de avatares
-- Rode no Supabase: SQL Editor > New query > cole tudo > Run. É seguro rodar mais de uma vez.

-- ---------------------------------------------------------------------------
-- Nomes de usuário reservados (não podem virar @usuário: conflitam com rotas)
-- ---------------------------------------------------------------------------
create or replace function public.is_reserved_username(u text)
returns boolean
language sql
immutable
as $$
  select lower(u) = any (array[
    'feed','explore','reels','messages','notifications','create','profile','settings',
    'login','signup','logout','auth','api','admin','help','about','privacy','terms',
    'stories','direct','accounts','support','fyrzxer'
  ]);
$$;

-- ---------------------------------------------------------------------------
-- profiles: 1 linha por usuário de auth.users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  username     text not null unique,
  full_name    text not null default '',
  bio          text not null default '',
  website      text,
  category     text,
  avatar_url   text,
  account_type text not null default 'personal'
               check (account_type in ('personal', 'creator', 'business')),
  is_private   boolean not null default false,
  is_verified  boolean not null default false,   -- selo: só o painel admin altera
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint username_format check (
    username ~ '^[a-z0-9._]{3,30}$' and username !~ '(^\.|\.$|\.\.)'
  ),
  constraint username_not_reserved check (not public.is_reserved_username(username)),
  constraint full_name_length check (char_length(full_name) <= 50),
  constraint bio_length check (char_length(bio) <= 150),
  constraint website_format check (website is null or (website ~* '^https?://' and char_length(website) <= 200)),
  constraint category_length check (category is null or char_length(category) <= 40)
);

create index if not exists profiles_username_idx on public.profiles (username);

-- updated_at automático
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Cria o perfil automaticamente quando alguém se cadastra (e-mail ou OAuth)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_username text := lower(coalesce(new.raw_user_meta_data->>'username', ''));
  base          text;
  candidate     text;
  tries         int := 0;
begin
  if meta_username ~ '^[a-z0-9._]{3,30}$'
     and meta_username !~ '(^\.|\.$|\.\.)'
     and not public.is_reserved_username(meta_username)
     and not exists (select 1 from public.profiles where username = meta_username)
  then
    candidate := meta_username;
  else
    -- Sem @usuário válido (ex.: login com Google): deriva do e-mail.
    base := regexp_replace(lower(split_part(coalesce(new.email, 'user'), '@', 1)), '[^a-z0-9._]', '', 'g');
    base := regexp_replace(base, '\.{2,}', '.', 'g');
    base := trim(both '.' from base);
    if char_length(base) < 3 then base := 'user' || base; end if;
    base := trim(both '.' from left(base, 24));
    if char_length(base) < 3 then base := 'user'; end if;

    candidate := base;
    while public.is_reserved_username(candidate)
       or exists (select 1 from public.profiles where username = candidate)
    loop
      tries := tries + 1;
      candidate := base || (floor(random() * 9000) + 1000)::int::text;
      exit when tries > 25;
    end loop;
  end if;

  insert into public.profiles (id, username, full_name)
  values (
    new.id,
    candidate,
    left(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''), 50)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Disponibilidade de @usuário (chamável antes do login, no cadastro)
-- ---------------------------------------------------------------------------
create or replace function public.username_available(u text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select u ~ '^[a-z0-9._]{3,30}$'
     and u !~ '(^\.|\.$|\.\.)'
     and not public.is_reserved_username(u)
     and not exists (select 1 from public.profiles where username = lower(u));
$$;

grant execute on function public.username_available(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- Perfis são visíveis para quem está logado (conta privada esconde POSTS, não o
-- perfil; isso será aplicado nas políticas de posts da fase 2).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;

drop policy if exists profiles_select_authenticated on public.profiles;
create policy profiles_select_authenticated
  on public.profiles for select to authenticated
  using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Sem INSERT/DELETE direto (perfil nasce pelo trigger e some com a conta).
-- UPDATE só nas colunas editáveis: is_verified, id e created_at ficam protegidos.
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant update (username, full_name, bio, website, category, avatar_url, is_private, account_type)
  on public.profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: bucket público "avatars", cada pessoa só escreve na própria pasta
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists avatars_select_own on storage.objects;
create policy avatars_select_own
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_insert_own on storage.objects;
create policy avatars_insert_own
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_update_own on storage.objects;
create policy avatars_update_own
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists avatars_delete_own on storage.objects;
create policy avatars_delete_own
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
