'use client'

import { useState, useTransition } from 'react'
import { useFormStatus } from 'react-dom'
import { updateProduct, deleteProductImage } from '../../actions'

const GOLD = '#C9A84C'
const MAX_FILE_MB = 2

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

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  color: '#888',
  marginBottom: '8px',
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
}

export type ProductImage = { id: string; url: string; order: number }

export type Product = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  scale: string
  notes: number
  price: number
  description_en: string | null
  description_fa: string | null
  note_arrangement: string | null
  in_stock: boolean
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        padding: '12px 28px',
        background: pending ? '#8a7033' : GOLD,
        border: 'none',
        borderRadius: '4px',
        color: '#0a0a0a',
        fontSize: '14px',
        fontWeight: '600',
        cursor: pending ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
        transition: 'background 0.2s',
        whiteSpace: 'nowrap',
      }}
    >
      {pending ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
    </button>
  )
}

export default function EditProductForm({
  product,
  images,
}: {
  product: Product
  images: ProductImage[]
}) {
  const [existingImages, setExistingImages] = useState<ProductImage[]>(images)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [inStock, setInStock] = useState(product.in_stock)
  const [isPending, startTransition] = useTransition()

  const remainingSlots = Math.max(0, 3 - existingImages.length)

  function handleDeleteImage(imageId: string, imageUrl: string) {
    setDeletingId(imageId)
    startTransition(async () => {
      await deleteProductImage(imageId, imageUrl)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
      setDeletingId(null)
    })
  }

  function handleNewImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null)
    const files = Array.from(e.target.files ?? []).slice(0, remainingSlots)
    const oversized = files.find((f) => f.size > MAX_FILE_MB * 1024 * 1024)
    if (oversized) {
      setFileError(`فایل "${oversized.name}" بیشتر از ${MAX_FILE_MB}MB است`)
      e.target.value = ''
      return
    }
    setNewPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          محصولات
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>ویرایش محصول</h1>
        <p style={{ color: '#555', fontSize: '13px', marginTop: '6px', direction: 'ltr' }}>{product.name_en}</p>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '12px', opacity: 0.5 }} />
      </div>

      <form action={updateProduct}>
        <input type="hidden" name="id" value={product.id} />
        <input type="hidden" name="in_stock" value={String(inStock)} />

        <div
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '8px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }}
        >
          {/* Names */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>نام (انگلیسی)</label>
              <input
                name="name_en"
                required
                defaultValue={product.name_en}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>نام (فارسی)</label>
              <input
                name="name_fa"
                required
                defaultValue={product.name_fa ?? ''}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Slug */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Slug (آدرس صفحه)</label>
            <input
              name="slug"
              required
              defaultValue={product.slug}
              style={{ ...inputStyle, direction: 'ltr', color: GOLD }}
            />
          </div>

          {/* Scale + Notes + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>گام (Scale)</label>
              <input
                name="scale"
                required
                defaultValue={product.scale}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>تعداد نت</label>
              <input
                name="notes"
                type="number"
                required
                min={1}
                max={20}
                defaultValue={product.notes}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>قیمت (دلار)</label>
              <input
                name="price"
                type="number"
                required
                min={0}
                step="0.01"
                defaultValue={product.price}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>توضیحات (انگلیسی)</label>
              <textarea
                name="description_en"
                rows={4}
                defaultValue={product.description_en ?? ''}
                style={{ ...inputStyle, direction: 'ltr', resize: 'vertical' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>توضیحات (فارسی)</label>
              <textarea
                name="description_fa"
                rows={4}
                defaultValue={product.description_fa ?? ''}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Note arrangement */}
          <div style={fieldStyle}>
            <label style={labelStyle}>آرایش نت‌ها</label>
            <input
              name="note_arrangement"
              defaultValue={product.note_arrangement ?? ''}
              style={{ ...inputStyle, direction: 'ltr' }}
            />
          </div>

          {/* In-stock toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={labelStyle}>موجودی</span>
            <button
              type="button"
              onClick={() => setInStock((v) => !v)}
              aria-label="تغییر وضعیت موجودی"
              style={{
                position: 'relative',
                width: '52px',
                height: '28px',
                borderRadius: '14px',
                background: inStock ? GOLD : '#2a2a2a',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: inStock ? '4px' : '24px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'right 0.2s',
                  display: 'block',
                }}
              />
            </button>
            <span style={{ color: inStock ? '#4ade80' : '#f87171', fontSize: '13px' }}>
              {inStock ? 'موجود' : 'ناموجود'}
            </span>
          </div>

          {/* ── Images section ── */}
          <div style={fieldStyle}>
            <label style={{ ...labelStyle, marginBottom: '16px' }}>
              تصاویر محصول
              <span style={{ color: '#444', fontSize: '12px', marginRight: '8px' }}>
                ({existingImages.length} / 3)
              </span>
            </label>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {existingImages.map((img) => {
                  const isDeleting = deletingId === img.id
                  return (
                    <div
                      key={img.id}
                      style={{
                        position: 'relative',
                        width: '110px',
                        opacity: isDeleting ? 0.4 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <img
                        src={img.url}
                        alt="product"
                        style={{
                          width: '110px',
                          height: '110px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: `1px solid ${GOLD}30`,
                          display: 'block',
                        }}
                      />
                      <button
                        type="button"
                        disabled={isDeleting || isPending}
                        onClick={() => handleDeleteImage(img.id, img.url)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          left: '6px',
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: isDeleting ? '#555' : 'rgba(239,68,68,0.9)',
                          border: 'none',
                          color: '#fff',
                          fontSize: '14px',
                          lineHeight: '1',
                          cursor: isDeleting ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'monospace',
                        }}
                        title="حذف تصویر"
                      >
                        {isDeleting ? '…' : '×'}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* New image upload */}
            {remainingSlots > 0 ? (
              <div
                style={{
                  border: '1px dashed #2a2a2a',
                  borderRadius: '6px',
                  padding: '20px 24px',
                  textAlign: 'center',
                }}
              >
                <input
                  name="new_images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleNewImagesChange}
                  style={{ display: 'none' }}
                  id="new-images-input"
                />
                <label
                  htmlFor="new-images-input"
                  style={{
                    display: 'inline-block',
                    padding: '9px 20px',
                    border: `1px solid ${GOLD}40`,
                    borderRadius: '4px',
                    color: GOLD,
                    fontSize: '13px',
                    cursor: 'pointer',
                    marginBottom: newPreviews.length || fileError ? '12px' : '0',
                  }}
                >
                  + افزودن تصویر ({remainingSlots} جای خالی)
                </label>

                {fileError && (
                  <p style={{ color: '#f87171', fontSize: '12px', margin: '0 0 8px' }}>{fileError}</p>
                )}

                {newPreviews.length > 0 && (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {newPreviews.map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`new-${i}`}
                        style={{
                          width: '90px',
                          height: '90px',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          border: `1px solid ${GOLD}40`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>
                حداکثر ۳ تصویر — برای افزودن، ابتدا یکی را حذف کنید
              </p>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <a
              href="/admin/dashboard/products"
              style={{
                padding: '12px 28px',
                background: 'transparent',
                border: '1px solid #2a2a2a',
                borderRadius: '4px',
                color: '#666',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              انصراف
            </a>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  )
}
