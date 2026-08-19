import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { AdminPageHeader, AdminCard, AdminButton } from '@/admin/ui'

interface Counts {
  workPublished: number
  workDraft: number
  articlesPublished: number
  articlesDraft: number
  trainings: number
  reports: number
  media: number
  newSubmissions: number
}

interface RecentItem {
  kind: string
  title: string
  href: string
  updated_at: string
}

export default function Dashboard() {
  const [counts, setCounts] = useState<Counts | null>(null)
  const [recent, setRecent] = useState<RecentItem[]>([])

  useEffect(() => {
    if (!supabase) return
    async function load() {
      const [
        workPublished, workDraft, articlesPublished, articlesDraft,
        trainings, reports, media, submissions, recentWork, recentArticles,
      ] = await Promise.all([
        supabase!.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase!.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase!.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase!.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase!.from('trainings').select('id', { count: 'exact', head: true }),
        supabase!.from('reports').select('id', { count: 'exact', head: true }),
        supabase!.from('media').select('id', { count: 'exact', head: true }),
        supabase!.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase!.from('projects').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
        supabase!.from('articles').select('id, title, updated_at').order('updated_at', { ascending: false }).limit(5),
      ])

      setCounts({
        workPublished: workPublished.count ?? 0,
        workDraft: workDraft.count ?? 0,
        articlesPublished: articlesPublished.count ?? 0,
        articlesDraft: articlesDraft.count ?? 0,
        trainings: trainings.count ?? 0,
        reports: reports.count ?? 0,
        media: media.count ?? 0,
        newSubmissions: submissions.count ?? 0,
      })

      const items: RecentItem[] = [
        ...((recentWork.data as { id: string; title: string; updated_at: string }[]) ?? []).map(r => ({
          kind: 'Work', title: r.title, href: `/admin/work/${r.id}`, updated_at: r.updated_at,
        })),
        ...((recentArticles.data as { id: string; title: string; updated_at: string }[]) ?? []).map(r => ({
          kind: 'Article', title: r.title, href: `/admin/notes/${r.id}`, updated_at: r.updated_at,
        })),
      ].sort((a, b) => +new Date(b.updated_at) - +new Date(a.updated_at)).slice(0, 8)
      setRecent(items)
    }
    void load()
  }, [])

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="An overview of what's published, what's in progress, and what needs a look." />

      {!counts ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard label="Work — published" value={counts.workPublished} />
            <StatCard label="Work — draft" value={counts.workDraft} />
            <StatCard label="Articles — published" value={counts.articlesPublished} />
            <StatCard label="Articles — draft" value={counts.articlesDraft} />
            <StatCard label="Trainings" value={counts.trainings} />
            <StatCard label="Reports" value={counts.reports} />
            <StatCard label="Media files" value={counts.media} />
            <StatCard label="New submissions" value={counts.newSubmissions} highlight={counts.newSubmissions > 0} />
          </div>

          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-900 mb-3">Quick actions</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/admin/work/new"><AdminButton variant="secondary">+ New Work</AdminButton></Link>
              <Link to="/admin/notes/new"><AdminButton variant="secondary">+ New Article</AdminButton></Link>
              <Link to="/admin/reports/new"><AdminButton variant="secondary">+ Upload Report</AdminButton></Link>
              <Link to="/admin/trainings/new"><AdminButton variant="secondary">+ Upload Training</AdminButton></Link>
              <Link to="/admin/media"><AdminButton variant="secondary">+ Add Image</AdminButton></Link>
              <Link to="/admin/pages"><AdminButton variant="secondary">Edit Homepage</AdminButton></Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900 mb-3">Recently updated</p>
            <AdminCard>
              {recent.length === 0 ? (
                <p className="text-sm text-gray-400 p-4">Nothing yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recent.map(item => (
                    <li key={item.href} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-gray-700">
                        <span className="text-xs text-gray-400 mr-2">{item.kind}</span>
                        {item.title}
                      </span>
                      <Link to={item.href} className="text-xs text-blue-600 hover:underline">Edit</Link>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <AdminCard className={`p-4 ${highlight ? 'border-blue-300 bg-blue-50' : ''}`}>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
    </AdminCard>
  )
}
