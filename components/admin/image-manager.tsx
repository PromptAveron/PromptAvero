'use client'

import { useEffect, useState, type FormEvent, type MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, ImagePlus, Star, Trash2 } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { deletePromptImageAction, movePromptImageAction, refreshPromptPublicContentAction, setPrimaryImageAction, updateImageMetadataAction } from '@/app/admin/actions'
import { deleteImageKitUpload, uploadImageToImageKit } from '@/lib/imagekit-upload-client'

type PromptImageRow = {
  id: string
  image_url: string
  alt_text: string
  caption: string | null
  sort_order: number
  is_primary: boolean
  mime_type: string
  file_size: number
}

export function ImageManager({ promptId }: { promptId: string }) {
  const router = useRouter()
  const [images, setImages] = useState<PromptImageRow[]>([])
  const [busy, setBusy] = useState(false)
  const [actionBusy, setActionBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')

  async function loadImages() {
    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.from('prompt_images').select('*').eq('prompt_id', promptId).order('sort_order')
    if (error) throw new Error(`Could not load images: ${error.message}`)
    setImages(data ?? [])
  }

  type ImageAction = (formData: FormData) => Promise<void>

  async function runImageAction(action: ImageAction, formData: FormData, successMessage: string) {
    setMessage('')
    setMessageType('error')
    setActionBusy(true)
    try {
      await action(formData)
      await loadImages()
      setMessage(successMessage)
      setMessageType('success')
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Could not update the image.'
      setMessage(errorMessage)
      try {
        await loadImages()
      } catch (refreshError) {
        setMessage(`${errorMessage} ${refreshError instanceof Error ? refreshError.message : ''}`)
      }
    } finally {
      setActionBusy(false)
    }
  }

  function submitMetadata(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void runImageAction(updateImageMetadataAction, new FormData(event.currentTarget), 'Image details saved.')
  }

  function submitImageAction(
    event: MouseEvent<HTMLButtonElement>,
    action: ImageAction,
    successMessage: string,
    extraField?: [string, string],
  ) {
    const form = event.currentTarget.form
    if (!form) {
      setMessage('Could not find the image details form.')
      setMessageType('error')
      return
    }
    const formData = new FormData(form)
    if (extraField) formData.set(extraField[0], extraField[1])
    void runImageAction(action, formData, successMessage)
  }

  useEffect(() => {
    let active = true
    const supabase = createSupabaseBrowserClient()
    void supabase.from('prompt_images').select('*').eq('prompt_id', promptId).order('sort_order')
      .then(({ data, error }) => {
        if (!active) return
        if (error) setMessage(`Could not load images: ${error.message}`)
        else setImages(data ?? [])
      })
    return () => { active = false }
  }, [promptId])

  async function uploadFiles(selectedFiles: FileList | null) {
    const files = Array.from(selectedFiles ?? [])
    if (!files.length) return
    setMessage('')
    setMessageType('error')
    setBusy(true)
    const supabase = createSupabaseBrowserClient()
    try {
      const { data: current, error: queryError } = await supabase.from('prompt_images').select('id,is_primary,sort_order').eq('prompt_id', promptId).order('sort_order')
      if (queryError) throw new Error(queryError.message)
      let currentCount = current.length
      if (currentCount + files.length > 5) throw new Error(`Only ${5 - currentCount} image slot(s) remain.`)
      for (const file of files) {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Use a JPEG, PNG, or WebP image.')
        if (file.size > 5 * 1024 * 1024) throw new Error('Each image must be 5 MB or smaller.')
        const bitmap = await createImageBitmap(file)
        const { width, height } = bitmap
        bitmap.close()
        const uploaded = await uploadImageToImageKit(file, { purpose: 'prompt', promptId })
        const { error: insertError } = await supabase.from('prompt_images').insert({
          prompt_id: promptId,
          image_url: uploaded.url,
          imagekit_file_id: uploaded.fileId,
          alt_text: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
          sort_order: currentCount,
          is_primary: currentCount === 0,
          mime_type: file.type,
          file_size: file.size,
          width,
          height,
        })
        if (insertError) {
          try {
            await deleteImageKitUpload(uploaded.fileId)
          } catch (cleanupError) {
            throw new Error(`Image was uploaded but could not be added to the prompt: ${insertError.message}. ImageKit cleanup failed: ${cleanupError instanceof Error ? cleanupError.message : 'Unknown cleanup error.'}`)
          }
          throw new Error(`Image was uploaded but could not be added to the prompt: ${insertError.message}`)
        }
        currentCount += 1
      }
      await loadImages()
      await refreshPromptPublicContentAction(promptId)
      setMessage(`${files.length} image${files.length === 1 ? '' : 's'} uploaded.`)
      setMessageType('success')
      router.refresh()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The upload could not be completed.')
      try { await loadImages() } catch (refreshError) {
        setMessage(`${error instanceof Error ? error.message : 'Upload failed.'} ${refreshError instanceof Error ? refreshError.message : ''}`)
      }
    } finally {
      setBusy(false)
    }
  }

  const publicUrl = (image: PromptImageRow) => image.image_url

  return (
    <section
      className="mb-4 rounded-lg border border-border bg-card p-5 sm:p-6"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        void uploadFiles(event.dataTransfer.files)
      }}
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-sm font-semibold">Example images</h2><p className="mt-1 text-xs text-muted-foreground">{images.length} of 5 images · JPEG, PNG, or WebP · 5 MB max each</p></div>
        <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-xs font-medium hover:bg-background has-[:disabled]:opacity-50">
          <ImagePlus size={15} /> {busy ? 'Uploading…' : actionBusy ? 'Saving…' : 'Add images'}
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy || actionBusy || images.length >= 5} onChange={(event) => { void uploadFiles(event.target.files); event.currentTarget.value = '' }} className="sr-only" />
        </label>
      </div>
      {message ? <p role={messageType === 'success' ? 'status' : 'alert'} className={`mt-3 text-xs ${messageType === 'success' ? 'text-success' : 'text-red-700'}`}>{message}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <article key={image.id} className="overflow-hidden rounded-lg border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={publicUrl(image)} alt={image.alt_text} className="h-36 w-full bg-muted object-cover" />
            <form onSubmit={submitMetadata} className="space-y-2 p-3">
              <input type="hidden" name="id" value={image.id} />
              <label className="block text-[11px] font-medium">Alt text<input name="alt_text" defaultValue={image.alt_text} disabled={busy || actionBusy} className="mt-1 h-8 w-full rounded border border-border px-2 text-xs font-normal" /></label>
              <label className="block text-[11px] font-medium">Caption<input name="caption" defaultValue={image.caption ?? ''} disabled={busy || actionBusy} className="mt-1 h-8 w-full rounded border border-border px-2 text-xs font-normal" /></label>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-muted-foreground">{image.is_primary ? 'Primary image' : `${(image.file_size / 1024).toFixed(0)} KB`}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={(event) => submitImageAction(event, movePromptImageAction, 'Image order updated.', ['direction', 'up'])} aria-label="Move image up" disabled={!index || busy || actionBusy} className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowUp size={14} /></button>
                  <button type="button" onClick={(event) => submitImageAction(event, movePromptImageAction, 'Image order updated.', ['direction', 'down'])} aria-label="Move image down" disabled={index === images.length - 1 || busy || actionBusy} className="rounded p-1 hover:bg-muted disabled:opacity-30"><ArrowDown size={14} /></button>
                  {!image.is_primary ? <button type="button" onClick={(event) => submitImageAction(event, setPrimaryImageAction, 'Primary image updated.')} aria-label="Set as primary image" disabled={busy || actionBusy} className="rounded p-1 hover:bg-muted disabled:opacity-30"><Star size={14} /></button> : null}
                  <button type="button" onClick={(event) => submitImageAction(event, deletePromptImageAction, 'Image deleted.')} aria-label="Delete image" disabled={busy || actionBusy} className="rounded p-1 text-red-700 hover:bg-red-50 disabled:opacity-30"><Trash2 size={14} /></button>
                  <button type="submit" disabled={busy || actionBusy} className="rounded border border-border px-2 py-1 text-[10px] hover:bg-muted disabled:opacity-30">{actionBusy ? 'Saving…' : 'Save'}</button>
                </div>
              </div>
            </form>
          </article>
        ))}
      </div>
    </section>
  )
}
