/* A report as a PDF, in the studio's editorial manner: one grotesk, the
   serif italic as accent, hairline rules, generous margins, numbers set
   large. Built with pdf-lib in the browser (this module loads on demand). */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import type { ReportSnapshot } from '../api'
import { CATEGORIES, INTRO_STATUS, PURPOSES, VERIFICATION, fmtDate, fmtScore, label, marketName } from '../labels'

const A4: [number, number] = [595.28, 841.89]
const M = 56 // margin
const INK = rgb(0.043, 0.047, 0.059)
const DIM = rgb(0.38, 0.39, 0.41)
const RULE = rgb(0.82, 0.83, 0.82)
const ACCENT = rgb(0.231, 0.267, 0.788)

/** The standard PDF fonts only encode WinAnsi; map the few characters our
 *  copy uses that fall outside it. */
const safe = (s: string | null | undefined) =>
  (s ?? '')
    .replace(/[→↗]/g, '->')
    .replace(/Σ/g, 'sum of')
    .replace(/[✓]/g, 'v')
    .replace(/[^\x20-\x7E\xA0-\xFF–—‘’“”•…€·]/g, '')

class Writer {
  doc: PDFDocument
  page!: PDFPage
  y = 0
  n = 0
  constructor(
    doc: PDFDocument,
    public sans: PDFFont,
    public bold: PDFFont,
    public serif: PDFFont,
    public footer: string,
  ) {
    this.doc = doc
    this.newPage()
  }
  get width() {
    return A4[0] - 2 * M
  }
  newPage() {
    this.page = this.doc.addPage(A4)
    this.n++
    this.y = A4[1] - M
    this.page.drawText(safe(this.footer), { x: M, y: 30, size: 7.5, font: this.sans, color: DIM })
    this.page.drawText(String(this.n), { x: A4[0] - M - 10, y: 30, size: 7.5, font: this.sans, color: DIM })
  }
  need(h: number) {
    if (this.y - h < 60) this.newPage()
  }
  lines(text: string, font: PDFFont, size: number, width = this.width) {
    const out: string[] = []
    for (const para of safe(text).split('\n')) {
      let line = ''
      for (const word of para.split(/\s+/)) {
        const t = line ? `${line} ${word}` : word
        if (font.widthOfTextAtSize(t, size) > width && line) {
          out.push(line)
          line = word
        } else line = t
      }
      out.push(line)
    }
    return out
  }
  text(text: string, { font = this.sans, size = 10, color = INK, gap = 4, x = M, width = this.width, lh = 1.45 } = {}) {
    for (const l of this.lines(text, font, size, width)) {
      this.need(size * lh)
      this.page.drawText(l, { x, y: this.y - size, size, font, color })
      this.y -= size * lh
    }
    this.y -= gap
  }
  label(text: string) {
    this.need(28)
    this.y -= 10
    this.page.drawText(safe(text.toUpperCase()), { x: M, y: this.y - 7, size: 7, font: this.bold, color: DIM })
    this.y -= 16
  }
  rule() {
    this.need(10)
    this.page.drawLine({ start: { x: M, y: this.y }, end: { x: A4[0] - M, y: this.y }, thickness: 0.5, color: RULE })
    this.y -= 10
  }
  bar(name: string, value: number | null, note = '') {
    this.need(18)
    const y = this.y - 9
    this.page.drawText(safe(name), { x: M, y, size: 9.5, font: this.sans, color: INK })
    const x0 = M + 170
    const w = this.width - 170 - 50
    this.page.drawLine({ start: { x: x0, y: y + 3 }, end: { x: x0 + w, y: y + 3 }, thickness: 0.5, color: RULE })
    if (value != null) this.page.drawLine({ start: { x: x0, y: y + 3 }, end: { x: x0 + (w * Math.max(0, Math.min(100, value))) / 100, y: y + 3 }, thickness: 2, color: ACCENT })
    const v = fmtScore(value)
    this.page.drawText(v, { x: A4[0] - M - this.sans.widthOfTextAtSize(v, 9.5), y, size: 9.5, font: this.sans, color: INK })
    this.y -= 18
    if (note) this.text(note, { size: 8, color: DIM, x: x0, width: w })
  }
}

