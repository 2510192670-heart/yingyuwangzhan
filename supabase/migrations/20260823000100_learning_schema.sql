create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '学习者',
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  font_size integer not null default 19 check (font_size between 14 and 32),
  read_mode text not null default 'study' check (read_mode in ('study', 'hide-zh', 'hide-en')),
  theme text not null default 'paper' check (theme in ('paper', 'dark')),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text not null,
  chapter_id text not null,
  scroll_position integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, chapter_id)
);

create table if not exists public.word_mastery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  status text not null default 'new' check (status in ('new', 'learning', 'mastered')),
  review_count integer not null default 0 check (review_count >= 0),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, word_id)
);

create table if not exists public.wordbook_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  word_id text not null,
  added_at timestamptz not null default timezone('utc', now()),
  removed_at timestamptz,
  unique (user_id, word_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  book_id text,
  chapter_id text,
  started_at timestamptz not null default timezone('utc', now()),
  duration_seconds integer not null default 0 check (duration_seconds >= 0)
);

create index if not exists reading_progress_user_id_idx on public.reading_progress(user_id);
create index if not exists word_mastery_user_id_idx on public.word_mastery(user_id);
create index if not exists wordbook_items_user_id_idx on public.wordbook_items(user_id);
create index if not exists study_sessions_user_id_idx on public.study_sessions(user_id);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists preferences_updated_at on public.user_preferences;
create trigger preferences_updated_at before update on public.user_preferences
for each row execute function public.set_updated_at();

drop trigger if exists reading_progress_updated_at on public.reading_progress;
create trigger reading_progress_updated_at before update on public.reading_progress
for each row execute function public.set_updated_at();

drop trigger if exists word_mastery_updated_at on public.word_mastery;
create trigger word_mastery_updated_at before update on public.word_mastery
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.reading_progress enable row level security;
alter table public.word_mastery enable row level security;
alter table public.wordbook_items enable row level security;
alter table public.study_sessions enable row level security;

create policy "profiles own rows" on public.profiles for all to authenticated
using (auth.uid() = id) with check (auth.uid() = id);
create policy "preferences own rows" on public.user_preferences for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reading progress own rows" on public.reading_progress for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "word mastery own rows" on public.word_mastery for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wordbook own rows" on public.wordbook_items for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "study sessions own rows" on public.study_sessions for all to authenticated
using (auth.uid() = user_id) with check (auth.uid() = user_id);
