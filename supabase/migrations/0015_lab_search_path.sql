-- 0015 · THE LAB — pin search_path on the small helper functions
-- (Supabase security advisor: function_search_path_mutable). No behaviour change.
alter function public.lab_touch() set search_path = public;
alter function public.lab_in_eu(text) set search_path = public;
alter function public.lab_label(text) set search_path = public;
alter function public.lab_condition_holds(jsonb, jsonb, jsonb) set search_path = public;
alter function public.lab_tier_rank(text) set search_path = public;
