/* Hand-written types matching supabase/migrations/0001_init.sql.
   If the schema changes, update this file to match — there is no running
   `supabase gen types` in this project (no CLI/DB credentials available in
   this environment), so these are the source of truth for the frontend. */

export type Role = 'admin' | 'editor'
export type ProfileStatus = 'pending' | 'approved' | 'suspended'
export type ContentStatus = 'draft' | 'published' | 'archived'
export type TrainingStatus = 'draft' | 'ready' | 'coming_soon' | 'published' | 'archived'
export type SubmissionStatus = 'new' | 'read' | 'replied' | 'archived'
export type CapabilityCategory =
  | 'Brand & Identity'
  | 'Digital & Product'
  | 'Growth & Demand'
  | 'Market & Expansion'
  | 'Experiences'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  status: ProfileStatus
  created_at: string
  updated_at: string
}

export interface Media {
  id: string
  bucket: string
  storage_path: string
  file_type: 'image' | 'svg' | 'pdf' | 'video' | 'document'
  file_name: string
  mime_type: string | null
  file_size_bytes: number | null
  width: number | null
  height: number | null
  alt_text: string | null
  caption: string | null
  focal_x: number
  focal_y: number
  uploaded_by: string | null
  created_at: string
}

export interface SiteSettings {
  id: 1
  site_name: string
  site_description: string | null
  default_seo_title: string | null
  default_meta_description: string | null
  default_og_image_url: string | null
  domain: string | null
  language: string
  locale: string
  contact_email: string | null
  new_business_email: string | null
  press_email: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  address_city: string | null
  address_postcode: string | null
  address_country: string | null
  registration_note: string | null
  hours: string | null
  social_links: { label: string; url: string }[]
  analytics_ids: Record<string, string>
  updated_at: string
}

export interface BrandColors {
  background: string
  surface: string
  primaryText: string
  secondaryText: string
  primaryBrand: string
  secondaryBrand: string
  accent: string
  border: string
}

export interface BrandSettings {
  id: 1
  logo_primary_media_id: string | null
  logo_secondary_media_id: string | null
  symbol_media_id: string | null
  favicon_media_id: string | null
  og_default_media_id: string | null
  colors: BrandColors
  display_font: string
  heading_font: string
  body_font: string
  ui_font: string
  font_source: 'google' | 'hosted' | 'system'
  updated_at: string
}

export interface NavigationItem {
  id: string
  location: 'header' | 'footer'
  label: string
  url: string
  is_internal: boolean
  open_new_tab: boolean
  is_visible: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Page {
  id: string
  slug: string
  title: string
  seo_title: string | null
  seo_description: string | null
  og_media_id: string | null
  canonical_url: string | null
  noindex: boolean
  updated_at: string
}

export interface PageSection {
  id: string
  page_id: string
  section_key: string
  eyebrow: string | null
  title: string | null
  subtitle: string | null
  body: string | null
  cta_label: string | null
  cta_url: string | null
  image_media_id: string | null
  video_url: string | null
  is_visible: boolean
  sort_order: number
  extra: Record<string, unknown>
  updated_at: string
}

export interface CapabilityRow {
  id: string
  slug: string
  name: string
  category: CapabilityCategory
  summary: string | null
  lede: string | null
  includes: string[]
  question: string | null
  outcome: string | null
  queries: string[]
  sort_order: number
  is_active: boolean
  updated_at: string
}

export interface Project {
  id: string
  title: string
  client: string | null
  slug: string
  year: string | null
  industry: string | null
  location: string | null
  short_description: string | null
  introduction: string | null
  challenge: string | null
  insight: string | null
  strategy: string | null
  what_we_did: string | null
  outcome: string | null
  results: string | null
  services: string[]
  related_capability_slugs: string[]
  hero_image_media_id: string | null
  thumbnail_media_id: string | null
  credits: string | null
  external_url: string | null
  featured: boolean
  homepage_order: number | null
  status: ContentStatus
  published_at: string | null
  scheduled_at: string | null
  sort_order: number
  seo_title: string | null
  seo_description: string | null
  og_media_id: string | null
  canonical_url: string | null
  noindex: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProjectMedia {
  id: string
  project_id: string
  media_id: string
  kind: 'gallery' | 'video'
  video_url: string | null
  caption: string | null
  sort_order: number
  created_at: string
}

export interface ArticleCategory {
  id: string
  name: string
  slug: string
}

export type ArticleBlock =
  | { type: 'h2' | 'h3' | 'paragraph' | 'quote'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'image'; mediaId: string; caption?: string }
  | { type: 'divider' }
  | { type: 'callout'; text: string }
  | { type: 'embed'; url: string }

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string | null
  body: ArticleBlock[]
  author_id: string | null
  category_id: string | null
  tags: string[]
  hero_image_media_id: string | null
  reading_time_minutes: number | null
  featured: boolean
  status: ContentStatus
  published_at: string | null
  scheduled_at: string | null
  seo_title: string | null
  seo_description: string | null
  og_media_id: string | null
  canonical_url: string | null
  noindex: boolean
  created_at: string
  updated_at: string
}

export interface Testimonial {
  id: string
  quote: string
  person_name: string
  role: string | null
  company: string | null
  photo_media_id: string | null
  related_project_id: string | null
  sort_order: number
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ClientRow {
  id: string
  company_name: string
  logo_media_id: string | null
  website_url: string | null
  alt_text: string | null
  sort_order: number
  is_active: boolean
}

export interface PartnerRow {
  id: string
  partner_name: string
  logo_media_id: string | null
  website_url: string | null
  alt_text: string | null
  sort_order: number
  is_active: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string | null
  bio: string | null
  portrait_media_id: string | null
  email: string | null
  social_url: string | null
  personal_url: string | null
  sort_order: number
  is_active: boolean
}

export interface Training {
  id: string
  title: string
  slug: string
  short_description: string | null
  full_description: string | null
  instructor: string | null
  cover_media_id: string | null
  category: string | null
  level: string | null
  duration: string | null
  language: string | null
  format: string | null
  price: string | null
  status: TrainingStatus
  pdf_media_id: string | null
  video_media_id: string | null
  external_video_url: string | null
  published_at: string | null
  seo_title: string | null
  seo_description: string | null
  og_media_id: string | null
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  title: string
  slug: string
  description: string | null
  cover_media_id: string | null
  category: string | null
  author: string | null
  published_at: string | null
  pdf_media_id: string | null
  file_size_bytes: number | null
  featured: boolean
  related_project_id: string | null
  related_article_id: string | null
  status: ContentStatus
  seo_title: string | null
  seo_description: string | null
  og_media_id: string | null
  created_at: string
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string | null
  email: string
  company: string | null
  website: string | null
  message: string | null
  budget: string | null
  timeline: string | null
  source: string
  status: SubmissionStatus
  created_at: string
}

export interface Redirect {
  id: string
  from_path: string
  to_path: string
  redirect_type: 301 | 302
  is_active: boolean
  created_at: string
  updated_at: string
}
