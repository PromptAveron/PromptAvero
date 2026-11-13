import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const gumroadButtonClasses =
  'gumroad-button inline-flex items-center justify-center whitespace-nowrap rounded border border-[#ddd] bg-[#ddd] px-4 py-3 text-base font-bold leading-[22px] text-black'

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
