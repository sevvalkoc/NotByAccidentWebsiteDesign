/* Brand marks, rendered from the supplied Ink artwork (NBA_*_Ink_RGB.png)
   as CSS masks, so they recolour to any approved one-colour version without
   ever being redrawn or re-typeset. Aspect ratios are the artwork's own. */
import './logo.css'

export function Lockup({ label = 'Not by Accident', className = '' }: { label?: string; className?: string }) {
  return label ? (
    <span role="img" aria-label={label} className={`mark mark--lockup ${className}`} />
  ) : (
    <span aria-hidden="true" className={`mark mark--lockup ${className}`} />
  )
}

export function Wordmark({ label = 'Not by Accident', className = '' }: { label?: string; className?: string }) {
  return label ? (
    <span role="img" aria-label={label} className={`mark mark--wordmark ${className}`} />
  ) : (
    <span aria-hidden="true" className={`mark mark--wordmark ${className}`} />
  )
}
