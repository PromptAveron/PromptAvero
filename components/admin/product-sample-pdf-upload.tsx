'use client'

import { useState } from 'react'
import { FileUp } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

const maxFileSize = 10 * 1024 * 1024

export function ProductSamplePdfUpload({ currentUrl }: { currentUrl: string }) {
  const [url, setUrl] = useState(currentUrl)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function upload(file?: File) {
    if (!file) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      if (file.type !== 'application/pdf') throw new Error('Choose a PDF file.')
      if (file.size > maxFileSize) throw new Error('The sample PDF must be 10 MB or smaller.')
      const signature = new TextDecoder().decode(await file.slice(0, 5).arrayBuffer())
      if (signature !== '%PDF-') throw new Error('The selected file is not a valid PDF.')

      const safeName = file.name.replace(/[^A-Za-z0-9._-]/g, '-').replace(/-+/g, '-')
      const path = `samples/${crypto.randomUUID()}-${safeName || 'sample.pdf'}`
      const supabase = createSupabaseBrowserClient()
      const { error: uploadError } = await supabase.storage
        .from('product-samples')
        .upload(path, file, { contentType: 'application/pdf', upsert: false })
      if (uploadError) throw new Error(`Could not upload sample PDF: ${uploadError.message}`)

      const { data } = supabase.storage.from('product-samples').getPublicUrl(path)
      setUrl(data.publicUrl)
      setMessage('PDF uploaded. Save settings to publish it on the product page.')
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Could not upload the PDF.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <input type="hidden" name="product_sample_pdf_url" value={url} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold">Sample PDF</p>
          <p className="mt-1 text-[11px] text-muted-foreground">PDF · up to 10 MB</p>
          <a href={url} target="_blank" rel="noreferrer" className="mt-2 block truncate text-[11px] text-brand-text underline underline-offset-2">
            Open current sample PDF
          </a>
        </div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-background has-[:disabled]:opacity-50">
          <FileUp size={15} aria-hidden="true" />
          {busy ? 'Uploading…' : 'Upload or replace PDF'}
          <input
            type="file"
            accept="application/pdf,.pdf"
            disabled={busy}
            onChange={(event) => {
              void upload(event.currentTarget.files?.[0])
              event.currentTarget.value = ''
            }}
            className="sr-only"
          />
        </label>
      </div>
      {message ? <p role="status" className="mt-3 text-xs text-success">{message}</p> : null}
      {error ? <p role="alert" className="mt-3 text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
