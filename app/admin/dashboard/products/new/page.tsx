'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createProduct } from '../actions'

const GOLD = '#C9A84C'

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

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
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
      {pending ? 'در حال ذخیره...' : 'ذخیره محصول'}
    </button>
  )
}

export default function NewProductPage() {
  const [slug, setSlug] = useState('')
  const [inStock, setInStock] = useState(true)
  const [previews, setPreviews] = useState<string[]>([])

  function handleNameEnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSlug(slugify(e.target.value))
  }

  function handleImagesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 3)
    setPreviews(files.map((f) => URL.createObjectURL(f)))
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          محصولات
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>افزودن محصول جدید</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      <form action={createProduct}>
        {/* Hidden in_stock field — updated by the toggle button */}
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
          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>نام (انگلیسی)</label>
              <input
                name="name_en"
                required
                placeholder="Elite Solstice"
                onChange={handleNameEnChange}
                style={{ ...inputStyle, direction: 'ltr' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>نام (فارسی)</label>
              <input name="name_fa" required placeholder="الیت سولستیس" style={inputStyle} />
            </div>
          </div>

          {/* Slug */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Slug (آدرس صفحه)</label>
            <input
              name="slug"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="elite-solstice"
              style={{ ...inputStyle, direction: 'ltr', color: GOLD }}
            />
          </div>

          {/* Scale + Notes + Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>گام (Scale)</label>
              <input name="scale" required placeholder="D Minor" style={{ ...inputStyle, direction: 'ltr' }} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>تعداد نت</label>
              <input
                name="notes"
                type="number"
                required
                min={1}
                max={20}
                placeholder="9"
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
                placeholder="1400"
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
                placeholder="Product description..."
                style={{ ...inputStyle, direction: 'ltr', resize: 'vertical' }}
              />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>توضیحات (فارسی)</label>
              <textarea
                name="description_fa"
                rows={4}
                placeholder="توضیحات محصول..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Note arrangement */}
          <div style={fieldStyle}>
            <label style={labelStyle}>آرایش نت‌ها</label>
            <input
              name="note_arrangement"
              placeholder="D3, A3, Bb3, C4, D4, E4, F4, G4, A4"
              style={{ ...inputStyle, direction: 'ltr' }}
            />
          </div>

          {/* In stock toggle */}
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

          {/* Image upload */}
          <div style={fieldStyle}>
            <label style={labelStyle}>تصاویر محصول (حداکثر ۳ تصویر)</label>
            <div
              style={{
                border: '1px dashed #2a2a2a',
                borderRadius: '6px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <input
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                style={{ display: 'none' }}
                id="images-input"
              />
              <label
                htmlFor="images-input"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  border: `1px solid ${GOLD}40`,
                  borderRadius: '4px',
                  color: GOLD,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginBottom: previews.length ? '16px' : '0',
                }}
              >
                انتخاب تصاویر
              </label>

              {previews.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {previews.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt={`preview-${i}`}
                      style={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        border: `1px solid ${GOLD}40`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
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
