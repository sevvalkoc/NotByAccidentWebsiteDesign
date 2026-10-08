/* Lead capture. Every form on the site writes to the same Supabase table the
   previous site used (`contact_submissions`), distinguished by `source`, so the
   admin inbox and any downstream automation keep working unchanged. */
export type LeadSource = 'newsletter' | 'newsletter-popup' | 'contact' | 'footer'

export type LeadResult = { ok: true } | { ok: false; reason: 'offline' | 'error' }

export async function submitLead(input: { email: string; name?: string; message?: string; source: LeadSource }): Promise<LeadResult> {
  const { supabase } = await import('@/lib/supabase')
  if (!supabase) return { ok: false, reason: 'offline' }
  const { error } = await supabase.from('contact_submissions').insert({
    email: input.email.trim(),
    name: input.name?.trim() || null,
    message: input.message?.trim() || null,
    source: input.source,
  })
  return error ? { ok: false, reason: 'error' } : { ok: true }
}
