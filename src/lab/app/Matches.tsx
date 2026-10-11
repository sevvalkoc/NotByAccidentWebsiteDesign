import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Link from '@/components/Link'
import { useSection } from '@/content'
import { CONSENT_VERSION, q, reloadBoot, rpc, useBrandId, useLabSession, type IntroStatus, type Match, type MatchRun, type PartnerPublic, type SavedItem } from '../api'
import { INTRO_STATUS, MARKETS, PARTNER_TYPES, PRICE_TIERS, PURPOSES, VERIFICATION, VERIFICATION_HELP, fmtDate, label, labels, marketName } from '../labels'
import { Choices, Dialog, Empty, Loading, Meter, Notice, SelectField, Tag, TextField, useAction, useLoad } from '../ui'
import { AppHead, useAppPage } from './LabApp'

type MyRequest = {
  id: string
  status: IntroStatus
  purpose: string
  message: string | null
  market_codes: string[]
  partner_types: string[]
  created_at: string
  updated_at: string
  partner: { id: string; name: string; type_label: string; country_code: string | null; city: string | null } | null
  events: { status: string; note: string | null; by: 'user' | 'staff' | 'system'; created_at: string }[]
  opportunity_id: string | null
}
type Profile = { partner: PartnerPublic; match: Omit<Match, 'partner' | 'rank' | 'saved' | 'introduction'> & { computed_at: string } | null; saved: { note: string | null } | null; introductions: { id: string; status: IntroStatus }[] }

const TABS = [
  ['matches', 'Matches'],
  ['shortlist', 'Shortlist'],
  ['requests', 'Requests'],
] as const
const OPEN = new Set(['requested', 'under_review', 'more_info_needed', 'approved', 'introduction_sent', 'in_discussion'])

function Verification({ status }: { status: string }) {
  return (
    <Tag tone={status === 'confirmed_partner' ? 'accent' : status === 'research_prospect' ? 'warn' : 'quiet'} title={VERIFICATION_HELP[status]}>
      {label(VERIFICATION, status)}
    </Tag>
  )
}

function PartnerLine({ p }: { p: PartnerPublic }) {
  return (
    <span className="t-caption dimmer">
      {p.type_label}
      {p.city || p.country_code ? ` · ${[p.city, p.country_code ? marketName(p.country_code) : null].filter(Boolean).join(', ')}` : ''}
      {p.coverage.length ? ` · covers ${p.coverage.map(marketName).join(', ')}` : ''}
    </span>
  )
}

function MatchCard({ m, onSave, onIntro, onProfile }: { m: Match; onSave: () => void; onIntro: () => void; onProfile: () => void }) {
  const p = m.partner
  return (
    <article className="lab-match" aria-labelledby={`p-${p.id}`}>
      <header className="lab-match__head">
        <span className="t-num dimmer lab-match__rank">{String(m.rank).padStart(2, '0')}</span>
        <div>
          <h3 id={`p-${p.id}`} className="t-title">
            {p.name}
          </h3>
          <PartnerLine p={p} />
          <div className="lab-tags">
            <Verification status={p.verification_status} />
            {p.is_fixture ? <Tag tone="warn">Fictional demo record</Tag> : null}
            {m.introduction ? <Tag>{label(INTRO_STATUS, m.introduction.status)}</Tag> : null}
          </div>
        </div>
        <div className="lab-match__score">
          <span className="lab-figure lab-figure--s t-num">{m.score}</span>
          <span className="t-caption dimmer">compatibility · {m.coverage}% of criteria known</span>
        </div>
      </header>
      <ul role="list" className="lab-criteria">
        {m.criteria.map(c => (
          <li key={c.key}>
            <span className="t-caption">{c.label}</span>
            <Meter value={c.score == null ? null : c.score * 100} label={c.label} compact />
            <span className="t-caption dimmer t-num">{c.score == null ? 'unknown' : Math.round(c.score * 100)}</span>
          </li>
        ))}
      </ul>
      <ul role="list" className="lab-list t-small lab-gap-s">
        {m.reasons.map(r => (
          <li key={r}>{r}</li>
        ))}
        {m.limitations.map(r => (
          <li key={r} className="dim">
            {r}
          </li>
        ))}
      </ul>
      <div className="actions lab-gap-s">
        <button type="button" className="btn btn--ghost" onClick={onProfile}>
          Details
        </button>
        <button type="button" className="link-q" onClick={onSave} aria-pressed={m.saved}>
          {m.saved ? 'Shortlisted' : 'Shortlist'}
        </button>
        {!m.introduction || !OPEN.has(m.introduction.status) ? (
          <button type="button" className="link-q" onClick={onIntro}>
            Request an introduction
          </button>
        ) : null}
      </div>
    </article>
  )
}

