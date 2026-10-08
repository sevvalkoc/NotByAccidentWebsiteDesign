import Hero from './home/Hero'
import SelectedWork from './home/SelectedWork'
import Practice from './home/Practice'
import Evidence from './home/Evidence'
import StudioStatement from './home/StudioStatement'
import NotesFeature from './home/NotesFeature'
import ContactCta from './home/ContactCta'
import { usePage } from '@/hooks/usePage'
import { usePageMeta } from '@/content'
import { useLocale } from '@/i18n/locale'
import { website } from '@/seo/schema'
import './home/home.css'

/* What it is → the work → what it does → proof → the studio → how it
   thinks → contact. Every section reads Admin → Homepage. */
export default function Home() {
  const meta = usePageMeta('home')
  const locale = useLocale()
  usePage({ page: 'home', path: '/', fullTitle: true, jsonLd: [website(locale, meta.description)] })
  return (
    <main id="main" tabIndex={-1}>
      <Hero />
      <SelectedWork />
      <Practice />
      <Evidence />
      <StudioStatement />
      <NotesFeature />
      <ContactCta />
    </main>
  )
}
