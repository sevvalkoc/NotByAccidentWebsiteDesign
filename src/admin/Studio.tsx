import SimpleCollection from '@/admin/SimpleCollection'

/* Team members are structured CMS entries. Full Studio page copy (the
   opening statement, principles, culture text) is not yet wired to a live
   editor — that depends on the generic Pages/Sections editor, which is
   scaffolded in the database (see `pages` / `page_sections`) but not yet
   built here. See docs/CMS.md. */
export default function Studio() {
  return (
    <SimpleCollection
      config={{
        table: 'team_members',
        title: 'Studio — Team',
        description: 'People shown on the Studio page. Page copy (story, principles, culture) is not yet CMS-managed — see docs/CMS.md.',
        titleKey: 'name',
        orderKey: 'sort_order',
        activeKey: 'is_active',
        fields: [
          { key: 'name', label: 'Name', type: 'text', required: true },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'bio', label: 'Bio', type: 'textarea' },
          { key: 'portrait_media_id', label: 'Portrait', type: 'media' },
          { key: 'email', label: 'Email', type: 'text' },
          { key: 'social_url', label: 'Social URL', type: 'url' },
          { key: 'personal_url', label: 'Personal URL', type: 'url' },
        ],
      }}
    />
  )
}
