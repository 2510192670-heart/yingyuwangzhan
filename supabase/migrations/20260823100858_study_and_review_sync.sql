-- Phase 3: idempotent learning duration and vocabulary review sync.
alter table public.word_mastery
  add column if not exists last_result text,
  add column if not exists last_reviewed_at timestamptz;

do $$
begin
  alter table public.word_mastery
    add constraint word_mastery_last_result_check
    check (last_result is null or last_result in ('mastered', 'again'));
exception
  when duplicate_object then null;
end $$;

alter table public.study_sessions
  add column if not exists client_id text,
  add column if not exists study_date date;

create unique index if not exists study_sessions_user_client_idx
  on public.study_sessions(user_id, client_id)
  where client_id is not null;

create index if not exists study_sessions_user_date_idx
  on public.study_sessions(user_id, study_date);
