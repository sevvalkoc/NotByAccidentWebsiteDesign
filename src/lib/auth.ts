import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/database.types'

export interface AuthState {
  loading: boolean
  session: Session | null
  profile: Profile | null
}

/** Current Supabase Auth session + the matching profiles row (role, name). */
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ loading: true, session: null, profile: null })

  useEffect(() => {
    if (!supabase) {
      setState({ loading: false, session: null, profile: null })
      return
    }
    let cancelled = false

    async function loadProfile(session: Session | null) {
      if (!session) {
        if (!cancelled) setState({ loading: false, session: null, profile: null })
        return
      }
      const { data } = await supabase!.from('profiles').select('*').eq('id', session.user.id).maybeSingle()
      if (!cancelled) setState({ loading: false, session, profile: (data as Profile) ?? null })
    }

    supabase.auth.getSession().then(({ data }) => loadProfile(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(s => ({ ...s, loading: true }))
      loadProfile(session)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  return state
}

export async function signIn(email: string, password: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured yet — see docs/CMS.md.' }
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (!error) return {}
  // Supabase's own wording ("Invalid login credentials") reads like a bug;
  // say what it means and what to do.
  if (error.code === 'invalid_credentials') return { error: 'That email and password don’t match. Check the password, or use “Forgot password?” below to set a new one.' }
  if (error.code === 'email_not_confirmed') return { error: 'This email isn’t confirmed yet. Open the link in the confirmation email first (check spam too).' }
  return { error: error.message }
}

/** Self-service sign-up. Supabase sends the verification email itself (Auth →
 *  Providers → Email → "Confirm email" must be ON in the dashboard). Once
 *  verified, the account still needs an admin to flip it to approved — see
 *  handle_new_user() in supabase/migrations/0003_auth_signup.sql. */
export async function signUp(email: string, password: string, fullName: string): Promise<{ error?: string; existing?: boolean }> {
  if (!supabase) return { error: 'Supabase is not configured yet — see docs/CMS.md.' }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${window.location.origin}/admin/login`,
    },
  })
  if (error) return { error: error.message }
  // For an email that already has an account Supabase answers "success"
  // without sending anything (so outsiders can't probe which emails exist).
  // It does return the user with no identities, which is how we can tell
  // the person signing up to sign in or reset the password instead of
  // waiting for an email that will never come.
  if (data.user && data.user.identities?.length === 0) return { existing: true }
  return {}
}

export async function requestPasswordReset(email: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured yet — see docs/CMS.md.' }
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/admin/reset-password`,
  })
  return error ? { error: error.message } : {}
}

/** Call once the user has landed on /admin/reset-password via the emailed
 *  recovery link — Supabase turns that link into a live session first. */
export async function updatePassword(newPassword: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Supabase is not configured yet — see docs/CMS.md.' }
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  return error ? { error: error.message } : {}
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

export function isStaff(profile: Profile | null): boolean {
  return (profile?.role === 'admin' || profile?.role === 'editor') && profile?.status === 'approved'
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === 'admin' && profile?.status === 'approved'
}

export function isPending(profile: Profile | null): boolean {
  return profile?.status === 'pending'
}

export function isSuspended(profile: Profile | null): boolean {
  return profile?.status === 'suspended'
}

/** Not used for admin gating (the DB has no idea about it) — just a UI label helper. */
export function roleLabel(profile: Profile | null): string {
  if (!profile) return ''
  return profile.role === 'admin' ? 'Admin' : 'Editor'
}
