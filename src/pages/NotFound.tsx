import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Link from '@/components/LocalizedLink'
import Seo from '@/components/Seo'
import { supabase } from '@/lib/supabase'

/* Redirects created in the admin (SEO → Redirects), including the ones
   auto-created when a Work/Article slug changes, are looked up here: this
   is a client-side SPA with no server to issue a real HTTP 301, so a
   checked-then-redirected 404 route is the closest equivalent. Search
   engines that re-crawl the old URL will still see this happen via
   history.replaceState, which is a reasonable approximation but not a true
   301 — worth knowing if redirect SEO value matters for a specific page. */
function useRedirectCheck() {
  const location = useLocation()
  const navigate = useNavigate()
  const [checked, setChecked] = useState(!supabase)

  useEffect(() => {
    if (!supabase) return
    let cancelled = false
    setChecked(false)
    supabase
      .from('redirects')
      .select('to_path')
      .eq('from_path', location.pathname)
      .eq('is_active', true)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled) return
        const target = (data as { to_path: string } | null)?.to_path
        if (target) navigate(target, { replace: true })
        else setChecked(true)
      })
    return () => {
      cancelled = true
    }
  }, [location.pathname, navigate])

  return checked
}

export default function NotFound() {
  const checked = useRedirectCheck()
  if (!checked) return null
  return (
    <main
      id="main"
      style={{
        paddingTop: '56px',
        backgroundColor: '#F0EADA',
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Seo title="Page not found" description="The page you were looking for doesn't exist." path="/404" noindex />
      <div
        className="page-grid w-full"
        style={{
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'clamp(48px, 6vw, 80px)',
          }}
          className="md:grid-cols-[50%_45%]"
        >
          <div>
            <p
              className="t-caption mb-8"
              style={{ color: 'rgba(34,30,27,.35)' }}
            >
              404
            </p>
            <h1
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontSize: 'clamp(32px, 5vw, 72px)',
                fontWeight: 400,
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                color: '#221E1B',
                margin: '0 0 2rem',
                maxWidth: '12ch',
              }}
            >
              This page does not exist.
            </h1>
            <p
              className="t-body"
              style={{ color: 'rgba(34,30,27,.65)', maxWidth: '40ch', marginBottom: '2.5rem' }}
            >
              Everything else does. You may have followed a broken link, or the page has moved.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                to="/"
                className="btn-primary"
                style={{ textDecoration: 'none', display: 'inline-flex' }}
              >
                Go home
              </Link>
              <Link
                to="/work"
                className="btn-ghost"
                style={{ textDecoration: 'none', display: 'inline-flex' }}
              >
                See the work
              </Link>
            </div>
          </div>

          <div style={{ alignSelf: 'start', paddingTop: '1rem' }}>
            <p
              style={{
                fontFamily: 'Lora, Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                lineHeight: 1.6,
                color: 'rgba(34,30,27,.45)',
                margin: 0,
                borderLeft: '2px solid #7F8B3E',
                paddingLeft: '1.5rem',
              }}
            >
              "We make companies wanted. Growth is what happens next."
            </p>
            <p className="t-caption mt-4" style={{ color: 'rgba(34,30,27,.3)', paddingLeft: '1.5rem' }}>
              Not by Accident
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
