/* Global styles first: component and page CSS must be able to override them. */
import '@/styles/fonts.css'
import '@/styles/tokens.css'
import '@/styles/base.css'
import '@/styles/motion.css'
import '@/styles/page.css'
import { Suspense, lazy, useEffect } from 'react'
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

/* The CMS operating tool. Separate app, separate chunk, separate CSS:
   public visitors never download it. */
const AdminApp = lazy(() => import('@/admin/AdminApp'))

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
