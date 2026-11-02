'use client'

import Script from 'next/script'
import type { ReactNode } from 'react'
import { getHeadAdCode, hasConfiguredMonetagScript } from '@/lib/ad-code'
import type { PublicSiteSettings } from '@/lib/public-settings'

const MONETAG_SCRIPT_URL = 'https://nap5k.com/tag.min.js'
const MONETAG_SCRIPT_CODE = `(function(s){s.dataset.zone='12165665',s.src='${MONETAG_SCRIPT_URL}'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`

function HeadAdScript({ code, id }: { code: string; id: string }) {
  const scriptMatch = code.match(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/i)
  const scriptBody = scriptMatch?.[2] ?? code
  const attributes = scriptMatch?.[1]
  const scriptSrc = attributes?.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/i)
  const scriptProps = scriptSrc
    ? Object.fromEntries(
        Array.from((attributes ?? '').matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
          .filter(([ , name ]) => name.toLowerCase() !== 'src')
          .map(([ , name, doubleQuoted, singleQuoted, unquoted ]) => [
            name.toLowerCase(),
            doubleQuoted ?? singleQuoted ?? unquoted ?? true,
          ]),
      )
    : null

  if (scriptSrc && scriptProps) {
    return <Script id={id} {...scriptProps} src={scriptSrc[1] ?? scriptSrc[2] ?? scriptSrc[3]} strategy="afterInteractive" />
  }

  return scriptBody.trim()
    ? <Script id={id} strategy="afterInteractive">{scriptBody}</Script>
    : null
}

export function PublicIntegrations({
  settings,
  children,
}: {
  settings: PublicSiteSettings
  children: ReactNode
}) {
  const headAdCode = getHeadAdCode(settings.ad_code_head)
  const analyticsId = settings.google_analytics_id
  const validAnalyticsId = analyticsId && /^G-[A-Z0-9]+$/i.test(analyticsId) ? analyticsId : undefined
  const analyticsEnabled = Boolean(validAnalyticsId)

  return (
    <>
      {children}
      {headAdCode ? <HeadAdScript code={headAdCode} id="promptavero-configured-head-ad" /> : null}
      {!hasConfiguredMonetagScript(headAdCode) ? (
        <HeadAdScript code={MONETAG_SCRIPT_CODE} id="promptavero-monetag-zone" />
      ) : null}
      {analyticsEnabled ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(validAnalyticsId!)}`} strategy="afterInteractive" />
          <Script id="promptavero-google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(validAnalyticsId)});`}
          </Script>
        </>
      ) : null}
    </>
  )
}
