import SimpleCollection from '@/admin/SimpleCollection'

export default function Clients() {
  return (
    <SimpleCollection
      config={{
        table: 'clients',
        title: 'Clients',
        description: 'Logos in the homepage client slider. Real logos only.',
        titleKey: 'company_name',
        orderKey: 'sort_order',
        activeKey: 'is_active',
        fields: [
          { key: 'company_name', label: 'Company name', type: 'text', required: true },
          { key: 'logo_media_id', label: 'Logo', type: 'media' },
          { key: 'website_url', label: 'Website URL', type: 'url' },
          { key: 'alt_text', label: 'Alt text', type: 'text' },
        ],
      }}
    />
  )
}
