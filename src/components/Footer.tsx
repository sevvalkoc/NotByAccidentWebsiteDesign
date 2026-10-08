import { useLocation } from 'react-router-dom'
import Link from './Link'
import { Wordmark } from './Logo'
import EmailCapture from './EmailCapture'
import StudioClock from './StudioClock'
import ClimateTracker from './ClimateTracker'
import Zone from './Zone'
import { useCopy, useMenu, useSection, useSite } from '@/content'
import { LOCALES, LOCALE_LABEL, LOCALE_NAME, localizePath, stripLocale, useLocale } from '@/i18n/locale'
import './footer.css'

/** A quiet last frame. Everything here comes from the CMS: the closing
 *  line and newsletter copy (Pages → Global), the menu, and the contact
 *  details (Site Settings). */
export default function Footer() {
  const copy = useCopy()
  const site = useSite()
  const locale = useLocale()
  const menu = useMenu('footer_nav')
  const f = useSection('global', 'footer')
  const { pathname } = useLocation()
  const current = stripLocale(pathname).path
  const c = site.company
  const lastLine = (f?.extra?.lastLine as string) || ''
  const lastLink = (f?.extra?.lastLink as string) || ''
  const address = [c.address.line1, c.address.line2, [c.address.postcode, c.address.city].filter(Boolean).join(' '), c.address.country].filter(Boolean)

  return (
    <Zone as="footer" env="void" className="ftr">
      <div className="wrap ftr__top">
        {f?.title ? <p className="t-section ftr__closing">{f.title}</p> : <span />}
        <div className="ftr__news">
          {f?.body ? <p className="t-small dim">{f.body}</p> : null}
          <EmailCapture source="footer" />
        </div>
      </div>

      <div className="wrap ftr__grid t-small">
        <nav aria-label={copy.nav.footer}>
          <ul role="list" className="ftr__list">
            {menu.map(m => (
              <li key={m.url}>
                {m.newTab ? (
                  <a href={m.url} target="_blank" rel="noopener noreferrer" className="link-q">
                    {m.label}
                  </a>
                ) : (
                  <Link to={m.url} className="link-q">
                    {m.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <dl className="ftr__dl">
          <div>
            <dt className="dimmer">{copy.footer.newBusiness}</dt>
            <dd>
              <a className="link-q" href={`mailto:${c.newBusinessEmail}`}>
                {c.newBusinessEmail}
              </a>
            </dd>
          </div>
          <div>
            <dt className="dimmer">{copy.footer.general}</dt>
            <dd>
              <a className="link-q" href={`mailto:${c.email}`}>
                {c.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="dimmer">{copy.footer.press}</dt>
            <dd>
              <a className="link-q" href={`mailto:${c.pressEmail}`}>
                {c.pressEmail}
              </a>
            </dd>
          </div>
          {c.phone ? (
            <div>
              <dt className="sr-only">Phone</dt>
              <dd>
                <a className="link-q" href={`tel:${c.phone.replace(/[^+\d]/g, '')}`}>
                  {c.phone}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
        <div className="ftr__meta">
          <StudioClock className="dimmer" />
          <p className="dimmer">{c.hours}</p>
          {address.length ? <address className="dimmer">{address.join(', ')}</address> : null}
          <ul role="list" className="ftr__inline">
            {site.socials.map(s => (
              <li key={s.label}>
                <a className="link-q" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <ClimateTracker />
        </div>
      </div>

      <div className="wrap ftr__base t-caption">
        <Link to="/" aria-label={copy.nav.home} className="ftr__mark">
          <Wordmark label="" />
        </Link>
        <p className="dimmer">
          {copy.footer.rights(new Date().getFullYear())}
          {c.registrationNote && !/to be added|volgen|à compléter/i.test(c.registrationNote) ? ` · ${c.registrationNote}` : ''}
        </p>
        <ul role="list" className="ftr__inline">
          <li>
            <Link to="/privacy" className="link-q">
              {copy.pages.privacy}
            </Link>
          </li>
          <li>
            <Link to="/cookies" className="link-q">
              {copy.pages.cookies}
            </Link>
          </li>
          {LOCALES.map(l => (
            <li key={l}>
              <a className="link-q" href={localizePath(current, l)} hrefLang={l} lang={l} title={LOCALE_NAME[l]} aria-current={l === locale ? 'true' : undefined}>
                {LOCALE_LABEL[l]}
              </a>
            </li>
          ))}
        </ul>
        {lastLine ? (
          <p className="ftr__last dimmer">
            {lastLine}{' '}
            {lastLink ? (
              <Link to="/an-accident" rel="nofollow" className="link">
                {lastLink}
              </Link>
            ) : null}
            .
          </p>
        ) : null}
      </div>
    </Zone>
  )
}