function IntroDialog({ brandId, partner, onClose, onDone }: { brandId: string; partner: PartnerPublic | null; onClose: () => void; onDone: () => void }) {
  const s = useLabSession()
  const note = useSection('lab-app', 'intro_note')
  const [purpose, setPurpose] = useState('')
  const [message, setMessage] = useState('')
  const [share, setShare] = useState(false)
  const a = useAction()
  const granted = s.boot?.consents.partner_sharing?.granted
  async function submit() {
    if (!partner) return
    if (!purpose) return a.setError('Choose what the introduction is for.')
    if (!granted && !share) return a.setError('We can only make an introduction if we may share your brand profile with this partner.')
    const ok = await a.run(async () => {
      if (!granted) {
        await q(c => c.from('lab_consents').insert({ user_id: s.session!.user.id, kind: 'partner_sharing', granted: true, version: CONSENT_VERSION }))
        void reloadBoot()
      }
      await rpc('lab_request_introduction', { p_brand: brandId, p_partner: partner.id, p_purpose: purpose, p_message: message })
    })
    if (ok) onDone()
  }
  return (
    <Dialog open={Boolean(partner)} onClose={onClose} title={partner ? `Introduction to ${partner.name}` : ''}>
      {partner ? (
        <div className="form lab-form">
          {note?.body ? <p className="t-small dim">{note.body}</p> : null}
          {!partner.accepts_introductions ? <Notice>This organisation hasn’t confirmed that it takes introductions. Our team will check before anything happens.</Notice> : null}
          {partner.is_fixture ? <Notice>This is a fictional demo record: the request goes through the workflow, but nobody will be contacted.</Notice> : null}
          <SelectField label="What it’s for" value={purpose} onChange={setPurpose} options={PURPOSES} required />
          <TextField label="Message to our team" value={message} onChange={setMessage} multiline maxLength={1500} help="Context that helps us judge fit: what you’d propose, timing, anything the partner should know." />
          {!granted ? (
            <label className="lab-check">
              <input type="checkbox" checked={share} onChange={e => setShare(e.target.checked)} />
              <span>If the request is approved, Not by Accident may share my brand profile with this partner.</span>
            </label>
          ) : null}
          <div className="actions">
            <button type="button" className="btn" disabled={a.busy} onClick={() => void submit()}>
              {a.busy ? 'Sending…' : 'Send request'}
            </button>
            <button type="button" className="link-q" onClick={onClose}>
              Cancel
            </button>
          </div>
          <Notice tone="error">{a.error}</Notice>
        </div>
      ) : null}
    </Dialog>
  )
}

