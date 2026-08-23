-- Security hardening: this event-trigger function is invoked by PostgreSQL,
-- not by application clients. Keep it callable by the owning database role
-- while removing unnecessary Data API execution privileges.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
