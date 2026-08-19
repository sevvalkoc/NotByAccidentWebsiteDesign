import SimpleCollection from '@/admin/SimpleCollection'

export default function Partners() {
  return (
    <SimpleCollection
      config={{
        table: 'partners',
        title: 'Partners',
        description: 'Logos in the homepage partners slider — a separate list from Clients.',
        titleKey: 'partner_name',
        orderKey: 'sort_order',
        activeKey: 'is_active',
        fields: [
          { key: 'partner_name', label: 'Partner name', type: 'text', required: true },
          { key: 'logo_media_id', label: 'Logo', type: 'media' },
          { key: 'website_url', label: 'Website URL', type: 'url' },
          { key: 'alt_text', label: 'Alt text', type: 'text' },
        ],
      }}
    />
  )
}
