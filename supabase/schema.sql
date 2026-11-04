-- =========================================================
-- SockSync waitlist — palaid šo Supabase → SQL Editor → Run
-- =========================================================

create table if not exists public.waitlist (
  id          bigint generated always as identity primary key,
  user_id     uuid not null unique references auth.users(id) on delete cascade,
  email       text not null unique,
  full_name   text,
  referred_by bigint references public.waitlist(id) on delete set null,
  created_at  timestamptz not null default now()
);
-- UNIQUE uz user_id un email = dublikātus aptur pati datubāze,
-- pat ja kods kļūdās vai kāds sūta pieprasījumus pa tiešo.

-- ---------- Row Level Security ----------
alter table public.waitlist enable row level security;

-- Admini (Bonus 3). Ieliec SAVU e-pastu zemāk.
create table if not exists public.admins (
  email text primary key
);
alter table public.admins enable row level security;  -- bez politikām = neviens no pārlūka to nelasa

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where email = auth.jwt() ->> 'email');
$$;

-- Lasīt: tikai savu rindu (vai visas, ja esi admins)
drop policy if exists "read own row" on public.waitlist;
create policy "read own row" on public.waitlist
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- Ievietot: tikai sevi pašu un tikai ar savu īsto e-pastu
drop policy if exists "insert self" on public.waitlist;
create policy "insert self" on public.waitlist
  for insert to authenticated
  with check (auth.uid() = user_id and email = auth.jwt() ->> 'email');

-- Dzēst: tikai savu rindu ("Leave the waitlist")
drop policy if exists "delete own row" on public.waitlist;
create policy "delete own row" on public.waitlist
  for delete to authenticated
  using (auth.uid() = user_id);

-- UPDATE politikas nav => neviens nevar mainīt rindas (arī ne referred_by).

-- ---------- Bonus funkcijas (atgriež tikai skaitļus, ne e-pastus) ----------
create or replace function public.waitlist_count()
returns bigint
language sql stable security definer set search_path = public
as $$ select count(*) from public.waitlist; $$;

create or replace function public.my_waitlist_position()
returns bigint
language sql stable security definer set search_path = public
as $$
  select count(*) from public.waitlist w
  where w.created_at <= (select created_at from public.waitlist where user_id = auth.uid());
$$;

create or replace function public.my_referral_count()
returns bigint
language sql stable security definer set search_path = public
as $$
  select count(*) from public.waitlist w
  where w.referred_by = (select id from public.waitlist where user_id = auth.uid());
$$;

grant execute on function public.waitlist_count()      to anon, authenticated;
grant execute on function public.my_waitlist_position() to authenticated;
grant execute on function public.my_referral_count()    to authenticated;
grant execute on function public.is_admin()             to authenticated;

-- ---------- Padari sevi par adminu ----------
-- insert into public.admins (email) values ('tavs.epasts@gmail.com');
