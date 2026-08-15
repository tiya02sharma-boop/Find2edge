-- Run this in the Supabase SQL editor (or `supabase db push` if you use the CLI).
-- Replaces the local better-sqlite3 users/profiles tables with a `profiles`
-- table that hangs off Supabase's built-in auth.users.

-- 1. Drop the old local-only tables if you ever created them here (no-op if not).
drop table if exists public.profiles cascade;

-- 2. profiles: one row per auth user, same fields db.js used to keep.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  avatar text default '👑',
  age integer,
  goal text,
  experience text,
  profession text,
  monthly_income integer,
  personal_goals text,
  ambitions text,
  five_year_plan text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Row Level Security: each user can only see/edit their own row.
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Inserts are done by the trigger below (as the postgres role), so no
-- insert policy for regular users is needed.

-- 4. Auto-create a profiles row whenever someone signs up.
-- Registration fields (fullName, avatar, age, goal, ...) are passed in
-- supabase.auth.signUp({ options: { data: {...} } }) and land in
-- new.raw_user_meta_data, which this trigger reads.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, full_name, avatar, age, goal, experience, profession,
    monthly_income, personal_goals, ambitions, five_year_plan
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar', '👑'),
    nullif(new.raw_user_meta_data->>'age', '')::integer,
    new.raw_user_meta_data->>'goal',
    new.raw_user_meta_data->>'experience',
    new.raw_user_meta_data->>'profession',
    nullif(new.raw_user_meta_data->>'monthly_income', '')::integer,
    new.raw_user_meta_data->>'personal_goals',
    new.raw_user_meta_data->>'ambitions',
    new.raw_user_meta_data->>'five_year_plan'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Keep updated_at fresh on profile edits.
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();