import SimpleCollection from '@/admin/SimpleCollection'

export default function Testimonials() {
  return (
    <SimpleCollection
      config={{
        table: 'testimonials',
        title: 'Testimonials',
        description: 'Editorial social proof shown on the homepage. Quote, person, role, company — nothing else.',
        titleKey: 'person_name',
        orderKey: 'sort_order',
        activeKey: 'is_active',
        fields: [
          { key: 'quote', label: 'Quote', type: 'textarea', required: true },
          { key: 'person_name', label: 'Person', type: 'text', required: true },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'company', label: 'Company', type: 'text' },
          { key: 'photo_media_id', label: 'Photo', type: 'media' },
        ],
      }}
    />
  )
}
