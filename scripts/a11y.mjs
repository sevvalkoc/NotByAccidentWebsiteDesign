/* axe-core pass over representative pages (pnpm preview must be running). */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'
const axe = readFileSync(new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const pages = (process.argv[2] ?? '/,/work,/case-studies/lavanta,/capabilities,/capabilities/seo,/studio,/notes,/notes/the-brief-is-never-the-brief,/contact,/trainings,/privacy,/cookies,/search,/an-accident,/fr').split(',')
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' })
let total = 0
for (const p of pages) {
  const page = await ctx.newPage()
  await page.route('**/images.unsplash.com/**', r => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"/>' }))
  await page.goto('http://localhost:4173' + p, { waitUntil: 'networkidle' })
  await page.addScriptTag({ content: axe })
  const r = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] })).violations.map(v => `${v.impact} ${v.id}: ${v.nodes.length}× ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`))
  total += r.length
  console.log(`${r.length ? '✗' : '✓'} ${p}${r.length ? '\n   ' + r.join('\n   ') : ''}`)
  await page.close()
}
await b.close()
console.log(`${total} violation types`)
