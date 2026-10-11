import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Link from '@/components/Link'
import { useSection } from '@/content'
import { q, rpc, useBrandId, type Brand, type MarketFitResult } from '../api'
import { LANGUAGES, MARKETS, fmtDate, fmtScore, labels, marketName } from '../labels'
import { EvidenceTag, Loading, Meter, Notice, Tag, useAction, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

const CONFIDENCE: Record<string, string> = { unverified: 'Basic facts only', partial: 'Partly verified', verified: 'Verified profile' }

export default function Markets() {
  const brandId = useBrandId()
  const [params, setParams] = useSearchParams()
  const note = useSection('lab-app', 'markets_note')
  useAppPage('Compare markets', '/lab/markets')
  const brand = useLoad(() => (brandId ? q<Brand>(c => c.from('lab_brands').select('*').eq('id', brandId).single()) : Promise.resolve(null)), [brandId])
  const [picked, setPicked] = useState<string[]>([])
  const [fit, setFit] = useState<MarketFitResult | null>(null)
  const a = useAction()

  useEffect(() => {
    const fromUrl = (params.get('m') ?? '').split(',').filter(c => MARKETS.some(([k]) => k === c))
    const initial = fromUrl.length ? fromUrl : (brand.data?.target_markets ?? []).slice(0, 3)
    setPicked(initial.slice(0, 3))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.data])

  useEffect(() => {
    if (!brandId || !picked.length) return setFit(null)
    void a.run(async () => setFit(await rpc<MarketFitResult>('lab_market_fit', { p_brand: brandId, p_codes: picked })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId, picked.join(',')])

  const toggle = (code: string) => {
    const next = picked.includes(code) ? picked.filter(c => c !== code) : picked.length >= 3 ? picked : [...picked, code]
    setPicked(next)
    setParams(next.length ? { m: next.join(',') } : {}, { replace: true })
  }

  if (brand.loading && !brand.data) return <Loading />
  return (
    <div className="lab-screen">
      <AppHead eyebrow="Compare" title="Markets, side by side">
        {note?.body ? <p className="dim lab-measure">{note.body}</p> : null}
      </AppHead>

      <fieldset className="lab-choices">
        <legend className="lab-choices__legend">Choose up to three markets</legend>
        <div className="lab-choices__list lab-choices__list--cols">
          {MARKETS.map(([k, l]) => (
            <label key={k} className="lab-choice">
              <input type="checkbox" checked={picked.includes(k)} onChange={() => toggle(k)} disabled={!picked.includes(k) && picked.length >= 3} />
              <span>
                {l}
                {brand.data?.target_markets.includes(k) ? <span className="dimmer"> · considering</span> : null}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Notice tone="error">{a.error}</Notice>
      {a.busy && !fit ? <Loading label="Comparing" /> : null}

      {fit ? (
        <>
          {!fit.readiness ? (
            <Notice>
              Without a readiness result there isn’t enough to score market fit. <Link to="/lab/assessment" className="link">Take the assessment</Link> and the scores appear here.
            </Notice>
          ) : null}
          {fit.ranking ? <p className="t-small dim lab-gap lab-measure">{fit.ranking.possible ? `Ranking: ${fit.ranking.order.map(marketName).join(' → ')}. ${fit.ranking.reason}` : fit.ranking.reason}</p> : null}
          <div className="lab-compare lab-gap" data-count={fit.markets.length}>
            {fit.markets.map(m => (
              <article key={m.code} className="lab-compare__col" aria-labelledby={`mk-${m.code}`}>
                <header className="lab-compare__head">
                  <h2 id={`mk-${m.code}`} className="t-title">
                    {m.name}
                  </h2>
                  <span className="lab-figure lab-figure--s t-num">{m.score == null ? '—' : fmtScore(m.score)}</span>
                  <span className="t-caption dimmer">{m.score == null ? 'Not enough information to score' : 'Market-fit score'}</span>
                </header>

                <h3 className="label lab-gap">What the score is made of</h3>
                <ul role="list" className="lab-factors">
                  {m.factors.map(f => (
                    <li key={f.key}>
                      <span className="lab-factors__top">
                        <span>{f.label}</span>
                        <EvidenceTag kind={f.evidence} />
                      </span>
                      <Meter value={f.value} label={f.label} compact />
                      <span className="t-caption dimmer">
                        {f.note} · weight {f.weight}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="label lab-gap">Recorded facts</h3>
                <dl className="lab-facts lab-gap-s">
                  <div>
                    <dt className="t-caption dimmer">Profile</dt>
                    <dd>
                      <Tag tone={m.profile.confidence === 'verified' ? 'accent' : 'quiet'}>{CONFIDENCE[m.profile.confidence] ?? m.profile.confidence}</Tag>
                      {m.profile.last_verified_at ? <span className="t-caption dimmer"> checked {fmtDate(m.profile.last_verified_at)}</span> : null}
                      {m.profile.outdated ? <Tag tone="warn">May be outdated</Tag> : null}
                    </dd>
                  </div>
                  <div>
                    <dt className="t-caption dimmer">Customs</dt>
                    <dd>{m.profile.eu_member ? 'EU single market' : 'Outside the EU customs union'}</dd>
                  </div>
                  <div>
                    <dt className="t-caption dimmer">Currency</dt>
                    <dd>{m.profile.currency ?? '—'}</dd>
                  </div>
                  <div>
                    <dt className="t-caption dimmer">Working languages</dt>
                    <dd>{labels(LANGUAGES, m.profile.languages).join(', ') || '—'}</dd>
                  </div>
                </dl>
                {m.profile.overview ? <p className="t-small lab-gap-s">{m.profile.overview}</p> : null}
                {m.profile.consumer_notes ? <p className="t-small dim lab-gap-s">{m.profile.consumer_notes}</p> : null}

                {m.considerations.length ? (
                  <>
                    <h3 className="label lab-gap">Considerations</h3>
                    <ul role="list" className="lab-rows lab-gap-s">
                      {m.considerations.map((c, i) => (
                        <li key={i}>
                          <span className="lab-factors__top">
                            <span className="t-small">{c.label}</span>
                            <EvidenceTag kind={c.evidence} />
                          </span>
                          <span className="t-small dim">{c.text}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {m.missing.length ? (
                  <>
                    <h3 className="label lab-gap">Missing information</h3>
                    <ul role="list" className="lab-list lab-gap-s t-small dim">
                      {m.missing.map(x => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {m.next_steps.length ? (
                  <>
                    <h3 className="label lab-gap">Next steps</h3>
                    <ul role="list" className="lab-list lab-gap-s t-small">
                      {m.next_steps.map(x => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </>
                ) : null}

                <h3 className="label lab-gap">Sources</h3>
                {m.sources.length ? (
                  <ul role="list" className="lab-rows lab-gap-s">
                    {m.sources.map(s => (
                      <li key={s.url}>
                        <a href={s.url} className="link t-small" target="_blank" rel="noopener noreferrer">
                          {s.title}
                        </a>
                        <span className="t-caption dimmer">
                          {[s.publisher, s.accessed_on ? `accessed ${fmtDate(s.accessed_on)}` : null].filter(Boolean).join(' · ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="t-small dim lab-gap-s">No sources recorded for this market yet.</p>
                )}
                <p className="lab-gap">
                  <Link to={`/lab/matches?country=${m.code}`} className="link-q go t-small">
                    Partners for {m.name}
                  </Link>
                </p>
              </article>
            ))}
          </div>
        </>
      ) : !picked.length ? (
        <p className="dim lab-gap">Choose a market to see how your brand fits it.</p>
      ) : null}
    </div>
  )
}
