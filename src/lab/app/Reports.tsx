import { useSearchParams } from 'react-router-dom'
import Link from '@/components/Link'
import { useSection } from '@/content'
import { q, rpc, track, useBrandId, type Report } from '../api'
import { CATEGORIES, INTRO_STATUS, PURPOSES, VERIFICATION, fmtDate, fmtScore, label, marketName } from '../labels'
import { Empty, EvidenceTag, Loading, Meter, Notice, Tag, useAction, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

function ReportView({ r, onBack }: { r: Report; onBack: () => void }) {
  const s = r.snapshot
  const a = useAction()
  async function pdf() {
    await a.run(async () => {
      const { reportPdf } = await import('./pdf')
      const bytes = await reportPdf(s, r.title)
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${(s.brand.name ?? 'brand').replace(/[^\w-]+/g, '-').toLowerCase()}-lab-report-${s.generated_at.slice(0, 10)}.pdf`
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 2000)
      track('report_downloaded', { format: 'pdf' })
    })
  }
  const rd = s.readiness
  return (
    <article className="lab-report" aria-labelledby="rep-title">
      <div className="actions lab-report__tools">
        <button type="button" className="link-q" onClick={onBack}>
          All reports
        </button>
        <button type="button" className="btn" onClick={() => void pdf()} disabled={a.busy}>
          {a.busy ? 'Preparing the PDF…' : 'Download PDF'}
        </button>
        <button type="button" className="link-q" onClick={() => window.print()}>
          Print
        </button>
      </div>
      <Notice tone="error">{a.error}</Notice>

      <header className="lab-report__cover">
        <p className="label">Not by Accident · The Lab</p>
        <h1 id="rep-title" className="t-display">
          <em>Market readiness</em> {s.brand.name}
        </h1>
        <p className="t-small dim">Generated {fmtDate(s.generated_at)}. A snapshot: it doesn’t change when your answers or our data do.</p>
      </header>

      {rd ? (
        <section className="lab-report__sec">
          <div className="lab-specimen__head">
            <span className="lab-figure lab-figure--l t-num">{fmtScore(rd.overall)}</span>
            <div>
              <h2 className="t-section">{rd.band_label}</h2>
              <p className="t-caption dimmer">
                Questionnaire version {rd.version} · {rd.answered} of {rd.applicable} questions · {fmtDate(rd.computed_at)}
              </p>
            </div>
          </div>
          {rd.band_summary ? <p className="t-lead lab-measure lab-gap-s">{rd.band_summary}</p> : null}
          <ul role="list" className="lab-srows lab-gap">
            {rd.categories.map(c => (
              <li key={c.key} className="lab-srow">
                <span className="lab-srow__label">
                  {label(CATEGORIES, c.key)}
                  <span className="t-caption dimmer"> · weight {c.weight}%</span>
                </span>
                <Meter value={c.score} label={label(CATEGORIES, c.key)} />
                <span className="lab-srow__value t-num">{fmtScore(c.score)}</span>
              </li>
            ))}
          </ul>
          <p className="t-caption dimmer lab-gap-s">Readiness bands are product-defined categories based on your answers, not predictions of success.</p>
        </section>
      ) : (
        <Notice>This report was generated before a readiness result existed.</Notice>
      )}

      {s.recommendations.length ? (
        <section className="lab-report__sec">
          <h2 className="label">Recommendations</h2>
          <ol role="list" className="lab-recs lab-gap-s">
            {s.recommendations.map(x => (
              <li key={x.key}>
                <h3 className="t-title">{x.title}</h3>
                <p className="dim lab-measure">{x.body}</p>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {s.markets?.markets.length ? (
        <section className="lab-report__sec">
          <h2 className="label">Markets</h2>
          <div className="lab-compare lab-gap-s" data-count={s.markets.markets.length}>
            {s.markets.markets.map(m => (
              <div key={m.code} className="lab-compare__col">
                <h3 className="t-title">{m.name}</h3>
                <span className="lab-figure lab-figure--s t-num">{m.score == null ? '—' : fmtScore(m.score)}</span>
                <ul role="list" className="lab-factors lab-gap-s">
                  {m.factors.map(f => (
                    <li key={f.key}>
                      <span className="lab-factors__top">
                        <span className="t-small">{f.label}</span>
                        <EvidenceTag kind={f.evidence} />
                      </span>
                      <Meter value={f.value} compact />
                    </li>
                  ))}
                </ul>
                {m.missing.length ? <p className="t-caption dimmer lab-gap-s">Missing: {m.missing.join(', ')}</p> : null}
              </div>
            ))}
          </div>
          {s.markets.ranking?.reason ? <p className="t-caption dimmer lab-gap-s">{s.markets.ranking.reason}</p> : null}
        </section>
      ) : null}

      {s.saved_matches.length || s.introductions.length ? (
        <section className="lab-report__sec">
          <h2 className="label">Partners</h2>
          {s.partner_types.length ? <p className="t-small lab-gap-s">Worth approaching: {s.partner_types.map(t => t.label).join(', ')}.</p> : null}
          <ul role="list" className="lab-rows lab-gap-s">
            {s.saved_matches.map(m => (
              <li key={m.partner.id}>
                <span>
                  {m.partner.name} <span className="dimmer">· {m.partner.type_label}</span>
                  {m.score != null ? <span className="t-num"> · {m.score}</span> : null}
                </span>
                <span className="lab-tags">
                  <Tag tone="quiet">{label(VERIFICATION, m.partner.verification_status)}</Tag>
                  {m.partner.is_fixture ? <Tag tone="warn">Fictional demo record</Tag> : null}
                </span>
                {m.note ? <span className="t-caption dimmer">{m.note}</span> : null}
              </li>
            ))}
            {s.introductions.map((i, n) => (
              <li key={n}>
                <span>Introduction: {i.partner ?? 'research request'}</span>
                <span className="t-caption dimmer">
                  {label(PURPOSES, i.purpose)} · {label(INTRO_STATUS, i.status)} · {fmtDate(i.created_at)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {s.next_actions.length ? (
        <section className="lab-report__sec">
          <h2 className="label">Next actions</h2>
          <ol role="list" className="lab-numbered lab-gap-s">
            {s.next_actions.map(x => (
              <li key={x.text}>
                <span>{x.text}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section className="lab-report__sec">
        <h2 className="label">Method & limitations</h2>
        <p className="t-small dim lab-gap-s">
          Area weights: {Object.entries(s.methodology.category_weights).map(([k, v]) => `${label(CATEGORIES, k)} ${v}%`).join(', ')}.
          {s.objectives?.target_markets?.length ? ` Markets considered: ${s.objectives.target_markets.map(marketName).join(', ')}.` : ''}
        </p>
        <ul role="list" className="lab-list t-small dim lab-gap-s">
          {s.methodology.limitations.map(l => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </article>
  )
}

export default function Reports() {
  const brandId = useBrandId()!
  const [params, setParams] = useSearchParams()
  const empty = useSection('lab-app', 'reports_empty')
  useAppPage('Reports', '/lab/reports')
  const list = useLoad(() => q<Report[]>(c => c.from('lab_reports').select('*').eq('brand_id', brandId).order('created_at', { ascending: false })), [brandId])
  const a = useAction()
  const open = list.data?.find(r => r.id === params.get('id'))

  async function generate() {
    await a.run(async () => {
      const id = await rpc<string>('lab_generate_report', { p_brand: brandId })
      await list.reload()
      setParams({ id })
    })
  }
  async function remove(r: Report) {
    if (!window.confirm(`Delete the report from ${fmtDate(r.created_at)}?`)) return
    await a.run(async () => {
      await q(c => c.from('lab_reports').delete().eq('id', r.id))
      await list.reload()
    })
  }

  if (list.loading && !list.data) return <Loading />
  if (open) return <ReportView r={open} onBack={() => setParams({})} />
  return (
    <div className="lab-screen">
      <AppHead eyebrow="Reports" title="Your reports">
        <button type="button" className="btn" onClick={() => void generate()} disabled={a.busy}>
          {a.busy ? 'Generating…' : 'Generate a report'}
        </button>
      </AppHead>
      <Notice tone="error">{a.error || list.error}</Notice>
      {list.data?.length ? (
        <ul role="list" className="lab-rows">
          {list.data.map(r => (
            <li key={r.id} className="lab-rows__split">
              <Link to={`/lab/reports?id=${r.id}`} className="link-q t-title">
                {r.title}
              </Link>
              <span className="t-caption dimmer">
                {fmtDate(r.created_at)}
                {r.snapshot.readiness ? ` · readiness ${fmtScore(r.snapshot.readiness.overall)}` : ''}
              </span>
              <button type="button" className="link-q t-caption dimmer" onClick={() => void remove(r)}>
                Delete<span className="sr-only"> report from {fmtDate(r.created_at)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <Empty title={empty?.title ?? 'No reports yet.'} body={empty?.body} />
      )}
    </div>
  )
}
