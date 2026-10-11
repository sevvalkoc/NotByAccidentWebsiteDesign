import { useEffect, useState } from 'react'
import PageHead, { crumbSchema } from '@/components/PageHead'
import Zone from '@/components/Zone'
import { Cta, Emph } from '@/components/Rich'
import { useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { CATEGORIES } from '../labels'
import { getClient, type Band } from '../api'
import { Meter } from '../ui'
import '../lab.css'

/* What the page shows before the live configuration has loaded (and what a
   prerendered page carries). These are the initial values of migration
   0013; the live values replace them as soon as the database answers. */
const INITIAL = {
  version: null as number | null,
  weights: { brand: 15, pmf: 20, commercial: 15, operations: 20, partnership: 15, strategy: 15 } as Record<string, number>,
  bands: [
    { key: 'foundation', min: 0, max: 39, label: 'Foundation stage' },
    { key: 'early_validation', min: 40, max: 59, label: 'Early validation stage' },
    { key: 'pilot_ready', min: 60, max: 79, label: 'Pilot-ready potential' },
    { key: 'advanced', min: 80, max: 100, label: 'Advanced preparation' },
  ] as Band[],
  matching: { category: 25, geography: 20, price: 15, segment: 15, distribution: 15, readiness: 10 } as Record<string, number>,
  matchingVersion: null as number | null,
  minScore: 40,
}
const CRITERIA: Record<string, string> = {
  category: 'Product category',
  geography: 'Target geography',
  price: 'Price positioning',
  segment: 'Customer segment',
  distribution: 'Distribution model',
  readiness: 'Commercial readiness',
}

/** /lab/how-it-works — the methodology, with the live weights. */
export default function LabHow() {
  const readiness = useSection('lab-how', 'readiness')
  const bands = useSection('lab-how', 'bands')
  const market = useSection('lab-how', 'market')
  const matching = useSection('lab-how', 'matching')
  const limits = useSection('lab-how', 'limits')
  const cta = useSection('lab-how', 'cta')
  const [cfg, setCfg] = useState(INITIAL)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'The Lab', path: '/lab' },
    { name: 'How it works', path: '/lab/how-it-works' },
  ]
  usePage({
    page: 'lab-how',
    path: '/lab/how-it-works',
    alternates: false,
    jsonLd: [crumbSchema(crumbs, 'en')],
  })

  useEffect(() => {
    let live = true
    ;(async () => {
      const c = await getClient()
      if (!c) return
      const [v, m] = await Promise.all([
        c.from('lab_assessment_versions').select('version, category_weights, bands').eq('status', 'published').maybeSingle(),
        c.from('lab_matching_configs').select('version, weights, min_score').eq('active', true).maybeSingle(),
      ])
      if (!live) return
      setCfg(prev => ({
        ...prev,
        ...(v.data ? { version: v.data.version as number, weights: v.data.category_weights as Record<string, number>, bands: v.data.bands as Band[] } : {}),
        ...(m.data ? { matching: m.data.weights as Record<string, number>, matchingVersion: m.data.version as number, minScore: m.data.min_score as number } : {}),
      }))
    })().catch(() => {})
    return () => {
      live = false
    }
  }, [])

  return (
    <main id="main" tabIndex={-1} className="lab">
      <PageHead page="lab-how" env="frost" crumbs={crumbs} />

      {readiness ? (
        <Zone env="frost" className="wrap band" labelledBy="how-readiness">
          <div className="split">
            <h2 id="how-readiness" className="label sticky-label">
              {readiness.title}
            </h2>
            <div>
              <p className="t-lead lab-measure">{readiness.body}</p>
              <h3 className="label lab-gap">
                Area weights{cfg.version ? ` · questionnaire version ${cfg.version}` : ''}
              </h3>
              <ul role="list" className="lab-srows lab-gap-s">
                {CATEGORIES.map(([k, l]) => (
                  <li key={k} className="lab-srow">
                    <span className="lab-srow__label">{l}</span>
                    <Meter value={(cfg.weights[k] ?? 0) * 4} label={`${l} weight`} />
                    <span className="lab-srow__value t-num">{cfg.weights[k] ?? 0}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Zone>
      ) : null}

      {bands ? (
        <Zone env="mineral" className="band" labelledBy="how-bands">
          <div className="wrap split">
            <h2 id="how-bands" className="label sticky-label">
              {bands.title}
            </h2>
            <div>
              {bands.body ? <p className="dim lab-measure">{bands.body}</p> : null}
              <ol role="list" className="lab-bands lab-gap">
                {cfg.bands.map(b => (
                  <li key={b.key}>
                    <span className="t-num lab-bands__range">
                      {b.min}–{b.max}
                    </span>
                    <span className="t-title">{b.label}</span>
                    {b.summary ? <span className="dim t-small">{b.summary}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Zone>
      ) : null}

      {market ? (
        <Zone env="frost" className="wrap band" labelledBy="how-market">
          <div className="split">
            <h2 id="how-market" className="label sticky-label">
              {market.title}
            </h2>
            <p className="t-lead lab-measure">{market.body}</p>
          </div>
        </Zone>
      ) : null}

      {matching ? (
        <Zone env="frost" className="wrap band" labelledBy="how-matching">
          <div className="split">
            <h2 id="how-matching" className="label sticky-label">
              {matching.title}
            </h2>
            <div>
              <p className="t-lead lab-measure">{matching.body}</p>
              <h3 className="label lab-gap">
                Criteria weights{cfg.matchingVersion ? ` · version ${cfg.matchingVersion}` : ''}
              </h3>
              <ul role="list" className="lab-srows lab-gap-s">
                {Object.keys(CRITERIA).map(k => (
                  <li key={k} className="lab-srow">
                    <span className="lab-srow__label">{CRITERIA[k]}</span>
                    <Meter value={(cfg.matching[k] ?? 0) * 4} label={`${CRITERIA[k]} weight`} />
                    <span className="lab-srow__value t-num">{cfg.matching[k] ?? 0}%</span>
                  </li>
                ))}
              </ul>
              <p className="t-small dim lab-gap-s">
                Partners scoring below {cfg.minScore} are not shown. Score = Σ (weight × criterion score) ÷ Σ all weights; a criterion we can’t evaluate scores 0 and is listed as missing.
              </p>
            </div>
          </div>
        </Zone>
      ) : null}

      {limits?.items?.length ? (
        <Zone env="cool" className="band" labelledBy="how-limits">
          <div className="wrap split">
            <h2 id="how-limits" className="label sticky-label">
              {limits.title}
            </h2>
            <ul role="list" className="lab-steps">
              {limits.items.map(i => (
                <li key={i.title}>
                  <span aria-hidden="true" className="dimmer">
                    —
                  </span>
                  <span className="t-title">{i.title}</span>
                  <span className="dim">{i.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </Zone>
      ) : null}

      {cta ? (
        <Zone env="signal" className="band lab-cta" labelledBy="how-cta">
          <div className="wrap lab-cta__row">
            <h2 id="how-cta" className="t-section">
              <Emph text={cta.title} />
            </h2>
            {cta.ctaLabel ? (
              <Cta url={cta.ctaUrl} className="btn">
                {cta.ctaLabel}
              </Cta>
            ) : null}
          </div>
        </Zone>
      ) : null}
    </main>
  )
}

