'use client'

import { useState, useTransition, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { updateAccessory, deleteAccessoryImage } from '../../actions'

const GOLD = '#3F3E7A'
const BUCKET = 'accessory-images'
const MAX_FILE_MB = 2
const MAX_IMAGES = 20

async function uploadImage(file: File, slug: string): Promise<string> {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}.${fileExt}`
  const filePath = `accessories/${slug}/${fileName}`

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, { cacheControl: '3600', upsert: true })
  if (error) throw error

  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return publicUrl
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '4px',
  color: '#f5f5f5',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' }

export type AccessoryImage = { id: string; url: string; order: number }

export type Accessory = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  category: string | null
  price: number
  price_fa: number | null
  description_en: string | null
  description_fa: string | null
  in_stock: boolean
  is_featured: boolean
}

export default function EditAccessoryForm({ accessory, images }: { accessory: Accessory; images: AccessoryImage[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [existingImages, setExistingImages] = useState<AccessoryImage[]>(images)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [inStock, setInStock] = useState(accessory.in_stock)
  const [isFeatured, setIsFeatured] = useState(accessory.is_featured)
  const [isPending, startTransition] = useTransition()

  const remainingSlots = Math.max(0, MAX_IMAGES - existingImages.length)
  const isSubmitting = uploading || isPending

  async function refetchImages() {
    const { data, error } = await supabase
      .from('accessory_images')
      .select('id, url, order')
      .eq('accessory_id', accessory.id)
      .order('order', { ascending: true })
    if (error) console.error('refetchImages error:', error)
    if (data) setExistingImages(data as AccessoryImage[])
  }

  function handleDeleteImage(imageId: string, imageUrl: string) {
    setDeletingId(imageId)
    startTransition(async () => {
      await deleteAccessoryImage(imageId, imageUrl)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      setDeletingId(null)
    })
  }

  function handleNewImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    setUploadError(null)
    const files = Array.from(e.target.files ?? []).slice(0, remainingSlots) as File[]
    const oversized = files.find((f) => f.size > MAX_FILE_MB * 1024 * 1024)
    if (oversized) {
      setFileError(`فایل "${oversized.name}" بیشتر از ${MAX_FILE_MB}MB است`)
      e.target.value = ''
      setSelectedFiles([])
      setNewPreviews([])
      return
    }
    setSelectedFiles(files)
    setNewPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setUploadError(null)
    setUploading(true)

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]
      try {
        const publicUrl = await uploadImage(file, accessory.slug)
        const { error: insertErr } = await supabase.from('accessory_images').insert({
          accessory_id: accessory.id,
          url: publicUrl,
          order: existingImages.length + i,
        })
        if (insertErr) {
          alert(`خطا در ذخیره تصویر: ${insertErr.message}`)
          setUploading(false)
          return
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err)
        setUploadError(`خطا در آپلود "${file.name}": ${msg}`)
        setUploading(false)
        return
      }
    }

    await refetchImages()
    setSelectedFiles([])
    setNewPreviews([])
    const fileInput = document.getElementById('new-images-input') as HTMLInputElement
    if (fileInput) fileInput.value = ''

    setUploading(false)
    startTransition(() => {
      formRef.current?.requestSubmit()
    })
  }

  return (
    <form ref={formRef} action={updateAccessory} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={accessory.id} />
      <input type="hidden" name="in_stock" value={String(inStock)} />
      <input type="hidden" name="is_featured" value={String(isFeatured)} />

      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>نام (انگلیسی)</label>
            <input name="name_en" required defaultValue={accessory.name_en} style={{ ...inputStyle, direction: 'ltr' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>نام (فارسی)</label>
            <input name="name_fa" required defaultValue={accessory.name_fa ?? ''} style={inputStyle} />
          </div>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Slug (آدرس صفحه)</label>
          <input name="slug" required defaultValue={accessory.slug} style={{ ...inputStyle, direction: 'ltr', color: GOLD }} />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>دسته‌بندی</label>
          <input name="category" required defaultValue={accessory.category ?? ''} style={{ ...inputStyle, direction: 'ltr' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>قیمت (دلار)</label>
            <input name="price" type="number" required min={0} step="0.01" defaultValue={accessory.price} style={{ ...inputStyle, direction: 'ltr' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>قیمت (تومان)</label>
            <input name="price_fa" type="number" min={0} defaultValue={accessory.price_fa ?? ''} style={{ ...inputStyle, direction: 'ltr' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>توضیحات (انگلیسی)</label>
            <textarea name="description_en" rows={4} defaultValue={accessory.description_en ?? ''} style={{ ...inputStyle, direction: 'ltr', resize: 'vertical' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>توضیحات (فارسی)</label>
            <textarea name="description_fa" rows={4} defaultValue={accessory.description_fa ?? ''} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
        </div>

        {/* In stock toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={labelStyle}>موجودی</span>
          <button
            type="button"
            onClick={() => setInStock((v) => !v)}
            style={{ position: 'relative', width: '52px', height: '28px', borderRadius: '14px', background: inStock ? GOLD : '#2a2a2a', border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: '4px', right: inStock ? '4px' : '24px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'right 0.2s', display: 'block' }} />
          </button>
          <span style={{ color: inStock ? '#4ade80' : '#f87171', fontSize: '13px' }}>{inStock ? 'موجود' : 'ناموجود'}</span>
        </div>

        {/* Featured toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={labelStyle}>پیشنهاد ویژه (نمایش در صفحه شاپ)</span>
          <button
            type="button"
            onClick={() => setIsFeatured((v) => !v)}
            style={{ position: 'relative', width: '52px', height: '28px', borderRadius: '14px', background: isFeatured ? GOLD : '#2a2a2a', border: 'none', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: '4px', right: isFeatured ? '4px' : '24px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'right 0.2s', display: 'block' }} />
          </button>
          <span style={{ color: isFeatured ? '#8f8dd6' : '#666', fontSize: '13px' }}>{isFeatured ? '★ ویژه' : '☆ عادی'}</span>
        </div>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div style={fieldStyle}>
            <label style={labelStyle}>تصاویر فعلی</label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {existingImages.map((img) => (
                <div key={img.id} style={{ position: 'relative' }}>
                  <img src={img.url} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${GOLD}40` }} />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img.id, img.url)}
                    disabled={deletingId === img.id}
                    style={{ position: 'absolute', top: '-8px', insetInlineEnd: '-8px', width: '22px', height: '22px', borderRadius: '50%', background: '#f87171', border: 'none', color: '#fff', fontSize: '12px', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New images */}
        {remainingSlots > 0 && (
          <div style={fieldStyle}>
            <label style={labelStyle}>افزودن تصویر جدید (حداکثر {remainingSlots} مورد)</label>
            <div style={{ border: '1px dashed #2a2a2a', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
              <input id="new-images-input" type="file" accept="image/*" multiple onChange={handleNewImagesChange} style={{ display: 'none' }} />
              <label htmlFor="new-images-input" style={{ display: 'inline-block', padding: '10px 24px', border: `1px solid ${GOLD}40`, borderRadius: '4px', color: GOLD, fontSize: '13px', cursor: 'pointer', marginBottom: newPreviews.length ? '16px' : '0' }}>
                انتخاب تصاویر
              </label>
              {newPreviews.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {newPreviews.map((src, i) => (
                    <img key={i} src={src} alt={`preview-${i}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: `1px solid ${GOLD}40` }} />
                  ))}
                </div>
              )}
              {fileError && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '10px' }}>{fileError}</p>}
              {uploadError && <p style={{ color: '#f87171', fontSize: '12px', marginTop: '10px' }}>{uploadError}</p>}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <a href="/admin/dashboard/accessories" style={{ padding: '12px 28px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#666', fontSize: '14px', textDecoration: 'none' }}>
            انصراف
          </a>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ padding: '12px 28px', background: isSubmitting ? '#8a7033' : GOLD, border: 'none', borderRadius: '4px', color: '#0a0a0a', fontSize: '14px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-vazirmatn), Arial, sans-serif', whiteSpace: 'nowrap' }}
          >
            {isSubmitting ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
          </button>
        </div>
      </div>
    </form>
  )
}
