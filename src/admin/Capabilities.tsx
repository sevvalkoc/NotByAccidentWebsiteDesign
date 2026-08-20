import SimpleCollection from '@/admin/SimpleCollection'

const CATEGORY_OPTIONS = ['Brand & Identity', 'Digital & Product', 'Growth & Demand', 'Market & Expansion', 'Experiences']

export default function Capabilities() {
  return (
    <SimpleCollection
      config={{
        table: 'capabilities',
        title: 'Capabilities',
        description:
          'Every capability behind the /capabilities index and its own SEO landing page — what Work items and case studies link back to.',
        titleKey: 'name',
        orderKey: 'sort_order',
        activeKey: 'is_active',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'slug', label: 'Slug', type: 'text', required: true },
          { key: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS, required: true },
          { key: 'summary', label: 'Summary (listing card)', type: 'textarea' },
          { key: 'lede', label: 'Lede (top of its own page)', type: 'textarea' },
          { key: 'question', label: 'Question it answers', type: 'text' },
          { key: 'outcome', label: 'Outcome', type: 'text' },
          { key: 'includes', label: 'What it includes', type: 'string-array', hint: 'Comma-separated.' },
          { key: 'queries', label: 'Search queries it should rank for', type: 'string-array', hint: 'Comma-separated — feeds SEO, not shown publicly.' },
        ],
      }}
    />
  )
}