function ResearchDialog({ brandId, open, onClose, onDone }: { brandId: string; open: boolean; onClose: () => void; onDone: () => void }) {
  const [markets, setMarkets] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const a = useAction()
  async function submit() {
    if (!markets.length) return a.setError('Choose at least one market.')
    const ok = await a.run(() => rpc('lab_request_research', { p_brand: brandId, p_markets: markets, p_types: types, p_message: message }))
    if (ok) onDone()
  }
  return (
    <Dialog open={open} onClose={onClose} title="Ask us to research partners">
      <div className="form lab-form">
        <p className="t-small dim">Our team looks for organisations that fit and adds them to the database once verified. We’ll update you here.</p>
        <Choices legend="Markets" options={MARKETS} value={markets} onChange={setMarkets} multiple columns required />
        <Choices legend="Kinds of partner" options={PARTNER_TYPES} value={types} onChange={setTypes} multiple columns />
        <TextField label="What you’re looking for" value={message} onChange={setMessage} multiline maxLength={1500} />
        <div className="actions">
          <button type="button" className="btn" disabled={a.busy} onClick={() => void submit()}>
            {a.busy ? 'Sending…' : 'Send request'}
          </button>
          <button type="button" className="link-q" onClick={onClose}>
            Cancel
          </button>
        </div>
        <Notice tone="error">{a.error}</Notice>
      </div>
    </Dialog>
  )
}

