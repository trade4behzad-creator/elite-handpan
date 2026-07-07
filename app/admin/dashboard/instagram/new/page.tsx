'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { createInstagramPost } from '../actions'

const GOLD = '#3F3E7A'

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
      }}
    >
      {pending ? 'در حال ذخیره...' : 'ذخیره پست'}
    </button>
  )
}

export default function NewInstagramPostPage() {
  const [preview, setPreview] = useState<string | null>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    setPreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          اینستاگرام
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>افزودن پست جدید</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      <form action={createInstagramPost}>
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
          <div style={fieldStyle}>
            <label style={labelStyle}>لینک پست اینستاگرام</label>
            <input
              name="post_url"
              required
              placeholder="https://www.instagram.com/p/xxxxxxx/"
              style={{ ...inputStyle, direction: 'ltr' }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>ترتیب نمایش (عدد کوچیک‌تر = اول)</label>
            <input
              name="order"
              type="number"
              defaultValue={0}
              style={{ ...inputStyle, direction: 'ltr' }}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>تامبنیل پست</label>
            <div
              style={{
                border: '1px dashed #2a2a2a',
                borderRadius: '6px',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
                id="image-input"
                required
              />
              <label
                htmlFor="image-input"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  border: `1px solid ${GOLD}40`,
                  borderRadius: '4px',
                  color: GOLD,
                  fontSize: '13px',
                  cursor: 'pointer',
                  marginBottom: preview ? '16px' : '0',
                }}
              >
                انتخاب عکس
              </label>

              {preview && (
                <div>
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: '140px',
                      height: '140px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      border: `1px solid ${GOLD}40`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            
              <a href="/admin/dashboard/instagram"
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