import Zone from '@/components/Zone'
import { Breadcrumbs, crumbSchema } from '@/components/PageHead'
import { Cta, Emph, plain } from '@/components/Rich'
import { usePageMeta, useSection } from '@/content'
import { usePage } from '@/hooks/usePage'
import { Meter } from '../ui'
import { fmtScore } from '../labels'
import { track } from '../api'
import '../lab.css'

type ExampleExtra = { overall?: number; band?: string; categories?: { label: string; score: number }[]; match?: { name: string; score: number; text: string } }

/** /lab — what The Lab is, in the studio's voice. Every block is a section
 *  of the "The Lab" page in Admin → The Lab → Content. */
export default function LabLanding() {
  const meta = usePageMeta('lab')
  const hero = useSection('lab', 'hero')
  const problem = useSection('lab', 'problem')
  const caps = useSection('lab', 'capabilities')
  const example = useSection('lab', 'example')
  const method = useSection('lab', 'method')
  const steps = useSection('lab', 'steps')
  const studio = useSection('lab', 'studio')
  const faq = useSection('lab', 'faq')
  const cta = useSection('lab', 'cta')
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'The Lab', path: '/lab' },
  ]
  usePage({
    page: 'lab',
    path: '/lab',
    alternates: false,
    jsonLd: [
      crumbSchema(crumbs, 'en'),
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'The Lab by Not by Accident',
        url: 'https://notbyaccident.com/lab',
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: meta.description,
        provider: { '@id': 'https://notbyaccident.com/#organization' },
      },
      ...(faq?.items?.length
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faq.items.map(i => ({ '@type': 'Question', name: i.title, acceptedAnswer: { '@type': 'Answer', text: i.body } })),
            },
          ]
        : []),
    ],
  })
  const ex = (example?.extra ?? {}) as ExampleExtra
  const cta2 = hero?.extra as { cta2Label?: string; cta2Url?: string } | undefined

  return (
    <main id="main" tabIndex={-1} className="lab">
      {hero ? (
        <Zone as="header" env="void" className="lab-hero">
          <div className="wrap">
            <div className="phead__top">
              <Breadcrumbs items={crumbs} />
              {hero.eyebrow ? <span className="label">{hero.eyebrow}</span> : null}
            </div>
            <h1 className="t-display lab-hero__title">
              <Emph text={hero.title} />
            </h1>
            <div className="lab-hero__foot">
              {hero.subtitle ? <p className="t-lead dim lab-hero__sub">{hero.subtitle}</p> : null}
              <div className="actions">
                {hero.ctaLabel ? (
                  <span onClick={() => track('landing_cta', { cta: 'signup' })}>
                    <Cta url={hero.ctaUrl} className="btn">
                      {hero.ctaLabel}
                    </Cta>
                  </span>
                ) : null}
                {cta2?.cta2Label ? (
                  <span onClick={() => track('landing_cta', { cta: 'preview' })}>
                    <Cta url={cta2.cta2Url} className="link-q go">
                      {cta2.cta2Label}
                    </Cta>
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </Zone>
      ) : null}

      {problem ? (
        <Zone env="frost" className="wrap band" labelledBy="lab-problem">
          <div className="split">
            <p className="label">{problem.eyebrow}</p>
            <div>
              <h2 id="lab-problem" className="t-section">
                <Emph text={problem.title} />
              </h2>
              {problem.body ? <p className="t-lead dim lab-measure lab-gap">{problem.body}</p> : null}
            </div>
          </div>
        </Zone>
      ) : null}

      {caps?.items?.length ? (
        <Zone env="frost" className="wrap band" labelledBy="lab-caps">
          <header className="lab-sechead">
            <p className="label">{caps.eyebrow}</p>
            <h2 id="lab-caps" className="t-section">
              <Emph text={caps.title} />
            </h2>
          </header>
          <ol role="list" className="lab-four">
            {caps.items.map((c, i) => (
              <li key={c.title}>
                <span className="t-caption dimmer t-num">{c.meta || String(i + 1).padStart(2, '0')}</span>
                <h3 className="t-title">{c.title}</h3>
                <p className="dim">{c.body}</p>
              </li>
            ))}
          </ol>
        </Zone>
      ) : null}

      {example ? (
        <Zone env="mineral" className="band" labelledBy="lab-example">
          <div className="wrap split">
            <div>
              <p className="label">{example.eyebrow}</p>
              <h2 id="lab-example" className="t-section lab-gap-s">
                <Emph text={example.title} />
              </h2>
              {example.body ? <p className="t-small dim lab-gap-s">{example.body}</p> : null}
            </div>
            <figure className="lab-specimen" aria-label="Illustrative example of a readiness result">
              <div className="lab-specimen__head">
                <span className="lab-figure t-num">{fmtScore(ex.overall)}</span>
                <span>
                  <span className="label">Readiness · illustrative</span>
                  <span className="t-title">{ex.band}</span>
                </span>
              </div>
              <ul role="list" className="lab-srows">
                {(ex.categories ?? []).map(c => (
                  <li key={c.label} className="lab-srow">
                    <span className="lab-srow__label">{c.label}</span>
                    <Meter value={c.score} label={c.label} />
                    <span className="lab-srow__value t-num">{c.score}</span>
                  </li>
                ))}
              </ul>
              {ex.match ? (
                <div className="lab-specimen__match">
                  <span className="label">Match · illustrative</span>
                  <p className="lab-specimen__row">
                    <span className="t-title">{ex.match.name}</span>
                    <span className="lab-figure lab-figure--s t-num">{ex.match.score}</span>
                  </p>
                  <p className="t-small dim">{ex.match.text}</p>
                </div>
              ) : null}
              <figcaption className="t-caption dimmer">{plain(example.body)}</figcaption>
            </figure>
          </div>
        </Zone>
      ) : null}

      {method ? (
        <Zone env="frost" className="wrap band" labelledBy="lab-method">
          <div className="split">
            <p className="label">{method.eyebrow}</p>
            <div>
              <h2 id="lab-method" className="t-section">
                <Emph text={method.title} />
              </h2>
              {method.body ? <p className="t-lead dim lab-measure lab-gap">{method.body}</p> : null}
              {method.ctaLabel ? (
                <p className="lab-gap">
                  <Cta url={method.ctaUrl} className="link-q go">
                    {method.ctaLabel}
                  </Cta>
                </p>
              ) : null}
            </div>
          </div>
        </Zone>
      ) : null}

      {steps?.items?.length ? (
        <Zone env="cool" className="band" labelledBy="lab-steps">
          <div className="wrap split">
            <div>
              <p className="label">{steps.eyebrow}</p>
              <h2 id="lab-steps" className="t-section lab-gap-s">
                <Emph text={steps.title} />
              </h2>
            </div>
            <ol role="list" className="lab-steps">
              {steps.items.map((s, i) => (
                <li key={s.title}>
                  <span className="t-num dimmer">{String(i + 1).padStart(2, '0')}</span>
                  <span className="t-title">{s.title}</span>
                  <span className="dim">{s.body}</span>
                </li>
              ))}
            </ol>
          </div>
        </Zone>
      ) : null}

      {studio ? (
        <Zone env="void" className="band" labelledBy="lab-studio">
          <div className="wrap split">
            <p className="label">{studio.eyebrow}</p>
            <div>
              <h2 id="lab-studio" className="t-section">
                <Emph text={studio.title} />
              </h2>
              {studio.body ? <p className="t-lead dim lab-measure lab-gap">{studio.body}</p> : null}
              {studio.ctaLabel ? (
                <p className="lab-gap">
                  <Cta url={studio.ctaUrl} className="link-q go">
                    {studio.ctaLabel}
                  </Cta>
                </p>
              ) : null}
            </div>
          </div>
        </Zone>
      ) : null}

      {faq?.items?.length ? (
        <Zone env="frost" className="wrap band" labelledBy="lab-faq">
          <div className="split">
            <div>
              <p className="label">{faq.eyebrow}</p>
              <h2 id="lab-faq" className="t-section lab-gap-s">
                <Emph text={faq.title} />
              </h2>
            </div>
            <div className="lab-faq">
              {faq.items.map(i => (
                <details key={i.title}>
                  <summary className="t-title">{i.title}</summary>
                  <p className="dim lab-measure">{i.body}</p>
                </details>
              ))}
            </div>
          </div>
        </Zone>
      ) : null}

      {cta ? (
        <Zone env="signal" className="band lab-cta" labelledBy="lab-cta">
          <div className="wrap">
            <h2 id="lab-cta" className="t-display">
              <Emph text={cta.title} />
            </h2>
            <div className="lab-cta__foot">
              {cta.body ? <p className="t-lead">{cta.body}</p> : null}
              {cta.ctaLabel ? (
                <Cta url={cta.ctaUrl} className="btn">
                  {cta.ctaLabel}
                </Cta>
              ) : null}
            </div>
          </div>
        </Zone>
      ) : null}
    </main>
  )
}
