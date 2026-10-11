import Link from '@/components/Link'
import { rpc, q, useBrandId, reloadBoot, type Dashboard as D } from '../api'
import { CATEGORIES, INTRO_STATUS, OPP_STATUS, fmtDate, fmtScore, label } from '../labels'
import { Loading, Meter, Notice, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

/** Discover → Register → Create brand → Validate → Compare → Match → Connect → Track. */
function Journey({ d }: { d: D }) {
  const intros = Object.values(d.introductions).reduce((a, b) => a + (b ?? 0), 0)
  const steps = [
    { label: 'Brand profile', done: true, to: '/lab/brand' },
    { label: 'Readiness assessment', done: Boolean(d.latest_result), to: d.open_assessment ? '/lab/assessment' : d.latest_result ? '/lab/results' : '/lab/assessment' },
    { label: 'Compare markets', done: Boolean(d.latest_result), to: '/lab/markets', hint: 'Uses your readiness result' },
    { label: 'Review matches', done: d.saved > 0, to: '/lab/matches' },
    { label: 'Request an introduction', done: intros > 0, to: '/lab/matches?tab=requests' },
    { label: 'Track opportunities', done: d.opportunities.length > 0, to: '/lab/opportunities' },
  ]
  const next = steps.find(s => !s.done)
  return (
    <section className="lab-panel" aria-labelledby="journey">
      <h2 id="journey" className="label">
        Your route
      </h2>
      <ol role="list" className="lab-journey">
        {steps.map((s, i) => (
          <li key={s.label} data-done={s.done || undefined} data-next={s === next || undefined}>
            <span className="t-num lab-journey__n" aria-hidden="true">
              {s.done ? '✓' : String(i + 1).padStart(2, '0')}
            </span>
            <Link to={s.to} className="link-q">
              {s.label}
            </Link>
            <span className="sr-only">{s.done ? ' (done)' : s === next ? ' (next)' : ''}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default function Dashboard() {
  const brandId = useBrandId()
  useAppPage('Overview', '/lab/dashboard')
  const { data: d, error, loading, reload } = useLoad(() => (brandId ? rpc<D>('lab_dashboard', { p_brand: brandId }) : Promise.resolve(undefined)), [brandId])

  async function markRead() {
    const ids = d?.notifications.filter(n => !n.read).map(n => n.id) ?? []
    if (!ids.length) return
    await q(c => c.from('lab_notifications').update({ read_at: new Date().toISOString() }).in('id', ids))
    await Promise.all([reload(), reloadBoot()])
  }

  if (!d) return loading ? <Loading /> : <Notice tone="error">{error}</Notice>
  const r = d.latest_result
  const prev = d.history[1]
  const delta = r?.overall != null && prev ? Math.round((r.overall - prev.overall) * 10) / 10 : null
  const unread = d.notifications.filter(n => !n.read).length

  return (
    <div className="lab-screen">
      <AppHead eyebrow="Overview" title={d.brand.name}>
        <Link to="/lab/brand" className="link-q t-small">
          Edit brand profile
        </Link>
      </AppHead>

      <div className="lab-grid">
        <section className="lab-panel lab-panel--wide" aria-labelledby="readiness">
          <h2 id="readiness" className="label">
            Market readiness
          </h2>
          {r ? (
            <>
              <div className="lab-specimen__head lab-gap-s">
                <span className="lab-figure t-num">{fmtScore(r.overall)}</span>
                <span>
                  <span className="t-title">{r.band_label}</span>
                  <span className="t-caption dimmer">
                    {fmtDate(r.computed_at)} · questionnaire v{r.version}
                    {delta != null ? ` · ${delta >= 0 ? '+' : ''}${delta} since the previous result` : ''}
                  </span>
                </span>
              </div>
              <ul role="list" className="lab-srows lab-gap">
                {CATEGORIES.map(([k, l]) => (
                  <li key={k} className="lab-srow">
                    <span className="lab-srow__label">{l}</span>
                    <Meter value={r.categories[k]?.score ?? null} label={l} />
                    <span className="lab-srow__value t-num">{fmtScore(r.categories[k]?.score)}</span>
                  </li>
                ))}
              </ul>
              <div className="actions lab-gap">
                <Link to="/lab/results" className="link-q go">
                  The full result, explained
                </Link>
                <Link to="/lab/assessment" className="link-q">
                  {d.open_assessment ? `Continue the new assessment (${d.open_assessment.answered} answered)` : 'Retake the assessment'}
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="t-lead lab-gap-s lab-measure">
                {d.open_assessment ? `You’ve answered ${d.open_assessment.answered} questions so far. Pick up where you left off.` : 'About twenty questions across six areas, ten minutes or so. Everything else in The Lab builds on it.'}
              </p>
              <p className="lab-gap">
                <Link to="/lab/assessment" className="btn">
                  {d.open_assessment ? 'Continue the assessment' : 'Start the assessment'}
                </Link>
              </p>
            </>
          )}
        </section>

        <Journey d={d} />

        <section className="lab-panel" aria-labelledby="priorities">
          <h2 id="priorities" className="label">
            Priorities
          </h2>
          {d.priorities.length ? (
            <ol role="list" className="lab-numbered lab-gap-s">
              {d.priorities.map(p => (
                <li key={p.title}>
                  <span>{p.title}</span>
                  {p.category ? <span className="t-caption dimmer">{label(CATEGORIES, p.category)}</span> : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="dim t-small lab-gap-s">Your priorities appear after the first assessment.</p>
          )}
        </section>

        <section className="lab-panel" aria-labelledby="pipeline">
          <h2 id="pipeline" className="label">
            Introductions & opportunities
          </h2>
          <dl className="lab-facts lab-gap-s">
            <div>
              <dt className="t-caption dimmer">Shortlisted partners</dt>
              <dd className="t-num">{d.saved}</dd>
            </div>
            {Object.entries(d.introductions).map(([k, n]) => (
              <div key={k}>
                <dt className="t-caption dimmer">{label(INTRO_STATUS, k)}</dt>
                <dd className="t-num">{n}</dd>
              </div>
            ))}
          </dl>
          {d.opportunities.length ? (
            <ul role="list" className="lab-rows lab-gap">
              {d.opportunities.map(o => (
                <li key={o.id}>
                  <Link to={`/lab/opportunities?id=${o.id}`} className="link-q">
                    {o.title}
                  </Link>
                  <span className="t-caption dimmer">
                    {label(OPP_STATUS, o.status)}
                    {o.next_action ? ` · next: ${o.next_action}${o.next_action_on ? ` (${fmtDate(o.next_action_on)})` : ''}` : ''}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="lab-gap">
            <Link to="/lab/matches" className="link-q go t-small">
              Review matches
            </Link>
          </p>
        </section>

        <section className="lab-panel" aria-labelledby="updates">
          <div className="lab-panel__head">
            <h2 id="updates" className="label">
              Updates{unread ? ` · ${unread} new` : ''}
            </h2>
            {unread ? (
              <button type="button" className="link-q t-caption" onClick={() => void markRead()}>
                Mark all as read
              </button>
            ) : null}
          </div>
          {d.notifications.length ? (
            <ul role="list" className="lab-rows lab-gap-s">
              {d.notifications.map(n => (
                <li key={n.id} data-unread={!n.read || undefined}>
                  {n.link ? (
                    <Link to={n.link} className="link-q">
                      {n.title}
                    </Link>
                  ) : (
                    <span>{n.title}</span>
                  )}
                  {n.body ? <span className="t-small dim">{n.body}</span> : null}
                  <span className="t-caption dimmer">{fmtDate(n.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dim t-small lab-gap-s">Status changes on your requests will show up here.</p>
          )}
        </section>

        <section className="lab-panel" aria-labelledby="history">
          <h2 id="history" className="label">
            Results & reports
          </h2>
          {d.history.length ? (
            <ul role="list" className="lab-rows lab-gap-s">
              {d.history.map(h => (
                <li key={h.id}>
                  <Link to={`/lab/results?id=${h.id}`} className="link-q t-num">
                    {fmtScore(h.overall)} · {h.band_label}
                  </Link>
                  <span className="t-caption dimmer">
                    {fmtDate(h.computed_at)} · v{h.version}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {d.reports.length ? (
            <ul role="list" className="lab-rows lab-gap-s">
              {d.reports.map(rp => (
                <li key={rp.id}>
                  <Link to={`/lab/reports?id=${rp.id}`} className="link-q">
                    {rp.title}
                  </Link>
                  <span className="t-caption dimmer">{fmtDate(rp.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="dim t-small lab-gap-s">No reports yet.</p>
          )}
          <p className="lab-gap">
            <Link to="/lab/reports" className="link-q go t-small">
              Reports
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
