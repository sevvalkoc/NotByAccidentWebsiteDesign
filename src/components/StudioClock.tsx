import { useEffect, useState } from 'react'
import { useCopy } from '@/content'
import { DATE_LOCALE, useLocale } from '@/i18n/locale'

/* Studio hours as published on the site: Monday–Thursday, 10:00–17:00 CET.
   If the hours change in the CMS, change them here too. */
const OPEN_DAYS = [1, 2, 3, 4]
const OPEN_H = 10
const CLOSE_H = 17
const TZ = 'Europe/Amsterdam'

function amsterdamParts(d: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d)
  const get = (t: string) => parts.find(p => p.type === t)?.value ?? ''
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  return { day, h: Number(get('hour')), m: Number(get('minute')) }
}

/** "Studio open · 14:32 in Amsterdam". Rendered after mount only: the server
 *  can't know the reader's moment, and a wrong time is worse than none. */
export default function StudioClock({ className = '' }: { className?: string }) {
  const copy = useCopy()
  const locale = useLocale()
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 20_000)
    return () => window.clearInterval(id)
  }, [])

  let text = '\u00a0'
  let isOpen: boolean | undefined
  if (now) {
    const { day, h, m } = amsterdamParts(now)
    const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
    const open = OPEN_DAYS.includes(day) && h >= OPEN_H && h < CLOSE_H
    isOpen = open
    if (open) text = copy.clock.open(time)
    else {
      let offset = 0
      if (!(OPEN_DAYS.includes(day) && h < OPEN_H)) {
        offset = 1
        while (!OPEN_DAYS.includes((day + offset) % 7)) offset++
      }
      const dayName =
        offset === 0
          ? copy.clock.today
          : offset === 1
            ? copy.clock.tomorrow
            : new Intl.DateTimeFormat(DATE_LOCALE[locale], { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 7 + ((day + offset) % 7))))
      text = copy.clock.closed(time, `${dayName} ${OPEN_H}:00`)
    }
  }
  return (
    <p className={`t-cap ${className}`} aria-live="off">
      <span aria-hidden="true" className="clock-dot" data-open={isOpen === undefined ? undefined : String(isOpen)} />
      {text}
    </p>
  )
}