export async function reportPdf(s: ReportSnapshot, title: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  doc.setTitle(safe(title))
  doc.setAuthor('Not by Accident · The Lab')
  doc.setCreator('The Lab by Not by Accident')
  doc.setCreationDate(new Date(s.generated_at))
  const [sans, bold, serif] = await Promise.all([doc.embedFont(StandardFonts.Helvetica), doc.embedFont(StandardFonts.HelveticaBold), doc.embedFont(StandardFonts.TimesRomanItalic)])
  const w = new Writer(doc, sans, bold, serif, `Not by Accident · The Lab · ${s.brand.name ?? ''} · ${fmtDate(s.generated_at)} · Confidential`)

  // Cover
  w.text('NOT BY ACCIDENT  ·  THE LAB', { font: bold, size: 8, color: DIM, gap: 120 })
  w.text('Market readiness report', { font: serif, size: 30, lh: 1.15, gap: 8 })
  w.text(s.brand.name ?? '', { size: 30, lh: 1.15, gap: 24 })
  w.text(`Generated ${fmtDate(s.generated_at)}. A snapshot of the brand profile, readiness result, markets, partners and next steps as they stood on that day.`, { size: 10, color: DIM, gap: 40 })
  const r = s.readiness
  if (r) {
    w.need(80)
    w.page.drawText(fmtScore(r.overall), { x: M, y: w.y - 64, size: 72, font: sans, color: INK })
    w.page.drawText(safe(r.band_label ?? ''), { x: M + 170, y: w.y - 30, size: 16, font: serif, color: INK })
    w.page.drawText(safe(`Questionnaire version ${r.version} · ${r.answered} of ${r.applicable} questions`), { x: M + 170, y: w.y - 48, size: 8.5, font: sans, color: DIM })
    w.y -= 90
    if (r.band_summary) w.text(r.band_summary, { size: 10.5, gap: 8 })
    w.text('Readiness bands are product-defined categories based on your answers. They describe preparation, not the likelihood of success.', { size: 8, color: DIM })
  } else {
    w.text('No readiness result yet: take the assessment and generate a new report.', { color: DIM })
  }

  // Brand
  w.newPage()
  w.label('The brand')
  const b = s.brand
  const facts: [string, string][] = [
    ['Industry', b.industry ?? ''],
    ['Product category', b.product_category ?? ''],
    ['Based in', b.origin_country ? marketName(b.origin_country) : ''],
    ['Sells in', (b.current_markets ?? []).map(marketName).join(', ')],
    ['Price positioning', b.price_tier ?? ''],
    ['Considering', (s.objectives?.target_markets ?? []).map(marketName).join(', ')],
    ['Objective', (s.objectives?.primary_objective ?? '').replace(/_/g, ' ')],
    ['Preferred distribution', (s.objectives?.distribution_model ?? '').replace(/_/g, ' ')],
  ]
  for (const [k, v] of facts.filter(([, v]) => v)) {
    w.need(16)
    w.page.drawText(safe(k), { x: M, y: w.y - 9, size: 8.5, font: sans, color: DIM })
    w.text(v, { x: M + 170, width: w.width - 170, size: 9.5, gap: 2 })
  }
  if (b.description) w.text(b.description, { size: 9.5, color: DIM, gap: 6 })

  if (r) {
    w.label('Readiness by area')
    for (const c of r.categories) w.bar(label(CATEGORIES, c.key), c.score, `weight ${c.weight}%`)
    if (s.strengths.length) w.text(`Strongest: ${s.strengths.map(x => `${label(CATEGORIES, x.key)} (${fmtScore(x.score)})`).join(', ')}.`, { size: 9.5 })
    if (s.risks.length) w.text(`Needs work: ${s.risks.map(x => `${label(CATEGORIES, x.key)} (${fmtScore(x.score)})`).join(', ')}.`, { size: 9.5 })
  }

  if (s.recommendations.length) {
    w.label('Recommendations')
    s.recommendations.forEach((x, i) => {
      w.need(40)
      w.text(`${String(i + 1).padStart(2, '0')}  ${x.title}`, { font: bold, size: 10, gap: 1 })
      w.text(x.body, { size: 9.5, color: DIM, gap: 8, x: M + 18, width: w.width - 18 })
    })
  }

  const mk = s.markets?.markets ?? []
  if (mk.length) {
    w.newPage()
    w.label('Markets')
    if (s.markets?.ranking?.reason) w.text(s.markets.ranking.reason, { size: 8.5, color: DIM, gap: 8 })
    for (const m of mk) {
      w.need(60)
      w.text(`${m.name}  ·  ${m.score == null ? 'not enough information to score' : `market fit ${fmtScore(m.score)}`}`, { font: serif, size: 15, gap: 4 })
      for (const f of m.factors) w.bar(f.label, f.value, `${f.note} (${f.evidence.replace('_', ' ')})`)
      if (m.missing.length) w.text(`Missing: ${m.missing.join(', ')}.`, { size: 8.5, color: DIM })
      for (const n of m.next_steps) w.text(`• ${n}`, { size: 9, gap: 2 })
      if (m.sources.length) w.text(`Sources: ${m.sources.map(x => `${x.title} (${x.url})`).join('; ')}`, { size: 7.5, color: DIM })
      w.rule()
    }
  }

  if (s.saved_matches.length || s.introductions.length || s.partner_types.length) {
    w.label('Partners')
    if (s.partner_types.length) w.text(`Partner types worth approaching: ${s.partner_types.map(t => t.label).join(', ')}.`, { size: 9.5, gap: 8 })
    for (const m of s.saved_matches) {
      w.need(30)
      w.text(`${m.partner.name}  ·  ${m.partner.type_label}${m.score != null ? `  ·  compatibility ${m.score}` : ''}`, { font: bold, size: 9.5, gap: 1 })
      w.text(`${label(VERIFICATION, m.partner.verification_status)}${m.partner.is_fixture ? ' · fictional demo record' : ''}${m.note ? ` · your note: ${m.note}` : ''}`, { size: 8.5, color: DIM, gap: 6 })
    }
    for (const i of s.introductions) w.text(`Introduction: ${i.partner ?? 'research request'} · ${label(PURPOSES, i.purpose)} · ${label(INTRO_STATUS, i.status)} (${fmtDate(i.created_at)})`, { size: 9, gap: 2 })
    w.text('A compatibility score describes how recorded attributes align; it does not mean a partner is interested or available.', { size: 8, color: DIM })
  }

  if (s.next_actions.length) {
    w.label('Next actions')
    s.next_actions.forEach((x, i) => w.text(`${String(i + 1).padStart(2, '0')}  ${x.text}`, { size: 10, gap: 3 }))
  }

  w.label('Method & limitations')
  const mw = s.methodology
  w.text(`Readiness: questionnaire version ${mw.assessment_version ?? '—'}; area weights ${Object.entries(mw.category_weights).map(([k, v]) => `${label(CATEGORIES, k)} ${v}%`).join(', ')}.`, { size: 8.5, color: DIM })
  if (mw.matching_weights) w.text(`Matching: version ${mw.matching_version ?? '—'}; weights ${Object.entries(mw.matching_weights).map(([k, v]) => `${k} ${v}%`).join(', ')}.`, { size: 8.5, color: DIM })
  for (const l of mw.limitations) w.text(`• ${l}`, { size: 8.5, color: DIM, gap: 2 })

  return doc.save()
}
