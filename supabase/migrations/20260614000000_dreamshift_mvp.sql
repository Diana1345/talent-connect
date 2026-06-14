create table if not exists public.dreamshift_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  dream_job text not null,
  experience_level text not null check (experience_level in ('Beginner','Intermediate','Advanced')),
  weekly_time text not null,
  xp integer not null default 0,
  coins integer not null default 0,
  streak integer not null default 1,
  completed_missions integer not null default 0,
  skills text[] not null default array['Career discovery'],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dreamshift_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  scenario text not null,
  objective text not null,
  deliverables jsonb not null default '[]'::jsonb,
  difficulty text not null,
  estimated_time text not null,
  evaluation_criteria jsonb not null default '[]'::jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists public.dreamshift_submissions (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.dreamshift_missions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.dreamshift_scores (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.dreamshift_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score integer not null check (score between 0 and 100),
  metrics jsonb not null,
  feedback jsonb not null,
  xp_awarded integer not null,
  coins_awarded integer not null,
  created_at timestamptz not null default now()
);

alter table public.dreamshift_profiles enable row level security;
alter table public.dreamshift_missions enable row level security;
alter table public.dreamshift_submissions enable row level security;
alter table public.dreamshift_scores enable row level security;

create policy "Users manage own DreamShift profiles" on public.dreamshift_profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Users manage own DreamShift missions" on public.dreamshift_missions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own DreamShift submissions" on public.dreamshift_submissions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own DreamShift scores" on public.dreamshift_scores for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
