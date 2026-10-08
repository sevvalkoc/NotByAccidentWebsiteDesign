/* Visual + runtime QA against the built site (pnpm preview must be running).
   node scripts/qa.mjs --pages=/,/work --widths=375,1440 [--full] [--motion=reduce] [--scroll=0.5]
   Writes screenshots to qa-output/ and prints console errors, hydration
   warnings and horizontal overflow per page and width. */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const arg = (k, d) => (process.argv.find(a => a.startsWith(`--${k}=`)) ?? `--${k}=${d}`).split('=')[1]
const flag = k => process.argv.includes(`--${k}`)
const base = arg('base', 'http://localhost:4173')
const pages = arg('pages', '/').split(',')
const widths = arg('widths', '375,430,768,1024,1440,1728').split(',').map(Number)
const scrolls = arg('scroll', '').split(',').filter(Boolean).map(Number)
const motion = arg('motion', 'no-preference')
mkdirSync('qa-output', { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
let problems = 0
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 768 ? 812 : 900 }, reducedMotion: motion, deviceScaleFactor: 1 })
  for (const p of pages) {
    const page = await ctx.newPage()
    // QA only: this sandbox can't reach Unsplash, so stand-ins show the frame.
    await page.route('**/images.unsplash.com/**', route => {
      const u = new URL(route.request().url())
      const w = Number(u.searchParams.get('w') || 800)
      const h = Number(u.searchParams.get('h') || Math.round(w * 0.66))
      const id = u.pathname.split('-').pop()
      const hue = [...id].reduce((a, c) => a + c.charCodeAt(0), 0) % 360
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 18% 38%)"/><stop offset="1" stop-color="hsl(${(hue + 40) % 360} 22% 18%)"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="24" y="${h - 24}" font-family="monospace" font-size="${Math.max(12, w / 40)}" fill="rgba(240,234,218,.6)">image stand-in · ${id}</text></svg>`
      route.fulfill({ status: 200, contentType: 'image/svg+xml', body: svg })
    })
    const errs = []
    page.on('console', m => (m.type() === 'error' || /hydrat/i.test(m.text())) && errs.push(m.text().slice(0, 220)))
    page.on('pageerror', e => errs.push('pageerror: ' + e.message.slice(0, 220)))
    const res = await page.goto(base + p, { waitUntil: 'networkidle' })
    await page.waitForTimeout(900)
    const overflow = await page.evaluate(() => {
      const sw = document.documentElement.scrollWidth
      const bad = sw > innerWidth ? [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).slice(0, 4).map(e => e.tagName + '.' + e.className) : []
      return { sw, iw: innerWidth, bad }
    })
    const name = `${p.replace(/\//g, '_') || '_'}-${w}`
    if (scrolls.length) {
      for (const s of scrolls) {
        await page.evaluate(f => window.scrollTo(0, f * innerHeight), s)
        await page.waitForTimeout(700)
        await page.screenshot({ path: `qa-output/${name}-s${s}.png` })
      }
    } else {
      // Walk the page so in-view reveals fire, then capture.
      if (flag('full')) {
        const h = await page.evaluate(() => document.body.scrollHeight)
        for (let y = 0; y < h; y += 400) {
          await page.evaluate(yy => window.scrollTo(0, yy), y)
          await page.waitForTimeout(90)
        }
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(700)
      }
      await page.screenshot({ path: `qa-output/${name}.png`, fullPage: flag('full') })
    }
    const status = res?.status()
    const issue = errs.length || overflow.sw > overflow.iw
    if (issue) problems++
    console.log(`${issue ? '✗' : '✓'} ${w} ${p} [${status}]${overflow.sw > overflow.iw ? ` overflow ${overflow.sw}>${overflow.iw} ${overflow.bad.join(' ')}` : ''}${errs.length ? '\n   ' + errs.join('\n   ') : ''}`)
    await page.close()
  }
  await ctx.close()
}
await browser.close()
console.log(problems ? `${problems} page(s) with issues` : 'no runtime issues')
