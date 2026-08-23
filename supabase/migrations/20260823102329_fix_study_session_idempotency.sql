-- ON CONFLICT (user_id, client_id) requires an index that can be inferred
-- without a partial predicate. NULL client ids remain non-conflicting in
-- PostgreSQL, so the full unique index is safe for legacy rows.
drop index if exists public.study_sessions_user_client_idx;
create unique index if not exists study_sessions_user_client_idx
  on public.study_sessions(user_id, client_id);