function ProfileDialog({ brandId, partnerId, onClose }: { brandId: string; partnerId: string | null; onClose: () => void }) {
  const prof = useLoad(() => (partnerId ? rpc<Profile>('lab_partner_profile', { p_partner: partnerId, p_brand: brandId }) : Promise.resolve(null)), [partnerId])
  const p = prof.data?.partner
  return (
    <Dialog open={Boolean(partnerId)} onClose={onClose} title={p?.name ?? 'Partner'}>
      {prof.loading ? <Loading /> : prof.error ? <Notice tone="error">{prof.error}</Notice> : p ? (
        <div className="lab-profile">
          <PartnerLine p={p} />
          <div className="lab-tags">
            <Verification status={p.verification_status} />
            {p.is_fixture ? <Tag tone="warn">Fictional demo record</Tag> : null}
          </div>
          <p className="t-small dim">{VERIFICATION_HELP[p.verification_status]}</p>
          {p.description ? <p className="lab-gap-s">{p.description}</p> : null}
          <dl className="lab-facts lab-gap-s">
            {p.product_categories.length ? (
              <div>
                <dt className="t-caption dimmer">Categories</dt>
                <dd>{p.product_categories.join(', ')}</dd>
              </div>
            ) : null}
            {p.price_tiers.length ? (
              <div>
                <dt className="t-caption dimmer">Price range</dt>
                <dd>{labels(PRICE_TIERS, p.price_tiers).join(', ')}</dd>
              </div>
            ) : null}
            {p.brand_requirements ? (
              <div>
                <dt className="t-caption dimmer">What they look for</dt>
                <dd>{p.brand_requirements}</dd>
              </div>
            ) : null}
            <div>
              <dt className="t-caption dimmer">Last checked</dt>
              <dd>{p.last_verified_at ? fmtDate(p.last_verified_at) : 'Not verified yet'}</dd>
            </div>
            {p.website ? (
              <div>
                <dt className="t-caption dimmer">Website</dt>
                <dd>
                  <a href={p.website} className="link" target="_blank" rel="noopener noreferrer nofollow">
                    {p.website.replace(/^https?:\/\//, '')}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          {prof.data?.match ? (
            <>
              <h3 className="label lab-gap">Your latest compatibility · {prof.data.match.score}</h3>
              <ul role="list" className="lab-criteria lab-gap-s">
                {prof.data.match.criteria.map(c => (
                  <li key={c.key}>
                    <span className="t-caption">{c.label}</span>
                    <Meter value={c.score == null ? null : c.score * 100} label={c.label} compact />
                    <span className="t-caption dimmer t-num">{c.score == null ? 'unknown' : Math.round(c.score * 100)}</span>
                  </li>
                ))}
              </ul>
              {prof.data.match.missing.length ? <p className="t-caption dimmer lab-gap-s">Still to verify: {prof.data.match.missing.join(', ')}.</p> : null}
            </>
          ) : null}
          <p className="t-caption dimmer lab-gap">A compatibility score describes how recorded attributes align. It doesn’t mean the partner is interested or available.</p>
        </div>
      ) : null}
    </Dialog>
  )
}

export default function Matches() {
  const brandId = useBrandId()!
  const [params, setParams] = useSearchParams()
  const tab = (TABS.find(([k]) => k === params.get('tab'))?.[0] ?? 'matches') as (typeof TABS)[number][0]
  const empty = useSection('lab-app', 'matches_empty')
  useAppPage('Matches', '/lab/matches')
  const [filters, setFilters] = useState({ country: params.get('country') ?? '', type: '', verification: '', min_score: '' })
  const latest = useLoad(() => rpc<MatchRun>('lab_latest_matches', { p_brand: brandId }), [brandId])
  const saved = useLoad(() => (tab === 'shortlist' ? rpc<SavedItem[]>('lab_saved_list', { p_brand: brandId }) : Promise.resolve(undefined)), [brandId, tab])
  const reqs = useLoad(() => (tab === 'requests' ? rpc<MyRequest[]>('lab_my_requests', { p_brand: brandId }) : Promise.resolve(undefined)), [brandId, tab])
  const run = useAction()
  const act = useAction()
  const [intro, setIntro] = useState<PartnerPublic | null>(null)
  const [profile, setProfile] = useState<string | null>(null)
  const [research, setResearch] = useState(false)
  const [flash, setFlash] = useState('')
  const [reply, setReply] = useState<Record<string, string>>({})

  async function runMatching() {
    const f = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    await run.run(async () => latest.set(await rpc<MatchRun>('lab_run_matching', { p_brand: brandId, p_filters: f })))
  }
  async function toggleSave(m: Match) {
    await act.run(async () => {
      if (m.saved) await q(c => c.from('lab_saved_matches').delete().eq('brand_id', brandId).eq('partner_id', m.partner.id))
      else await q(c => c.from('lab_saved_matches').insert({ brand_id: brandId, partner_id: m.partner.id }))
      if (latest.data) latest.set({ ...latest.data, matches: latest.data.matches.map(x => (x.partner.id === m.partner.id ? { ...x, saved: !m.saved } : x)) })
    })
  }
  const setTab = (t: string) => setParams({ tab: t })

  const data = latest.data
  return (
    <div className="lab-screen">
      <AppHead eyebrow="Match" title="Partners that fit">
        <p className="dim lab-measure t-small">Scored on category, geography, price, customer, distribution and readiness. Missing information never counts in a partner’s favour.</p>
      </AppHead>

      <div className="lab-tabs" role="tablist" aria-label="Matches">
        {TABS.map(([k, l]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} className="lab-tab" onClick={() => setTab(k)}>
            {l}
          </button>
        ))}
      </div>
      <Notice tone="ok">{flash}</Notice>
      <Notice tone="error">{act.error}</Notice>

      {tab === 'matches' ? (
        <section role="tabpanel" aria-label="Matches">
          <form
            className="lab-filters"
            onSubmit={e => {
              e.preventDefault()
              void runMatching()
            }}
          >
            <SelectField label="Market" value={filters.country} onChange={v => setFilters({ ...filters, country: v })} options={MARKETS} placeholder="All markets" />
            <SelectField label="Kind of partner" value={filters.type} onChange={v => setFilters({ ...filters, type: v })} options={PARTNER_TYPES} placeholder="All kinds" />
            <SelectField label="Status" value={filters.verification} onChange={v => setFilters({ ...filters, verification: v })} options={VERIFICATION} placeholder="Any status" />
            <SelectField
              label="Minimum score"
              value={filters.min_score}
              onChange={v => setFilters({ ...filters, min_score: v })}
              options={[
                ['50', '50 or more'],
                ['60', '60 or more'],
                ['70', '70 or more'],
                ['80', '80 or more'],
              ]}
              placeholder="Default"
            />
            <div className="lab-filters__go">
              <button type="submit" className="btn" disabled={run.busy}>
                {run.busy ? 'Matching…' : data?.run ? 'Run again' : 'Find matches'}
              </button>
            </div>
          </form>
          <Notice tone="error">{run.error || latest.error}</Notice>
          {data?.run ? (
            <p className="t-caption dimmer lab-gap-s">
              {fmtDate(data.run.created_at)} · {data.run.eligible} partners considered, {data.run.excluded} filtered out as incompatible · matching version {data.run.config_version}
              {data.run.used_result ? '' : ' · no readiness result yet, so readiness counts as unknown'}
            </p>
          ) : null}
          {latest.loading && !data ? (
            <Loading />
          ) : data?.run && data.matches.length ? (
            <div className="lab-matches lab-gap">
              {data.matches.map(m => (
                <MatchCard key={m.partner.id} m={m} onSave={() => void toggleSave(m)} onIntro={() => setIntro(m.partner)} onProfile={() => setProfile(m.partner.id)} />
              ))}
              <p className="t-small dim">
                Not finding the right fit?{' '}
                <button type="button" className="link" onClick={() => setResearch(true)}>
                  Ask us to research partners
                </button>
                .
              </p>
            </div>
          ) : data?.run ? (
            <Empty title={empty?.title ?? 'We haven’t found a strong match in our current database.'} body={empty?.body ?? 'That doesn’t mean one doesn’t exist.'}>
              <button type="button" className="btn" onClick={() => setResearch(true)}>
                {empty?.ctaLabel ?? 'Request research'}
              </button>
            </Empty>
          ) : (
            <Empty title="No matches run yet." body="Matching uses your brand profile and your latest readiness result. It takes a second.">
              <button type="button" className="btn" onClick={() => void runMatching()} disabled={run.busy}>
                Find matches
              </button>
            </Empty>
          )}
        </section>
      ) : null}

      {tab === 'shortlist' ? (
        <section role="tabpanel" aria-label="Shortlist">
          {saved.loading && !saved.data ? (
            <Loading />
          ) : saved.data?.length ? (
            <ul role="list" className="lab-shortlist">
              {saved.data.map(s => (
                <li key={s.partner.id}>
                  <div>
                    <span className="t-title">{s.partner.name}</span>
                    <PartnerLine p={s.partner} />
                    <div className="lab-tags">
                      <Verification status={s.partner.verification_status} />
                      {s.partner.is_fixture ? <Tag tone="warn">Fictional demo record</Tag> : null}
                      {s.introduction ? <Tag>{label(INTRO_STATUS, s.introduction.status)}</Tag> : null}
                    </div>
                  </div>
                  <span className="lab-figure lab-figure--s t-num">{s.score ?? '—'}</span>
                  <form
                    className="lab-note"
                    onSubmit={e => {
                      e.preventDefault()
                      const v = String(new FormData(e.currentTarget).get('note') ?? '').slice(0, 1000)
                      void act.run(async () => {
                        await q(c => c.from('lab_saved_matches').update({ note: v || null }).eq('brand_id', brandId).eq('partner_id', s.partner.id))
                        setFlash('Note saved.')
                      })
                    }}
                  >
                    <label className="sr-only" htmlFor={`note-${s.partner.id}`}>
                      Note on {s.partner.name}
                    </label>
                    <input id={`note-${s.partner.id}`} name="note" className="input" defaultValue={s.note ?? ''} placeholder="Add a note" maxLength={1000} />
                    <button type="submit" className="link-q t-caption">
                      Save note
                    </button>
                  </form>
                  <div className="actions">
                    <button type="button" className="link-q t-small" onClick={() => setProfile(s.partner.id)}>
                      Details
                    </button>
                    {!s.introduction || !OPEN.has(s.introduction.status) ? (
                      <button type="button" className="link-q t-small" onClick={() => setIntro(s.partner)}>
                        Request an introduction
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="link-q t-small dimmer"
                      onClick={() =>
                        void act.run(async () => {
                          await q(c => c.from('lab_saved_matches').delete().eq('brand_id', brandId).eq('partner_id', s.partner.id))
                          await saved.reload()
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="Your shortlist is empty." body="Shortlist partners from your matches to compare them and keep notes.">
              <button type="button" className="btn btn--ghost" onClick={() => setTab('matches')}>
                See matches
              </button>
            </Empty>
          )}
        </section>
      ) : null}

      {tab === 'requests' ? (
        <section role="tabpanel" aria-label="Requests">
          {reqs.loading && !reqs.data ? (
            <Loading />
          ) : reqs.data?.length ? (
            <ul role="list" className="lab-requests">
              {reqs.data.map(r => (
                <li key={r.id}>
                  <header className="lab-requests__head">
                    <div>
                      <span className="t-title">{r.partner ? r.partner.name : `Research: ${r.market_codes.map(marketName).join(', ')}`}</span>
                      <span className="t-caption dimmer">
                        {r.partner ? `${r.partner.type_label} · ${label(PURPOSES, r.purpose)}` : labels(PARTNER_TYPES, r.partner_types).join(', ') || 'Any kind of partner'} · sent {fmtDate(r.created_at)}
                      </span>
                    </div>
                    <Tag tone={r.status === 'more_info_needed' ? 'warn' : ['introduction_sent', 'in_discussion', 'completed', 'approved'].includes(r.status) ? 'accent' : 'quiet'}>{label(INTRO_STATUS, r.status)}</Tag>
                  </header>
                  <ol role="list" className="lab-timeline">
                    {r.events.map((e, i) => (
                      <li key={i}>
                        <span className="t-caption dimmer">{fmtDate(e.created_at)}</span>
                        <span className="t-small">
                          {e.by === 'user' ? 'You' : 'Not by Accident'} · {label(INTRO_STATUS, e.status)}
                        </span>
                        {e.note ? <span className="t-small dim">{e.note}</span> : null}
                      </li>
                    ))}
                  </ol>
                  {OPEN.has(r.status) ? (
                    <form
                      className="lab-reply"
                      onSubmit={e => {
                        e.preventDefault()
                        void act.run(async () => {
                          await rpc('lab_reply_introduction', { p_id: r.id, p_note: reply[r.id] ?? '' })
                          setReply({ ...reply, [r.id]: '' })
                          await reqs.reload()
                        })
                      }}
                    >
                      <TextField label={r.status === 'more_info_needed' ? 'Your reply' : 'Add information'} value={reply[r.id] ?? ''} onChange={v => setReply({ ...reply, [r.id]: v })} multiline maxLength={1500} />
                      <div className="actions">
                        <button type="submit" className="btn btn--ghost" disabled={act.busy || !(reply[r.id] ?? '').trim()}>
                          Send
                        </button>
                        <button
                          type="button"
                          className="link-q t-small dimmer"
                          onClick={() =>
                            void act.run(async () => {
                              await rpc('lab_withdraw_introduction', { p_id: r.id })
                              await reqs.reload()
                            })
                          }
                        >
                          Withdraw request
                        </button>
                      </div>
                    </form>
                  ) : null}
                  {r.opportunity_id ? (
                    <Link to={`/lab/opportunities?id=${r.opportunity_id}`} className="link-q go t-small">
                      Follow it in Opportunities
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <Empty title="No requests yet." body="Request an introduction from a match, or ask us to research partners for a market.">
              <button type="button" className="btn btn--ghost" onClick={() => setResearch(true)}>
                Request research
              </button>
            </Empty>
          )}
        </section>
      ) : null}

      <IntroDialog
        brandId={brandId}
        partner={intro}
        onClose={() => setIntro(null)}
        onDone={() => {
          setIntro(null)
          setFlash('Request sent. Our team reviews it before anyone is contacted; follow it under Requests.')
          void latest.reload()
          if (tab === 'requests') void reqs.reload()
          if (tab === 'shortlist') void saved.reload()
        }}
      />
      <ResearchDialog
        brandId={brandId}
        open={research}
        onClose={() => setResearch(false)}
        onDone={() => {
          setResearch(false)
          setFlash('Research request sent. We’ll update you under Requests.')
          if (tab === 'requests') void reqs.reload()
        }}
      />
      <ProfileDialog brandId={brandId} partnerId={profile} onClose={() => setProfile(null)} />
    </div>
  )
}
