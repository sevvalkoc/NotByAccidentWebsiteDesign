type LogoStyle = 'serif' | 'sans-tight' | 'sans-wide' | 'mono' | 'italic' | 'black'

const styleMap: Record<LogoStyle, React.CSSProperties> = {
  serif: { fontFamily: 'Lora, Georgia, serif', fontWeight: 500, letterSpacing: '-0.01em' },
  'sans-tight': { fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '-0.03em' },
  'sans-wide': { fontFamily: 'DM Sans, sans-serif', fontWeight: 500, letterSpacing: '0.18em' },
  mono: { fontFamily: 'ui-monospace, "SF Mono", monospace', fontWeight: 500, letterSpacing: '0.02em' },
  italic: { fontFamily: 'Lora, Georgia, serif', fontStyle: 'italic', fontWeight: 500, letterSpacing: '-0.005em' },
  black: { fontFamily: 'DM Sans, sans-serif', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' },
}

/**
 * A continuous monochrome logo wall. Logos are typographic wordmarks rendered
 * in the brand's own faces so the wall reads as distinct marks rather than a
 * text list. Ink on Milk (or Milk on dark when `dark`). Pauses on hover.
 */
export default function LogoMarquee({
  items,
  label,
  dark = false,
  reverse = false,
  speed = 60,
}: {
  items: { name: string; style: LogoStyle }[]
  label: string
  dark?: boolean
  reverse?: boolean
  speed?: number
}) {
  const ink = dark ? 'rgba(240,234,218,' : 'rgba(34,30,27,'
  const doubled = [...items, ...items]

  return (
    <div
      className="logo-wall flex items-stretch"
      style={{
        borderColor: `${ink}0.12)`,
      }}
    >
      <div
        className="relative flex-1 overflow-hidden self-center"
        style={{
          maskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)',
        }}
      >
        <div
          className="marquee-track logo-track"
          aria-hidden="true"
          style={{
            animationDuration: `${speed}s`,
            animationDirection: reverse ? 'reverse' : 'normal',
          }}
        >
          {doubled.map((logo, i) => (
            <span
              key={i}
              className="logo-item"
              style={{
                ...styleMap[logo.style],
                fontSize: '19px',
                color: `${ink}0.55)`,
                paddingRight: '3.25rem',
                whiteSpace: 'nowrap',
                lineHeight: 1,
                transition: 'color 200ms var(--ease-brand)',
              }}
            >
              {logo.name}
            </span>
          ))}
        </div>
      </div>
      <p className="sr-only">{label}: {items.map(i => i.name).join(', ')}</p>
    </div>
  )
}
