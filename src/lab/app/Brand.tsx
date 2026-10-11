import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSection } from '@/content'
import { q, reloadBoot, selectBrand, uploadLogo, logoUrl, useBrandId, useLabSession, type Brand } from '../api'
import {
  BUDGETS,
  CAPACITY,
  CHANNELS,
  COUNTRIES,
  DISTRIBUTION,
  INDUSTRIES,
  LANGUAGES,
  MARKETS,
  OBJECTIVES,
  OBSTACLES,
  OFFERINGS,
  PRICE_TIERS,
  SEGMENTS,
  STAGES,
  TIMELINES,
} from '../labels'
import { Choices, Loading, Notice, SelectField, TextField, useAction, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

type Draft = Omit<Brand, 'id' | 'created_at' | 'updated_at' | 'logo_path'>
const EMPTY: Draft = {
  name: '',
  website: null,
  social_url: null,
  origin_country: null,
  industry: null,
  product_category: null,
  offering: 'physical',
  description: null,
  customer_segments: [],
  price_tier: null,
  typical_price_eur: null,
  sales_channels: [],
  current_markets: [],
  sales_stage: null,
  capacity: null,
  target_markets: [],
  entry_timeline: null,
  primary_objective: null,
  distribution_model: null,
  budget_range: null,
  obstacles: [],
  languages: [],
}
const STEPS = ['Identity', 'Commercial', 'Expansion'] as const
const URL_RE = /^https?:\/\/\S+$/i

function validate(step: number, d: Draft): string {
  if (step === 0) {
    if (!d.name.trim()) return 'Give the brand a name.'
    if (!d.industry) return 'Choose the closest industry.'
    if (d.website && !URL_RE.test(d.website)) return 'The website should start with https://'
    if (d.social_url && !URL_RE.test(d.social_url)) return 'The social link should start with https://'
  }
  if (step === 2 && !d.target_markets.length) return 'Choose at least one market you’re considering.'
  return ''
}

/** Turns empty strings into NULL so CHECK constraints see "not answered". */
const clean = (d: Draft) =>
  Object.fromEntries(Object.entries(d).map(([k, v]) => [k, typeof v === 'string' ? (v.trim() === '' ? null : v.trim()) : v])) as Draft

export default function BrandScreen() {
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const session = useLabSession()
  const currentId = useBrandId()
  const creating = params.get('new') === '1' || !currentId
  const id = creating ? null : currentId
  // remembered from the first render: still the onboarding flow after the brand row exists
  const [wizard] = useState(creating)
  const intro = useSection('lab-app', 'onboarding')
  useAppPage(creating ? 'New brand' : 'Brand profile', '/lab/brand')

  const loaded = useLoad(() => (id ? q<Brand>(c => c.from('lab_brands').select('*').eq('id', id).single()) : Promise.resolve(null)), [id])
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [brandId, setBrandId] = useState<string | null>(id)
  const [logoPath, setLogoPath] = useState<string | null>(null)
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [step, setStep] = useState(Number(params.get('step') ?? 0) || 0)
  const [saved, setSaved] = useState('')
  const a = useAction()

  useEffect(() => {
    setBrandId(id)
    if (loaded.data) {
      const { id: _i, created_at: _c, updated_at: _u, logo_path, ...rest } = loaded.data as Brand & { created_by?: string }
      delete (rest as Record<string, unknown>).created_by
      setDraft({ ...EMPTY, ...rest })
      setLogoPath(logo_path)
    } else if (!id) {
      setDraft(EMPTY)
      setLogoPath(null)
    }
  }, [loaded.data, id])
  useEffect(() => {
    let live = true
    void logoUrl(logoPath).then(u => live && setLogoSrc(u))
    return () => {
      live = false
    }
  }, [logoPath])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setSaved('')
    setDraft(d => ({ ...d, [k]: v }))
  }
  const str = (k: keyof Draft) => (draft[k] as string | null) ?? ''

  /** Saves what's there (create on the first step, update afterwards). */
  async function save(goTo?: number) {
    const problem = validate(step, draft)
    if (problem) return a.setError(problem)
    const ok = await a.run(async () => {
      const row = clean(draft)
      if (!brandId) {
        const b = await q<Brand>(c => c.from('lab_brands').insert(row).select('id').single())
        setBrandId(b.id)
        selectBrand(b.id)
        await reloadBoot()
        setParams({ step: String(goTo ?? step) }, { replace: true })
      } else {
        await q(c => c.from('lab_brands').update(row).eq('id', brandId))
        if (draft.name !== loaded.data?.name) await reloadBoot()
      }
    })
    if (!ok) return
    setSaved('Saved.')
    if (goTo != null) {
      if (goTo >= STEPS.length) navigate(wizard ? '/lab/assessment' : '/lab/dashboard')
      else setStep(goTo)
    }
  }

  async function onLogo(file: File | undefined) {
    if (!file || !brandId) return
    await a.run(async () => {
      const path = await uploadLogo(brandId, file)
      await q(c => c.from('lab_brands').update({ logo_path: path }).eq('id', brandId))
      setLogoPath(path)
      setSaved('Logo uploaded.')
    })
  }

  const targetsLeft = useMemo(() => MARKETS.filter(([k]) => k !== draft.origin_country), [draft.origin_country])
  if (id && loaded.loading && !loaded.data) return <Loading />
  if (loaded.error) return <Notice tone="error">{loaded.error}</Notice>
  const isOwner = session.boot?.brands.find(b => b.id === brandId)?.role !== 'editor'

  return (
    <div className="lab-screen lab-narrow">
      <AppHead eyebrow={creating && !brandId ? 'New brand' : 'Brand profile'} title={creating && !brandId ? (intro?.title ?? 'Tell us about your brand') : draft.name || 'Brand profile'}>
        {wizard && intro?.body ? <p className="dim lab-measure">{intro.body}</p> : null}
      </AppHead>

      <ol role="list" className="lab-stepper" aria-label="Steps">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button type="button" className="link-q" aria-current={i === step ? 'step' : undefined} disabled={!brandId && i > 0} onClick={() => setStep(i)}>
              <span className="t-num dimmer">{String(i + 1).padStart(2, '0')}</span> {s}
            </button>
          </li>
        ))}
      </ol>

      <form
        className="form lab-form lab-gap"
        onSubmit={e => {
          e.preventDefault()
          void save(step + 1)
        }}
      >
        {step === 0 ? (
          <>
            <TextField label="Brand name" value={draft.name} onChange={v => set('name', v)} required maxLength={120} autoComplete="organization" />
            <div className="form__row">
              <TextField label="Website" type="url" value={str('website')} onChange={v => set('website', v)} placeholder="https://" inputMode="url" />
              <TextField label="Instagram or other social link" type="url" value={str('social_url')} onChange={v => set('social_url', v)} placeholder="https://" inputMode="url" />
            </div>
            <div className="form__row">
              <SelectField label="Where the brand is based" value={str('origin_country')} onChange={v => set('origin_country', v || null)} options={COUNTRIES} />
              <SelectField label="Industry" value={str('industry')} onChange={v => set('industry', v || null)} options={INDUSTRIES} required />
            </div>
            <TextField label="Product category" value={str('product_category')} onChange={v => set('product_category', v)} help="In your own words, e.g. “silver jewellery”, “natural skincare”. Used to match partners’ assortments." maxLength={120} />
            <Choices legend="What you sell" options={OFFERINGS} value={[draft.offering]} onChange={v => set('offering', v[0] ?? 'physical')} />
            <TextField label="Short description" value={str('description')} onChange={v => set('description', v)} multiline maxLength={800} help="Two or three sentences. Shared with a partner only if you request an introduction and it’s approved." />
            {brandId ? (
              <div className="field">
                <label htmlFor="lab-logo">Logo</label>
                <div className="lab-logo">
                  {logoSrc ? <img src={logoSrc} alt={`${draft.name} logo`} width={72} height={72} /> : <span className="lab-logo__empty" aria-hidden="true" />}
                  <input id="lab-logo" type="file" accept="image/png,image/jpeg,image/webp" onChange={e => void onLogo(e.target.files?.[0])} aria-describedby="lab-logo-h" />
                </div>
                <p id="lab-logo-h" className="help">
                  PNG, JPEG or WebP, up to 1 MB. Stored privately.
                </p>
              </div>
            ) : null}
          </>
        ) : null}

        {step === 1 ? (
          <>
            <Choices legend="Who buys from you" help="Choose up to three." options={SEGMENTS} value={draft.customer_segments} onChange={v => set('customer_segments', v)} multiple max={3} columns />
            <div className="form__row">
              <SelectField label="Price positioning" value={str('price_tier')} onChange={v => set('price_tier', v || null)} options={PRICE_TIERS} />
              <TextField
                label="Typical retail price (EUR)"
                type="number"
                inputMode="decimal"
                value={draft.typical_price_eur == null ? '' : String(draft.typical_price_eur)}
                onChange={v => set('typical_price_eur', v === '' ? null : Math.max(0, Number(v)))}
              />
            </div>
            <Choices legend="Where you sell today" options={CHANNELS} value={draft.sales_channels} onChange={v => set('sales_channels', v)} multiple columns />
            <Choices legend="Markets where you already sell" help="Including your home market." options={COUNTRIES} value={draft.current_markets} onChange={v => set('current_markets', v)} multiple columns />
            <div className="form__row">
              <SelectField label="Sales stage" value={str('sales_stage')} onChange={v => set('sales_stage', v || null)} options={STAGES} />
              <SelectField label="Production capacity" value={str('capacity')} onChange={v => set('capacity', v || null)} options={CAPACITY} />
            </div>
            <Choices legend="Languages your materials exist in" options={LANGUAGES} value={draft.languages} onChange={v => set('languages', v)} multiple columns />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <Choices legend="Markets you’re considering" help="The markets The Lab covers today. Choose any; you compare up to three at a time." options={targetsLeft} value={draft.target_markets} onChange={v => set('target_markets', v)} multiple columns required />
            <div className="form__row">
              <SelectField label="When you’d like to enter" value={str('entry_timeline')} onChange={v => set('entry_timeline', v || null)} options={TIMELINES} />
              <SelectField label="Main objective" value={str('primary_objective')} onChange={v => set('primary_objective', v || null)} options={OBJECTIVES} />
            </div>
            <div className="form__row">
              <SelectField label="Preferred distribution" value={str('distribution_model')} onChange={v => set('distribution_model', v || null)} options={DISTRIBUTION} />
              <SelectField label="Budget for the first year abroad" value={str('budget_range')} onChange={v => set('budget_range', v || null)} options={BUDGETS} />
            </div>
            <Choices legend="What feels hardest" help="Choose up to three." options={OBSTACLES} value={draft.obstacles} onChange={v => set('obstacles', v)} multiple max={3} columns />
          </>
        ) : null}

        <div className="actions">
          <button type="submit" className="btn" disabled={a.busy}>
            {a.busy ? 'Saving…' : step < STEPS.length - 1 ? 'Save and continue' : wizard ? 'Save and start the assessment' : 'Save'}
          </button>
          {step > 0 ? (
            <button type="button" className="link-q" onClick={() => setStep(step - 1)}>
              Back
            </button>
          ) : null}
          {brandId && step < STEPS.length - 1 ? (
            <button type="button" className="link-q dimmer" onClick={() => void save()}>
              Save for now
            </button>
          ) : null}
          <span className="t-small dimmer" role="status">
            {saved}
          </span>
        </div>
        <Notice tone="error">{a.error}</Notice>
        {!isOwner ? <p className="t-caption dimmer">You’re an editor of this brand; only its owner can delete it.</p> : null}
      </form>
    </div>
  )
}
