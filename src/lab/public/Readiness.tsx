import { useEffect, useRef, useState } from 'react'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Zone from '@/components/Zone'
import { Cta } from '@/components/Rich'
import { useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { CATEGORIES, fmtScore, label } from '../labels'
import { getClient, track, type Band } from '../api'
import { Loading, Meter, Notice } from '../ui'
import '../lab.css'

type PQ = {
  id: string
  key: string
  category: string
  kind: 'single' | 'multi' | 'scale'
  prompt: string
  help: string | null
  weight: number
  lab_options: { key: string; label: string; score: number; is_na: boolean; sort: number }[]
}
type Version = { id: string; version: number; category_weights: Record<string, number>; bands: Band[] }

/** The published method applied to the preview questions only: area score =
 *  weighted average of its answered questions; overall = area weights over
 *  the areas that have a score. Same arithmetic as lab_score_core. */
function indicative(v: Version, qs: PQ[], answers: Record<string, string[]>) {
  const acc: Record<string, { s: number; w: number }> = {}
  for (const q of qs) {
    const chosen = q.lab_options.filter(o => answers[q.key]?.includes(o.key))
    if (!chosen.length || chosen.some(o => o.is_na)) continue
    const s = q.kind === 'multi' ? Math.min(100, chosen.reduce((a, o) => a + Number(o.score), 0)) : Math.max(...chosen.map(o => Number(o.score)))
    const a = (acc[q.category] ??= { s: 0, w: 0 })
    a.s += Number(q.weight) * s
    a.w += Number(q.weight)
  }
  let num = 0
  let den = 0
  const cats: Record<string, number> = {}
  for (const [c, w] of Object.entries(v.category_weights)) {
    if (acc[c]?.w) {
      cats[c] = acc[c].s / acc[c].w
      num += w * cats[c]
      den += w
    }
  }
  const overall = den ? Math.round((num / den) * 10) / 10 : null
  const band = overall == null ? null : (v.bands.find(b => overall >= b.min && overall < b.max + 1) ?? null)
  return { overall, band, cats }
}

/** /lab/market-readiness — six questions, an indicative read, nothing stored. */
export default function LabReadiness() {
  const result = useSection('lab-readiness', 'result')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'The Lab', path: '/lab' },
    { name: 'Readiness preview', path: '/lab/market-readiness' },
  ]
  usePage({ page: 'lab-readiness', path: '/lab/market-readiness', alternates: false, jsonLd: [crumbSchema(crumbs, 'en')] })

  const [state, setState] = useState<'intro' | 'loading' | 'asking' | 'done' | 'error'>('intro')
  const [v, setV] = useState<Version | null>(null)
  const [qs, setQs] = useState<PQ[]>([])
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [err, setErr] = useState('')
  const headRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (state === 'asking' || state === 'done') headRef.current?.focus()
  }, [state, i])

  async function begin() {
    setState('loading')
    try {
      const c = await getClient()
      if (!c) throw new Error('The preview isn’t connected to its database in this environment.')
      const vr = await c.from('lab_assessment_versions').select('id, version, category_weights, bands').eq('status', 'published').single()
      if (vr.error) throw new Error('The questionnaire is being updated. Try again in a minute.')
      const qr = await c
        .from('lab_questions')
        .select('id, key, category, kind, prompt, help, weight, applies_if, lab_options(key, label, score, is_na, sort)')
        .eq('version_id', vr.data.id)
        .eq('in_preview', true)
        .is('applies_if', null)
        .order('sort')
      if (qr.error || !qr.data?.length) throw new Error('The preview questions aren’t available right now.')
      setV(vr.data as Version)
      setQs((qr.data as unknown as PQ[]).map(q => ({ ...q, lab_options: [...q.lab_options].sort((a, b) => a.sort - b.sort) })))
      setI(0)
      setAnswers({})
      setState('asking')
    } catch (e) {
      setErr((e as Error).message)
      setState('error')
    }
  }

  const q = qs[i]
  const choose = (key: string) => {
    if (!q) return
    const cur = answers[q.key] ?? []
    const next = q.kind === 'multi' ? (cur.includes(key) ? cur.filter(k => k !== key) : [...cur, key]) : [key]
    setAnswers({ ...answers, [q.key]: next })
  }
  const next = () => {
    if (i < qs.length - 1) setI(i + 1)
    else {
      setState('done')
      const r = v ? indicative(v, qs, answers) : null
      track('preview_completed', r?.band ? { band: r.band.key } : {})
    }
  }
  const r = v && state === 'done' ? indicative(v, qs, answers) : null

  return (
    <main id="main" tabIndex={-1} className="lab">
      <PageHead page="lab-readiness" env="frost" crumbs={crumbs} />
      <Zone env="frost" className="wrap band lab-preview">
        {state === 'intro' || state === 'loading' || state === 'error' ? (
          <div className="lab-preview__intro">
            <ol role="list" className="lab-preview__facts t-small dim">
              <li>Six questions from the full assessment</li>
              <li>About two minutes</li>
              <li>Scored in your browser; nothing is sent or stored</li>
            </ol>
            <div className="actions lab-gap">
              <button type="button" className="btn" onClick={begin} disabled={state === 'loading'}>
                {state === 'loading' ? 'Loading questions…' : 'Start the preview'}
              </button>
            </div>
            {state === 'error' ? <Notice tone="error">{err}</Notice> : null}
            <noscript>
              <p className="t-small">The preview runs in your browser and needs JavaScript.</p>
            </noscript>
          </div>
        ) : null}

        {state === 'asking' && q ? (
          <div className="lab-q">
            <p className="label t-num" aria-live="polite">
              Question {i + 1} of {qs.length} · {label(CATEGORIES, q.category)}
            </p>
            <div className="lab-progress" aria-hidden="true">
              <span style={{ inlineSize: `${(i / qs.length) * 100}%` }} />
            </div>
            <fieldset className="lab-choices lab-gap">
              <legend>
                <h2 ref={headRef} tabIndex={-1} className="t-section lab-q__prompt">
                  {q.prompt}
                </h2>
              </legend>
              {q.help ? <p className="dim lab-q__help">{q.help}</p> : null}
              {q.kind === 'multi' ? <p className="t-caption dimmer">Choose all that apply.</p> : null}
              <div className="lab-choices__list">
                {q.lab_options.map(o => (
                  <label key={o.key} className="lab-choice lab-choice--big">
                    <input type={q.kind === 'multi' ? 'checkbox' : 'radio'} name={q.key} checked={answers[q.key]?.includes(o.key) ?? false} onChange={() => choose(o.key)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="actions lab-gap">
              <button type="button" className="btn" onClick={next} disabled={!answers[q.key]?.length}>
                {i < qs.length - 1 ? 'Next question' : 'See my indicative result'}
              </button>
              {i > 0 ? (
                <button type="button" className="link-q" onClick={() => setI(i - 1)}>
                  Back
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {state === 'done' && r ? (
          <div className="lab-preview__result">
            <p className="label">Indicative result · not stored</p>
            <div className="lab-specimen__head lab-gap-s">
              <span className="lab-figure t-num">{fmtScore(r.overall)}</span>
              <span>
                <h2 ref={headRef} tabIndex={-1} className="t-section">
                  {r.band?.label ?? 'Not enough answers to score'}
                </h2>
              </span>
            </div>
            {r.band?.summary ? <p className="t-lead dim lab-measure lab-gap-s">{r.band.summary}</p> : null}
            <ul role="list" className="lab-srows lab-gap">
              {CATEGORIES.filter(([k]) => k in r.cats).map(([k, l]) => (
                <li key={k} className="lab-srow">
                  <span className="lab-srow__label">{l}</span>
                  <Meter value={r.cats[k]} label={l} />
                  <span className="lab-srow__value t-num">{fmtScore(Math.round(r.cats[k]! * 10) / 10)}</span>
                </li>
              ))}
            </ul>
            <p className="t-small dimmer lab-gap-s lab-measure">
              Readiness bands are product-defined categories based on your answers. They describe preparation, not the chance of success.
            </p>
            {result ? (
              <div className="lab-preview__next lab-gap">
                <h3 className="t-title">{result.title}</h3>
                {result.body ? <p className="dim lab-measure">{result.body}</p> : null}
                <div className="actions lab-gap-s">
                  {result.ctaLabel ? (
                    <Cta url={result.ctaUrl} className="btn">
                      {result.ctaLabel}
                    </Cta>
                  ) : null}
                  <button type="button" className="link-q" onClick={begin}>
                    Start again
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        {state === 'loading' ? <Loading label="Loading questions" /> : null}
      </Zone>
    </main>
  )
}
