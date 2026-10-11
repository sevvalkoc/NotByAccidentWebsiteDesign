import { useSearchParams } from 'react-router-dom'
import Link from '@/components/Link'
import { useSection } from '@/content'
import { q, useBrandId, type Recommendation, type Result } from '../api'
import { CATEGORIES, fmtDate, fmtScore, label } from '../labels'
import { Empty, Loading, Meter, Notice, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

export default function Results() {
  const brandId = useBrandId()
  const [params] = useSearchParams()
  const note = useSection('lab-app', 'results_note')
  useAppPage('Readiness result', '/lab/results')
  const history = useLoad(
    () => (brandId ? q<Result[]>(c => c.from('lab_results').select('*').eq('brand_id', brandId).order('computed_at', { ascending: false })) : Promise.resolve([])),
    [brandId],
  )
  const list = history.data ?? []
  const r = list.find(x => x.id === params.get('id')) ?? list[0]
  const prev = r ? list[list.indexOf(r) + 1] : undefined
  const recs = useLoad(
    () => (r ? q<Recommendation[]>(c => c.from('lab_result_recommendations').select('rule_key, title, body, category, priority, partner_types').eq('result_id', r.id).order('priority', { ascending: false })) : Promise.resolve([])),
    [r?.id],
  )

  if (history.loading && !history.data) return <Loading />
  if (history.error) return <Notice tone="error">{history.error}</Notice>
  if (!r)
    return (
      <div className="lab-screen">
        <AppHead eyebrow="Readiness" title="No result yet" />
        <Empty title="Take the assessment to see your result." body="About twenty questions across six areas.">
          <Link to="/lab/assessment" className="btn">
            Start the assessment
          </Link>
        </Empty>
      </div>
    )

  const band = r.bands.find(b => b.key === r.band_key)
  const contribs = r.contributions.filter(c => !c.na && c.score != null)
  const lifted = [...contribs].filter(c => (c.score ?? 0) >= 75).sort((a, b) => (b.score ?? 0) * b.weight - (a.score ?? 0) * a.weight).slice(0, 5)
  const held = [...contribs].filter(c => (c.score ?? 0) < 50).sort((a, b) => (a.score ?? 0) - (b.score ?? 0)).slice(0, 5)
  const na = r.contributions.filter(c => c.na)
  const sameVersion = prev && prev.version === r.version

  return (
    <div className="lab-screen">
      <AppHead eyebrow={`Readiness · ${fmtDate(r.computed_at)}`} title="Your market readiness">
        <Link to="/lab/assessment" className="link-q t-small">
          Retake the assessment
        </Link>
      </AppHead>

      <section className="lab-result" aria-labelledby="overall">
        <div className="lab-specimen__head">
          <span className="lab-figure lab-figure--l t-num" aria-hidden="true">
            {fmtScore(r.overall)}
          </span>
          <div>
            <h2 id="overall" className="t-section">
              <span className="sr-only">Overall score {fmtScore(r.overall)} of 100: </span>
              {r.band_label}
            </h2>
            <p className="t-caption dimmer">
              Questionnaire version {r.version} · {r.answered} of {r.applicable} questions answered
              {prev && r.overall != null && prev.overall != null ? ` · ${r.overall - prev.overall >= 0 ? '+' : ''}${Math.round((r.overall - prev.overall) * 10) / 10} since ${fmtDate(prev.computed_at)}${sameVersion ? '' : ` (version ${prev.version})`}` : ''}
            </p>
          </div>
        </div>
        {band?.summary ? <p className="t-lead lab-measure lab-gap">{band.summary}</p> : null}
        {note?.body ? <p className="t-small dimmer lab-measure lab-gap-s">{note.body}</p> : null}
      </section>

      <section className="lab-panel lab-gap" aria-labelledby="areas">
        <h2 id="areas" className="label">
          By area
        </h2>
        <ul role="list" className="lab-srows lab-gap-s">
          {CATEGORIES.map(([k, l]) => {
            const c = r.categories[k]
            const d = sameVersion && c?.score != null && prev?.categories[k]?.score != null ? Math.round((c.score - prev.categories[k]!.score!) * 10) / 10 : null
            return (
              <li key={k} className="lab-srow">
                <span className="lab-srow__label">
                  {l}
                  <span className="t-caption dimmer"> · weight {r.weights[k]}%</span>
                </span>
                <Meter value={c?.score ?? null} label={l} />
                <span className="lab-srow__value t-num">{fmtScore(c?.score)}</span>
                <span className="lab-srow__note t-caption dimmer">
                  {c ? `${c.answered - c.na} scored${c.na ? `, ${c.na} not applicable` : ''}` : 'No questions applied'}
                  {d ? ` · ${d > 0 ? '+' : ''}${d}` : ''}
                </span>
              </li>
            )
          })}
        </ul>
        <p className="t-caption dimmer lab-gap-s lab-measure">
          Overall = the area scores combined with the weights shown. An area’s score is the weighted average of its answered questions; “not applicable” answers leave the calculation. <Link to="/lab/how-it-works" className="link">Methodology</Link>
        </p>
      </section>

      <div className="lab-grid lab-gap">
        <section className="lab-panel" aria-labelledby="lifted">
          <h2 id="lifted" className="label">
            What lifted the score
          </h2>
          {lifted.length ? (
            <ul role="list" className="lab-rows lab-gap-s">
              {lifted.map(c => (
                <li key={c.key}>
                  <span>{c.options.join(', ')}</span>
                  <span className="t-caption dimmer">
                    {label(CATEGORIES, c.category)} · {c.prompt}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-small dim lab-gap-s">No single answer scored 75 or more.</p>
          )}
        </section>
        <section className="lab-panel" aria-labelledby="held">
          <h2 id="held" className="label">
            What held it back
          </h2>
          {held.length ? (
            <ul role="list" className="lab-rows lab-gap-s">
              {held.map(c => (
                <li key={c.key}>
                  <span>{c.options.join(', ')}</span>
                  <span className="t-caption dimmer">
                    {label(CATEGORIES, c.category)} · {c.prompt}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="t-small dim lab-gap-s">No answer scored below 50.</p>
          )}
          {na.length ? <p className="t-caption dimmer lab-gap-s">Not applicable to you: {na.map(c => c.prompt).join(' · ')}</p> : null}
        </section>
      </div>

      <section className="lab-panel lab-gap" aria-labelledby="recs">
        <h2 id="recs" className="label">
          Recommended next steps
        </h2>
        {recs.data?.length ? (
          <ol role="list" className="lab-recs lab-gap-s">
            {recs.data.map(x => (
              <li key={x.rule_key}>
                <h3 className="t-title">{x.title}</h3>
                <p className="dim lab-measure">{x.body}</p>
                {x.category ? <span className="t-caption dimmer">{label(CATEGORIES, x.category)}</span> : null}
              </li>
            ))}
          </ol>
        ) : recs.loading ? (
          <Loading />
        ) : (
          <p className="t-small dim lab-gap-s">No specific recommendations for this result.</p>
        )}
        <p className="t-caption dimmer lab-gap-s">Recommendations are rule-based: each one is triggered by your scores or a specific answer.</p>
      </section>

      <div className="actions lab-gap">
        <Link to="/lab/markets" className="btn">
          Compare markets
        </Link>
        <Link to="/lab/matches" className="link-q go">
          See matching partners
        </Link>
      </div>

      {list.length > 1 ? (
        <section className="lab-panel lab-gap" aria-labelledby="hist">
          <h2 id="hist" className="label">
            History
          </h2>
          <ul role="list" className="lab-rows lab-gap-s">
            {list.map(h => (
              <li key={h.id}>
                {h.id === r.id ? (
                  <span className="t-num" aria-current="true">
                    {fmtScore(h.overall)} · {h.band_label} (shown)
                  </span>
                ) : (
                  <Link to={`/lab/results?id=${h.id}`} className="link-q t-num">
                    {fmtScore(h.overall)} · {h.band_label}
                  </Link>
                )}
                <span className="t-caption dimmer">
                  {fmtDate(h.computed_at)} · version {h.version}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
