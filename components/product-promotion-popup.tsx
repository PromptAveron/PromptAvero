'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { ProductPromotionSettings } from '@/lib/product-promotion'
import { calculateProductPrice, formatProductPrice } from '@/lib/product-promotion'
import { ProductPurchaseLink } from '@/components/product-purchase-link'
import { btn } from '@/lib/button-styles'

export function ProductPromotionPopup({ settings }: { settings: ProductPromotionSettings }) {
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const hasShownRef = useRef(false)
  const price = calculateProductPrice(settings)

  useEffect(() => {
    if (!settings.popupEnabled || hasShownRef.current) return
    try {
      if (window.sessionStorage.getItem('promptavero-111-promotion-seen')) {
        hasShownRef.current = true
        return
      }
    } catch {
      // Session storage can be unavailable in privacy-restricted browsers.
    }

    const timer = window.setTimeout(() => {
      if (hasShownRef.current) return
      hasShownRef.current = true
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      try {
        window.sessionStorage.setItem('promptavero-111-promotion-seen', '1')
      } catch {
        // The in-memory guard still prevents repeat displays during this page session.
      }
      setOpen(true)
    }, settings.popupDelaySeconds * 1000)

    return () => window.clearTimeout(timer)
  }, [settings.popupEnabled, settings.popupDelaySeconds])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        return
      }
      if (event.key !== 'Tab') return
      const dialog = document.getElementById('product-promotion-dialog')
      const focusable = dialog?.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [open])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-foreground/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setOpen(false)
      }}
    >
      <section
        id="product-promotion-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-promotion-title"
        aria-describedby="product-promotion-description"
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-[2rem] border border-border bg-card text-card-foreground shadow-2xl sm:rounded-[2rem]"
      >
        <div className="h-1.5 bg-gradient-to-r from-primary via-accent-foreground to-brand-text" aria-hidden="true" />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => setOpen(false)}
          className={btn({ variant: 'outline', size: 'icon', className: 'absolute right-4 top-4 z-10 rounded-full border-border bg-muted text-foreground hover:bg-accent' })}
          aria-label="Close promotion"
        >
          <X aria-hidden="true" />
        </button>
        <div className="grid gap-7 p-6 pt-10 sm:p-9 sm:pt-12 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-text">A quick creative reset</p>
            <h2 id="product-promotion-title" className="mt-3 max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-4xl">
              Put 111 new starting points within reach.
            </h2>
            <p id="product-promotion-description" className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              When inspiration stalls, browse a category, choose a direction, and personalize a prompt around the image you want to make.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-muted-foreground">
              <span className="rounded-full border border-border px-3 py-1.5">11 creative categories</span>
              <span className="rounded-full border border-border px-3 py-1.5">Digital PDF</span>
            </div>
          </div>
          <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-brand-soft via-card to-background p-5 text-foreground shadow-lg md:w-80">
            <div className="absolute -right-8 -top-8 size-28 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand-text">The Prompt Pack</p>
                <span className="rounded-full border border-border bg-background/70 px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">Digital PDF</span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-5xl font-semibold tracking-[-0.08em] text-brand-text">111</p>
                <p className="text-xs font-medium text-muted-foreground">prompts to explore</p>
              </div>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                {price.discountPercentage > 0 ? (
                  <span className="text-sm text-muted-foreground line-through">{formatProductPrice(price.originalPriceCents)}</span>
                ) : null}
                <span className="text-3xl font-bold tracking-tight">{formatProductPrice(price.currentPriceCents)}</span>
                {price.discountPercentage > 0 ? (
                  <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground">{price.discountPercentage}% off</span>
                ) : null}
              </div>
              <ProductPurchaseLink
                href={settings.gumroadUrl}
                className="mt-4 h-11 w-full"
              >
                Get instant access
              </ProductPurchaseLink>
            </div>
          </div>
        </div>
        <p className="border-t border-border px-6 py-3 text-center text-[10px] text-muted-foreground sm:px-9">
          Final checkout price and purchase terms are shown on Gumroad.
        </p>
      </section>
    </div>
  )
}
