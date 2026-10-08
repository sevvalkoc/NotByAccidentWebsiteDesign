/* Static SEO audit over dist/client: run after `pnpm build`. */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative } from 'node:path'

const dir = 'dist/client'
const files = []
const walk = d => readdirSync(d).forEach(f => { const p = join(d, f); statSync(p).isDirectory() ? (f !== 'assets' && f !== 'admin' && walk(p)) : f === 'index.html' && files.push(p) })
walk(dir)
const urlOf = f => '/' + relative(dir, f).replace(/index\.html$/, '').replace(/\/$/, '')
const exists = path => {
  const clean = path.split('#')[0].split('?')[0].replace(/\/$/, '') || '/'
  return existsSync(join(dir, clean, 'index.html')) || existsSync(join(dir, clean))
}
const titles = new Map(), descs = new Map()
let problems = 0, links = 0, jsonld = 0
const flag = (u, m) => { problems++; console.log(`✗ ${u}: ${m}`) }
for (const f of files) {
  const html = readFileSync(f, 'utf8')
  const u = urlOf(f)
  const body = html.split('<div id="root">')[1] ?? ''
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1]
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]
  const robots = html.match(/<meta name="robots" content="([^"]*)"/)?.[1] ?? ''
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  const h1 = (body.match(/<h1[\s>]/g) || []).length
  if (!title) flag(u, 'no title')
  if (!desc) flag(u, 'no description')
  else if (desc.length > 170 || desc.length < 50) console.log(`  note ${u}: description ${desc.length} chars`)
  if (h1 !== 1) flag(u, `${h1} h1`)
  if (!robots.includes('noindex')) {
    if (canonical !== 'https://notbyaccident.com' + (u === '/' ? '' : u) && !(u === '/' && canonical === 'https://notbyaccident.com/')) flag(u, `canonical ${canonical}`)
    if ((html.match(/hreflang=/g) || []).length < 4) flag(u, 'hreflang missing')
    titles.set(title, [...(titles.get(title) ?? []), u])
    descs.set(desc, [...(descs.get(desc) ?? []), u])
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); jsonld++ } catch { flag(u, 'invalid JSON-LD') }
  }
  for (const m of body.matchAll(/<img\b[^>]*>/g)) if (!/\balt=/.test(m[0])) flag(u, 'img without alt')
  for (const m of body.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
    const href = m[1].replace(/&amp;/g, '&')
    if (!href.startsWith('/') || href.startsWith('//')) continue
    links++
    if (href.includes('an-accident')) continue // the deliberate 404
    if (!exists(href)) flag(u, `broken link ${href}`)
  }
}
for (const [t, us] of titles) if (us.length > 1) flag(us.join(', '), `duplicate title "${t}"`)
for (const [d, us] of descs) if (us.length > 1) flag(us.slice(0, 4).join(', '), `duplicate description (${us.length})`)
console.log(`${files.length} pages · ${links} internal links · ${jsonld} JSON-LD blocks · ${problems} problems`)
