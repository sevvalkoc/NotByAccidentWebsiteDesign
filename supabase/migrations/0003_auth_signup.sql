-- ============================================================================
-- NOT BY ACCIDENT — SELF-SERVICE SIGN-UP, EMAIL VERIFICATION & APPROVAL
-- ============================================================================
-- Run this AFTER 0001_init.sql and 0002_seed.sql.
--
-- What this adds:
--   1. A `status` column on profiles ('pending' | 'approved' | 'suspended').
--      Existing rows are backfilled to 'approved' so nobody who already has
--      access loses it. New rows created by self-service sign-up default to
--      'pending' and need an admin to approve them before they can sign in
--      to the dashboard.
--   2. is_staff()/is_admin() now also require status = 'approved', so a
--      pending or suspended account cannot read/write staff-only tables even
--      if it also has role = 'admin'/'editor'.
--   3. A trigger on auth.users that auto-creates the matching profiles row
--      the moment someone verifies their email via the public sign-up form
--      (see src/admin/SignUp.tsx) — no more manual "add a profiles row"
--      step for that path. Accounts created directly in the Supabase
--      Dashboard still need a profiles row created by hand (see docs/CMS.md)
--      — that path is unaffected and still lands as 'approved'.
--
-- IMPORTANT — one manual step this migration cannot do for you: in the
-- Supabase Dashboard, go to Authentication → Providers → Email and make
-- sure "Confirm email" is ON. That is what makes Supabase actually send the
-- verification email when someone signs up.
-- ============================================================================

alter table public.profiles
  add column if not exists status text not null default 'approved'
    check (status in ('pending', 'approved', 'suspended'));

update public.profiles set status = 'approved' where status is null;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor') and status = 'approved'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin' and status = 'approved'
  );
$$;

-- Self-service sign-ups (src/admin/SignUp.tsx) land here as a pending
-- editor. An admin approves them from Admin → Users. Dashboard-created
-- users are unaffected: this only fires on new auth.users rows, and admins
-- creating a profiles row by hand for those still choose the status.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, role, status)
  values (new.id, new.email, 'editor', 'pending')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
