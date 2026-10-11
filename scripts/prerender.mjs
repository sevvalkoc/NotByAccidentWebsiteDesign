/* Build step 4: render every route to static HTML, then write the
   sitemap, robots.txt, the 404 page, the admin shell and host config. */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, cpSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const client = join(root, 'dist/client')
const SITE = 'https://notbyaccident.com'

const { render, paths, extraPaths, ready } = await import(pathToFileURL(join(root, 'dist/server/entry-server.js')).href)
await ready
let template = readFileSync(join(client, 'index.html'), 'utf8')

// Preload the two faces the first screen needs (latin, upright).
const fonts = readdirSync(join(client, 'assets')).filter(f => /^(lora|dm-sans)-latin-wght-normal.*\.woff2$/.test(f))
const preload = fonts.map(f => `<link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`).join('\n    ')
template = template.replace('<!--head-->', `${preload}\n    <!--head-->`)

const write = (urlPath, html) => {
  const dir = urlPath === '/' ? client : join(client, urlPath)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), html)
}
const page = (url, lang) => {
  const { html, head } = render(url)
  // First paint in the page's opening environment, so colours don't jump at hydration.
  const env = /data-zone="([a-z]+)"/.exec(html)?.[1] ?? 'void'
  return template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace('<body>', `<body data-env="${env}">`)
    .replace('<!--head-->', head)
    .replace('<!--app-->', html)
}
const langOf = p => (p.startsWith('/nl') ? 'nl' : p.startsWith('/fr') ? 'fr' : 'en')

const all = paths()
const noindex = new Set()
let n = 0
for (const { path } of all) {
  const html = page(path, langOf(path))
  // A page set to noindex in the CMS stays reachable but leaves the sitemap.
  if (/<meta name="robots" content="noindex/.test(html)) noindex.add(path)
  write(path, html)
  n++
}
for (const p of extraPaths) {
  write(p, page(p, langOf(p)))
  n++
}

// 404s, one per language, served by the host for unknown URLs.
writeFileSync(join(client, '404.html'), page('/404', 'en'))
for (const l of ['nl', 'fr']) {
  mkdirSync(join(client, l), { recursive: true })
  writeFileSync(join(client, l, '404.html'), page(`/${l}/404`, l))
}

// Admin: an empty shell, rendered client-side only, never indexed.
mkdirSync(join(client, 'admin'), { recursive: true })
writeFileSync(
  join(client, 'admin/index.html'),
  template.replace('<!--head-->', '<title>Admin · Not by Accident</title>\n    <meta name="robots" content="noindex, nofollow">').replace('<!--app-->', ''),
)
rmSync(join(client, 'index.html.tmp'), { force: true })

// Sitemap with hreflang alternates.
const today = new Date().toISOString().slice(0, 10)
const listed = all.filter(u => !noindex.has(u.path))
const xmlUrls = listed
  .map(u => {
    const alts = u.alternates
      .map(a => `    <xhtml:link rel="alternate" hreflang="${langOf(a)}" href="${SITE}${a}"/>`)
      .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${u.alternates[0]}"/>`)
      .join('\n')
    return `  <url>\n    <loc>${SITE}${u.path}</loc>\n${alts}\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`
  })
  .join('\n')
writeFileSync(
  join(client, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${xmlUrls}\n</urlset>\n`,
)
writeFileSync(join(client, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /search\n\nSitemap: ${SITE}/sitemap.xml\n`)

// Netlify-style fallbacks (the previous repo shipped a _redirects file too).
writeFileSync(join(client, '_redirects'), ['/admin/*  /admin/index.html  200', '/lab/*  /lab/app/index.html  200', '/nl/*  /nl/404.html  404', '/fr/*  /fr/404.html  404', '/*  /404.html  404', ''].join('\n'))

console.log(`prerender: ${n} pages, sitemap with ${listed.length} URLs${noindex.size ? ` (${noindex.size} noindex left out)` : ''}, fonts preloaded: ${fonts.length}`)
if (!existsSync(join(client, 'og-default.jpg'))) console.warn('prerender: og-default.jpg missing')
void cpSync
