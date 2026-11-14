import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const gumroadButtonClasses =
  'gumroad-button inline-flex max-w-full items-center justify-center whitespace-nowrap rounded border border-black bg-[#ff90e8] px-4 py-3 text-base font-bold leading-[22px] text-black transition-colors hover:border-black hover:bg-[#ff90e8]'

export function ProductPurchaseLink({
  href,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className={cn(gumroadButtonClasses, className)}
      {...props}
    >
      {children}
    </a>
  )
}
