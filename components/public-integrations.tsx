'use client'

import Script from 'next/script'
import type { ReactNode } from 'react'
import type { PublicSiteSettings } from '@/lib/public-settings'

export function PublicIntegrations({
  settings,
  children,
}: {
  settings: PublicSiteSettings
  children: ReactNode
}) {
  const analyticsId = settings.google_analytics_id
  const validAnalyticsId = analyticsId && /^G-[A-Z0-9]+$/i.test(analyticsId) ? analyticsId : undefined
  const analyticsEnabled = Boolean(validAnalyticsId)

  return (
    <>
      {children}
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
