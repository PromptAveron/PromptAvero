import { Download, ExternalLink } from 'lucide-react'
import { btn } from '@/lib/button-styles'

export function ProductPdfViewer({ src }: { src: string }) {
  return (
    <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <iframe
        src={src}
        title="Sample PDF in the browser PDF viewer"
        loading="lazy"
        className="h-[60vh] min-h-[400px] w-full border-0 bg-white sm:min-h-[480px] md:max-h-[640px] md:min-h-[520px]"
      />
      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border bg-card px-4 py-3">
        <div className="flex gap-2">
          <a href={src} target="_blank" rel="noreferrer" className={btn({ variant: 'outline', size: 'sm' })}>
            <ExternalLink aria-hidden="true" /> Open PDF
          </a>
          <a href={src} download className={btn({ size: 'sm' })}>
            <Download aria-hidden="true" /> Download
          </a>
        </div>
      </div>
    </section>
  )
}
