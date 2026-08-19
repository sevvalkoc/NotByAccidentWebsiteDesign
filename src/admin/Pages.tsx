import { AdminPageHeader, AdminCard } from '@/admin/ui'

/* The database has everything a generic page/section editor needs
   (`pages` and `page_sections` — see supabase/migrations/0001_init.sql):
   eyebrow, title, subtitle, body, CTA label/URL, image, visibility and
   order, per section, per page. What's not built yet is this screen and
   the corresponding read-wiring on the homepage's Hero and section
   headings (they still come from src/content.ts's static seed).
   Everything else in this CMS (Work, Notes, Testimonials, Clients,
   Partners, Team, Trainings, Reports, Settings, Navigation) is already
   live. This is the one clearly-scoped follow-up. */
export default function Pages() {
  return (
    <div>
      <AdminPageHeader title="Pages" description="Structured copy editing for Home, Studio and other pages." />
      <AdminCard className="p-6 max-w-2xl">
        <p className="text-sm text-gray-700 mb-2">Not built yet.</p>
        <p className="text-sm text-gray-500">
          The database already has a <code className="bg-gray-100 px-1 rounded">pages</code> /{' '}
          <code className="bg-gray-100 px-1 rounded">page_sections</code> schema designed for this — eyebrow, title,
          subtitle, body, CTA, image, visibility and order per section — but the editor screen here, and the
          corresponding read-side wiring on the homepage hero and section headings, hasn't been built yet. Everything
          else in this dashboard (Work, Notes, Testimonials, Clients, Partners, Studio team, Trainings, Reports,
          Settings, Navigation, SEO) is live. See docs/CMS.md for the full list of what's covered.
        </p>
      </AdminCard>
    </div>
  )
}
