import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { createSupabasePublicClient, hasSupabaseConfig } from '@/lib/supabase/server'
import { withFallback } from '@/lib/with-fallback'

export interface PublicSiteSettings {
  site_name?: string
  tagline?: string
  logo_url?: string
  favicon_url?: string
  google_analytics_id?: string
  google_search_console_verification?: string
  bing_verification_code?: string
}

const getCachedPublicSiteSettings = unstable_cache(
  async (): Promise<PublicSiteSettings> => {
    const supabase = createSupabasePublicClient()
    const { data, error } = await supabase.rpc('get_public_site_settings')
    if (error) throw new Error(`Could not load public site settings: ${error.message}`)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {}

    const values = data as Record<string, unknown>
    const settings: PublicSiteSettings = {}
    for (const key of [
      'site_name',
      'tagline',
      'logo_url',
      'favicon_url',
      'google_analytics_id',
      'google_search_console_verification',
      'bing_verification_code',
    ] as const) {
      const setting = values[key]
      if (typeof setting === 'string') settings[key] = setting
    }
    return settings
  },
  ['public-site-settings-v2'],
  { tags: ['public-site-settings'], revalidate: 300 },
)

export const getPublicSiteSettings = cache(async (): Promise<PublicSiteSettings> => {
  if (!hasSupabaseConfig()) return {}
  return withFallback(getCachedPublicSiteSettings(), {})
})
