import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSection } from '@/content'
import { rpc, useBrandId, type AssessmentState } from '../api'
import { CATEGORIES, label } from '../labels'
import { Loading, Notice, useAction } from '../ui'
import { AppHead, useAppPage } from './LabApp'

export default function Assessment() {
  const brandId = useBrandId()
  const navigate = useNavigate()
  const intro = useSection('lab-app', 'assessment_intro')
  useAppPage('Readiness assessment', '/lab/assessment')
  const [st, setSt] = useState<AssessmentState | null>(null)
  const [cur, setCur] = useState<string | null>(null)
  const [review, setReview] = useState(false)
  const [begun, setBegun] = useState(false)
  const [carried, setCarried] = useState(false)
  const [loadErr, setLoadErr] = useState('')
  const a = useAction()
  const headRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!brandId) return
    let live = true
    ;(async () => {
      try {
        const id = await rpc<string>('lab_start_assessment', { p_brand: brandId })
        const s = await rpc<AssessmentState>('lab_assessment_state', { p_assessment: id })
        if (!live) return
        setSt(s)
        setCarried(s.answered > 0)
        setBegun(s.answered > 0)
        const first = s.questions.find(q => s.applicable.includes(q.key) && !(q.key in s.answers))
        setCur(first?.key ?? null)
        if (!first && s.answered > 0) setReview(true)
      } catch (e) {
        if (live) setLoadErr((e as Error).message)
      }
    })()
    return () => {
      live = false
    }
  }, [brandId])

  useEffect(() => {
    if (begun) headRef.current?.focus()
  }, [cur, review, begun])

  if (loadErr) return <Notice tone="error">{loadErr}</Notice>
  if (!st) return <Loading label="Preparing your assessment" />

  const qs = st.questions.filter(q => st.applicable.includes(q.key))
  const idx = qs.findIndex(q => q.key === cur)
  const q = idx >= 0 ? qs[idx] : null
  const answered = qs.filter(x => x.key in st.answers).length
  const chosen = q ? (st.answers[q.key] ?? []) : []

  async function choose(key: string) {
    if (!q || !st) return
    const opt = q.options.find(o => o.key === key)
    let next: string[]
    if (q.kind !== 'multi') next = [key]
    else if (opt?.is_na) next = chosen.includes(key) ? [] : [key]
    else {
      const base = chosen.filter(k => !q.options.find(o => o.key === k)?.is_na)
      next = base.includes(key) ? base.filter(k => k !== key) : [...base, key]
    }
    // a saved answer can be changed but not emptied: keep at least one choice
    if (!next.length) return
    // optimistic, then the server's view (applicability can change)
    setSt({ ...st, answers: { ...st.answers, [q.key]: next } })
    await a.run(async () => {
      await rpc('lab_save_answer', { p_assessment: st.assessment.id, p_question: q.key, p_options: next })
      setSt(await rpc<AssessmentState>('lab_assessment_state', { p_assessment: st.assessment.id }))
    })
  }
  function go(delta: number) {
    const n = qs[idx + delta]
    if (n) setCur(n.key)
    else if (delta > 0) setReview(true)
  }
  async function complete() {
    if (!st) return
    await a.run(async () => {
      const id = await rpc<string>('lab_complete_assessment', { p_assessment: st.assessment.id })
      navigate(`/lab/results?id=${id}`)
    })
  }

  const byCat = CATEGORIES.map(([k, l]) => {
    const items = qs.filter(x => x.category === k)
    return { k, l, total: items.length, done: items.filter(x => x.key in st.answers).length, first: items[0]?.key }
  }).filter(c => c.total)

  if (!begun)
    return (
      <div className="lab-screen lab-narrow">
        <AppHead eyebrow="Readiness" title={intro?.title ?? 'The readiness assessment'}>
          {intro?.body ? <p className="t-lead dim lab-measure">{intro.body}</p> : null}
        </AppHead>
        <ul role="list" className="lab-rows lab-gap">
          {byCat.map(c => (
            <li key={c.k}>
              <span>{c.l}</span>
              <span className="t-caption dimmer t-num">{c.total} questions</span>
            </li>
          ))}
        </ul>
        <p className="t-small dim lab-gap">
          Questionnaire version {st.version.version}. Some questions only appear when they apply to you.
        </p>
        <div className="actions lab-gap">
          <button type="button" className="btn" onClick={() => setBegun(true)}>
            Begin
          </button>
        </div>
      </div>
    )

  return (
    <div className="lab-screen lab-assess">
      <aside className="lab-assess__index" aria-label="Progress by area">
        <p className="label t-num">
          {answered} of {qs.length} answered
        </p>
        <div className="lab-progress lab-gap-s" aria-hidden="true">
          <span style={{ inlineSize: `${(answered / Math.max(1, qs.length)) * 100}%` }} />
        </div>
        <ul role="list" className="lab-assess__cats lab-gap">
          {byCat.map(c => (
            <li key={c.k} data-current={(q?.category === c.k && !review) || undefined}>
              <button
                type="button"
                className="link-q"
                onClick={() => {
                  setReview(false)
                  setCur(qs.find(x => x.category === c.k && !(x.key in st.answers))?.key ?? c.first ?? null)
                }}
              >
                {c.l}
              </button>
              <span className="t-caption dimmer t-num">
                {c.done}/{c.total}
              </span>
            </li>
          ))}
          <li data-current={review || undefined}>
            <button type="button" className="link-q" onClick={() => setReview(true)}>
              Review & finish
            </button>
          </li>
        </ul>
      </aside>

      <div className="lab-assess__main">
        {carried && !review ? <Notice>We’ve carried over your previous answers where the questions haven’t changed. Review them and change anything that’s moved on.</Notice> : null}
        {review ? (
          <section aria-labelledby="review">
            <h1 id="review" ref={headRef} tabIndex={-1} className="t-section">
              Review your answers
            </h1>
            <ol role="list" className="lab-review lab-gap">
              {qs.map(x => (
                <li key={x.key}>
                  <span className="t-caption dimmer">{label(CATEGORIES, x.category)}</span>
                  <span>{x.prompt}</span>
                  <span className={x.key in st.answers ? 't-small' : 't-small lab-warn'}>
                    {x.key in st.answers ? x.options.filter(o => st.answers[x.key]!.includes(o.key)).map(o => o.label).join(', ') : 'Not answered yet'}
                  </span>
                  <button
                    type="button"
                    className="link-q t-caption"
                    onClick={() => {
                      setReview(false)
                      setCur(x.key)
                    }}
                  >
                    Change<span className="sr-only">: {x.prompt}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="actions lab-gap">
              <button type="button" className="btn" disabled={a.busy || st.missing_required.length > 0} onClick={() => void complete()}>
                {a.busy ? 'Scoring…' : 'Complete and see my result'}
              </button>
              {st.missing_required.length ? <span className="t-small dim">{st.missing_required.length} questions still need an answer.</span> : null}
            </div>
            <Notice tone="error">{a.error}</Notice>
          </section>
        ) : q ? (
          <section aria-labelledby={`q-${q.key}`} className="lab-q">
            <p className="label t-num">
              {label(CATEGORIES, q.category)} · question {idx + 1} of {qs.length}
            </p>
            <fieldset className="lab-choices lab-gap-s">
              <legend>
                <h1 id={`q-${q.key}`} ref={headRef} tabIndex={-1} className="t-section lab-q__prompt">
                  {q.prompt}
                </h1>
              </legend>
              {q.help ? <p className="dim lab-q__help">{q.help}</p> : null}
              {q.kind === 'multi' ? <p className="t-caption dimmer">Choose all that apply.</p> : null}
              <div className="lab-choices__list">
                {q.options.map(o => (
                  <label key={o.key} className={`lab-choice lab-choice--big${o.is_na ? ' lab-choice--na' : ''}`}>
                    <input type={q.kind === 'multi' ? 'checkbox' : 'radio'} name={q.key} checked={chosen.includes(o.key)} onChange={() => void choose(o.key)} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            {q.why ? (
              <details className="lab-why lab-gap">
                <summary className="t-small">Why we ask</summary>
                <p className="t-small dim lab-measure">{q.why}</p>
              </details>
            ) : null}
            <div className="actions lab-gap">
              <button type="button" className="btn" onClick={() => go(1)} disabled={!chosen.length || a.busy}>
                {idx < qs.length - 1 ? 'Next' : 'Review answers'}
              </button>
              {idx > 0 ? (
                <button type="button" className="link-q" onClick={() => go(-1)}>
                  Previous
                </button>
              ) : null}
              <span className="t-caption dimmer" role="status">
                {a.busy ? 'Saving…' : chosen.length ? 'Saved' : ''}
              </span>
            </div>
            <Notice tone="error">{a.error}</Notice>
          </section>
        ) : (
          <Notice>All questions are answered.</Notice>
        )}
      </div>
    </div>
  )
}
