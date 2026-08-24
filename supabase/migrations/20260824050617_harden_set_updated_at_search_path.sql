-- Pin the trigger function search path so object resolution cannot be changed
-- by a caller-controlled search_path.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
