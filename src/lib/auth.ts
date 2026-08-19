import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, supabaseReady } from '@/lib/supabase'
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
  return error ? { error: error.message } : {}
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}

export function isStaff(profile: Profile | null): boolean {
  return profile?.role === 'admin' || profile?.role === 'editor'
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.role === 'admin'
}

/** Not used for admin gating (the DB has no idea about it) — just a UI label helper. */
export function roleLabel(profile: Profile | null): string {
  if (!profile) return ''
  return profile.role === 'admin' ? 'Admin' : 'Editor'
}
