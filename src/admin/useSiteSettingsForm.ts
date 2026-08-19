import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { refreshSite } from '@/content'

export interface SiteSettingsForm {
  site_name: string
  site_description: string
  default_seo_title: string
  default_meta_description: string
  default_og_image_url: string
  domain: string
  language: string
  locale: string
  contact_email: string
  new_business_email: string
  press_email: string
  phone: string
  address_line1: string
  address_line2: string
  address_city: string
  address_postcode: string
  address_country: string
  registration_note: string
  hours: string
  social_links: { label: string; url: string }[]
}

const blank: SiteSettingsForm = {
  site_name: '', site_description: '', default_seo_title: '', default_meta_description: '', default_og_image_url: '',
  domain: '', language: 'en-GB', locale: 'en_GB', contact_email: '', new_business_email: '', press_email: '',
  phone: '', address_line1: '', address_line2: '', address_city: '', address_postcode: '', address_country: '',
  registration_note: '', hours: '', social_links: [],
}

/** Shared load/save for the site_settings singleton row (id = 1). */
export function useSiteSettingsForm() {
  const [form, setForm] = useState<SiteSettingsForm>(blank)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase.from('site_settings').select('*').eq('id', 1).maybeSingle().then(({ data }) => {
      if (data) setForm({ ...blank, ...(data as Partial<SiteSettingsForm>) })
      setLoading(false)
    })
  }, [])

  function set<K extends keyof SiteSettingsForm>(key: K, v: SiteSettingsForm[K]) {
    setForm(prev => ({ ...prev, [key]: v }))
    setSaved(false)
  }

  async function save() {
    if (!supabase) return
    setSaving(true)
    setError('')
    const { error } = await supabase.from('site_settings').update(form).eq('id', 1)
    setSaving(false)
    if (error) return setError(error.message)
    setSaved(true)
    refreshSite()
  }

  return { form, set, loading, saving, saved, error, save }
}
