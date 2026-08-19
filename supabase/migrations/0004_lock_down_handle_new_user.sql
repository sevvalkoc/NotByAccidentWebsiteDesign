-- ============================================================================
-- NOT BY ACCIDENT — LOCK DOWN handle_new_user()
-- ============================================================================
-- Run this AFTER 0003_auth_signup.sql.
--
-- handle_new_user() is only meant to run as the on_auth_user_created
-- trigger (Postgres already refuses to invoke a trigger function any other
-- way). The Supabase security advisor still flags it as directly callable
-- via RPC by anon/authenticated because PostgREST grants EXECUTE on public
-- functions by default. This revokes that grant so it no longer shows up
-- in `/rest/v1/rpc/handle_new_user` at all. The trigger itself is
-- unaffected — triggers run as the function owner regardless of grants.
-- ============================================================================

revoke execute on function public.handle_new_user() from public, anon, authenticated;
