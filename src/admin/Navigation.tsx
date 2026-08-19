import SimpleCollection from '@/admin/SimpleCollection'
import { AdminPageHeader } from '@/admin/ui'

export default function Navigation() {
  return (
    <div>
      <AdminPageHeader title="Navigation" description="Header and footer navigation. Changing a URL here does not create a redirect from the old one — do that separately if a route actually changed." />
      <div className="mb-10">
        <SimpleCollection
          config={{
            table: 'navigation_items',
            title: 'Header navigation',
            titleKey: 'label',
            orderKey: 'sort_order',
            activeKey: 'is_visible',
            filter: { column: 'location', value: 'header' },
            fixedValues: { location: 'header' },
            fields: [
              { key: 'label', label: 'Label', type: 'text', required: true },
              { key: 'url', label: 'URL', type: 'text', required: true },
              { key: 'is_internal', label: 'Internal link', type: 'checkbox', default: true },
              { key: 'open_new_tab', label: 'Open in new tab', type: 'checkbox' },
            ],
          }}
        />
      </div>
      <SimpleCollection
        config={{
          table: 'navigation_items',
          title: 'Footer navigation',
          titleKey: 'label',
          orderKey: 'sort_order',
          activeKey: 'is_visible',
          filter: { column: 'location', value: 'footer' },
          fixedValues: { location: 'footer' },
          fields: [
            { key: 'label', label: 'Label', type: 'text', required: true },
            { key: 'url', label: 'URL', type: 'text', required: true },
            { key: 'is_internal', label: 'Internal link', type: 'checkbox', default: true },
            { key: 'open_new_tab', label: 'Open in new tab', type: 'checkbox' },
          ],
        }}
      />
    </div>
  )
}
