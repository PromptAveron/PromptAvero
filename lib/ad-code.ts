export const DEFAULT_HEAD_AD_CODE = `<script>(function(s){s.dataset.zone='12165665',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))</script>`

const PREVIOUS_HEAD_AD_CODE = `<script src="https://5gvci.com/act/files/tag.min.js?z=12165667" data-cfasync="false" async></script>`
const PREVIOUS_HEAD_AD_URL = 'https://5gvci.com/act/files/tag.min.js?z=12165667'
const PREVIOUS_MONETAG_URL = 'https://n6wxm.com/vignette.min.js'
const CURRENT_MONETAG_URL = 'https://nap5k.com/tag.min.js'

export function getHeadAdCode(configuredCode?: string | null) {
  if (configuredCode == null) return DEFAULT_HEAD_AD_CODE
  if (!configuredCode.trim()) return ''
  if (configuredCode.trim() === PREVIOUS_HEAD_AD_CODE || configuredCode.includes(PREVIOUS_MONETAG_URL)) {
    return DEFAULT_HEAD_AD_CODE
  }
  const withoutPreviousScript = configuredCode.replace(
    /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
    (script) => script.includes(PREVIOUS_HEAD_AD_URL) ? '' : script,
  ).trim()
  return withoutPreviousScript || DEFAULT_HEAD_AD_CODE
}

export function hasConfiguredMonetagScript(code: string) {
  return code.includes(CURRENT_MONETAG_URL)
}
