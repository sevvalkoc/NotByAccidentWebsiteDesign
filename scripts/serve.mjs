/* Local preview of the built site with the same rules as vercel.json:
   clean URLs, /admin and /lab app shells, per-language 404s with a real 404 status,
   and Brotli/gzip for text files as Vercel serves them, so the footer's
   carbon tracker reads the same weight here as in production. */
import { createServer } from 'node:http'
import { brotliCompressSync, gzipSync, constants } from 'node:zlib'
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = join(dirname(fileURLToPath(import.meta.url)), '../dist/client')
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }
const port = Number(process.env.PORT || 4173)
const compressible = new Set(['.html', '.js', '.css', '.xml', '.txt', '.json', '.webmanifest', '.svg'])
const packed = new Map()
const pack = (file, enc) => {
  const key = `${enc}:${file}:${statSync(file).mtimeMs}`
  if (!packed.has(key)) {
    const raw = readFileSync(file)
    packed.set(key, enc === 'br' ? brotliCompressSync(raw, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }) : gzipSync(raw, { level: 9 }))
  }
  return packed.get(key)
}

createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])
  let file = join(dir, url)
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  let status = 200
  if (!existsSync(file)) {
    if (url.startsWith('/admin')) file = join(dir, 'admin/index.html')
    else if (url.startsWith('/lab/')) file = join(dir, 'lab/app/index.html')
    else {
      status = 404
      file = join(dir, url.startsWith('/nl/') ? 'nl/404.html' : url.startsWith('/fr/') ? 'fr/404.html' : '404.html')
    }
  }
  const headers = { 'content-type': types[extname(file)] || 'application/octet-stream', vary: 'accept-encoding' }
  const accept = String(req.headers['accept-encoding'] || '')
  const enc = !compressible.has(extname(file)) ? null : /\bbr\b/.test(accept) ? 'br' : /\bgzip\b/.test(accept) ? 'gzip' : null
  if (enc) headers['content-encoding'] = enc
  res.writeHead(status, headers)
  res.end(enc ? pack(file, enc) : readFileSync(file))
}).listen(port, () => console.log(`serving dist/client on http://localhost:${port}`))
