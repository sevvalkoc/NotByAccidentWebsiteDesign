/* Responsive image. Unsplash-hosted seed images get a real srcset with the
   CDN doing format negotiation (AVIF/WebP). Anything else (CMS uploads) is
   passed through untouched. */
type Props = {
  src: string
  alt: string
  ratio?: number // width / height
  sizes?: string
  priority?: boolean
  className?: string
}

const WIDTHS = [480, 720, 960, 1280, 1680, 2200]

function unsplash(src: string, w: number, ratio?: number) {
  const u = new URL(src)
  u.searchParams.set('w', String(w))
  if (ratio) u.searchParams.set('h', String(Math.round(w / ratio)))
  else u.searchParams.delete('h')
  u.searchParams.set('fit', 'crop')
  u.searchParams.set('auto', 'format')
  // 60 is visually lossless for photography in AVIF/WebP at these sizes and
  // about a third lighter than 72; it keeps the carbon tracker honest-low.
  u.searchParams.set('q', '60')
  u.searchParams.delete('crop')
  u.searchParams.delete('cs')
  u.searchParams.delete('fm')
  return u.toString()
}

export default function Img({ src, alt, ratio, sizes = '100vw', priority, className }: Props) {
  if (!src) return null
  const isUnsplash = src.includes('images.unsplash.com')
  const base = 1280
  const attrs = isUnsplash
    ? { src: unsplash(src, base, ratio), srcSet: WIDTHS.map(w => `${unsplash(src, w, ratio)} ${w}w`).join(', '), sizes }
    : { src }
  return (
    <img
      {...attrs}
      alt={alt}
      width={ratio ? base : undefined}
      height={ratio ? Math.round(base / ratio) : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
    />
  )
}
