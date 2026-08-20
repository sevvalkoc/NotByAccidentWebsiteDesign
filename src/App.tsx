import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import NewsletterPopup from '@/components/NewsletterPopup'
import Home from '@/pages/Home'
import Work from '@/pages/Work'
import CaseStudies from '@/pages/CaseStudies'
import CaseStudy from '@/pages/CaseStudy'
import Capabilities from '@/pages/Capabilities'
import CapabilityDetail from '@/pages/CapabilityDetail'
import About from '@/pages/About'
import Blog from '@/pages/Blog'
import BlogPost from '@/pages/BlogPost'
import Trainings from '@/pages/Trainings'
import Reports from '@/pages/Reports'
import Contact from '@/pages/Contact'
import Search from '@/pages/Search'
import Privacy from '@/pages/Privacy'
import Cookies from '@/pages/Cookies'
import NotFound from '@/pages/NotFound'
import { LocaleProvider, type Locale } from '@/i18n/locale'

/* The admin dashboard is a separate application in every sense but the
   deployment — code-split so public visitors never download its JS. */
const AdminApp = lazy(() => import('@/admin/AdminApp'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/* One public route tree, reused for English (unprefixed), Dutch (/nl) and
   French (/fr) — each mount wraps it in a LocaleProvider so every hook and
   <Link> underneath resolves copy and paths for that language. Translations
   are static (src/data.nl.ts, src/data.fr.ts, src/content.nl.ts,
   src/content.fr.ts) and never touch the CMS/admin panel. */
function PublicShell({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider value={locale}>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/case-studies" element={<CaseStudies />} />
        <Route path="/case-studies/:slug" element={<CaseStudy />} />
        <Route path="/capabilities" element={<Capabilities />} />
        <Route path="/capabilities/:slug" element={<CapabilityDetail />} />
        <Route path="/studio" element={<About />} />
        <Route path="/notes" element={<Blog />} />
        <Route path="/notes/:slug" element={<BlogPost />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      <NewsletterPopup />
    </LocaleProvider>
  )
}

/* The admin dashboard is a private operating tool, not part of the public
   brand experience — it deliberately skips the public Nav/Footer/newsletter
   popup, locale routing and gets its own layout (see src/admin/AdminApp.tsx). */
function AppShell() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route path="/nl/*" element={<PublicShell locale="nl" />} />
        <Route path="/fr/*" element={<PublicShell locale="fr" />} />
        <Route path="/*" element={<PublicShell locale="en" />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
