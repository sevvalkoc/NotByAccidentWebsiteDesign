/* Global styles first: component and page CSS must be able to override them. */
import '@/styles/fonts.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/motion.css'
import '@/styles/page.css'
import { Suspense, lazy, useEffect, useSyncExternalStore } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { LocaleProvider, type Locale } from '@/i18n/locale'
import { startLiveContent } from '@/content'
import { useCuts } from '@/hooks/useInView'
import { useEnvironment } from '@/hooks/useEnvironment'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Work from '@/pages/Work'
import CaseStudies from '@/pages/CaseStudies'
import CaseStudy from '@/pages/CaseStudy'
import Capabilities from '@/pages/Capabilities'
import Capability from '@/pages/Capability'
import Studio from '@/pages/Studio'
import Notes from '@/pages/Notes'
import Note from '@/pages/Note'
import Trainings from '@/pages/Trainings'
import Reports from '@/pages/Reports'
import Contact from '@/pages/Contact'
import Search from '@/pages/Search'
import Privacy from '@/pages/Privacy'
import Cookies from '@/pages/Cookies'
import NotFound from '@/pages/NotFound'
import LabLanding from '@/lab/public/Landing'
import LabHow from '@/lab/public/HowItWorks'
import LabReadiness from '@/lab/public/Readiness'
import { LabForgot, LabLogin, LabReset, LabSignUp } from '@/lab/public/Auth'
import { usePage } from '@/hooks/usePage'

/* The CMS operating tool. Separate app, separate chunk, separate CSS:
   public visitors never download it. */
const AdminApp = lazy(() => import('@/admin/AdminApp'))

/* The signed-in Lab: its own chunk, never prerendered beyond this shell
   (served for every /lab/… URL that isn't a public page, see vercel.json). */
const LabApp = lazy(() => import('@/lab/app/LabApp'))
const noop = () => () => {}
function LabAppShell() {
  usePage({ title: 'The Lab', description: 'Your workspace in The Lab by Not by Accident.', path: '/lab/app', noindex: true, alternates: false })
  // The server (and hydration) render the plain fallback; the lazy chunk
  // mounts only afterwards, so nothing suspends during renderToString.
  const hydrated = useSyncExternalStore(noop, () => true, () => false)
  const fallback = (
    <main id="main" tabIndex={-1} className="lab lab-app" data-zone="frost">
      <p className="wrap lab-boot t-caption">Opening The Lab…</p>
    </main>
  )
  if (!hydrated) return fallback
  return (
    <Suspense fallback={fallback}>
      <LabApp />
    </Suspense>
  )
}

function Shell({ locale }: { locale: Locale }) {
  const { pathname } = useLocation()
  useCuts(pathname)
  useEnvironment(pathname)
  useEffect(() => startLiveContent(), [])
  return (
    <LocaleProvider value={locale}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudy />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/capabilities/:slug" element={<Capability />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/notes/:slug" element={<Note />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        {locale === 'en' ? (
          <>
            <Route path="/lab" element={<LabLanding />} />
            <Route path="/lab/how-it-works" element={<LabHow />} />
            <Route path="/lab/market-readiness" element={<LabReadiness />} />
            <Route path="/lab/sign-up" element={<LabSignUp />} />
            <Route path="/lab/login" element={<LabLogin />} />
            <Route path="/lab/forgot-password" element={<LabForgot />} />
            <Route path="/lab/reset-password" element={<LabReset />} />
            <Route path="/lab/*" element={<LabAppShell />} />
          </>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </LocaleProvider>
  )
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div style={{ minHeight: '100vh', background: '#f9fafb' }} />}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route path="/nl/*" element={<Shell locale="nl" />} />
      <Route path="/fr/*" element={<Shell locale="fr" />} />
      <Route path="/*" element={<Shell locale="en" />} />
    </Routes>
  )
}
