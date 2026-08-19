import Link from 'next/link'
import { supabaseAdmin } from '../../../../../lib/supabase-admin'
import { updateAboutSettings } from '../actions'

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
  direction: 'ltr',
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '13px', color: '#888', marginBottom: '8px' }
const fieldStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column' }

const cardStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid #1e1e1e',
  borderRadius: '8px',
  padding: '32px',
  maxWidth: '680px',
}

const saveButtonStyle: React.CSSProperties = {
  alignSelf: 'flex-start',
  padding: '12px 28px',
  background: GOLD,
  border: 'none',
  borderRadius: '4px',
  color: '#0a0a0a',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
  marginTop: '8px',
}

function SuccessBanner({ show, text }: { show: boolean; text: string }) {
  if (!show) return null
  return (
    <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '12px 18px', marginBottom: '20px', color: '#4ade80', fontSize: '13px' }}>
      ✓ {text}
    </div>
  )
}

function ErrorBanner({ show, text }: { show: boolean; text: string }) {
  if (!show) return null
  return (
    <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '12px 18px', marginBottom: '20px', color: '#f87171', fontSize: '13px' }}>
      {text}
    </div>
  )
}

export default async function AboutSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error: errorCode } = await searchParams

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <Link href="/admin/dashboard/settings" style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block', textDecoration: 'none' }}>
          ← تنظیمات
        </Link>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>درباره ما</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      <div style={cardStyle}>
        <SuccessBanner show={success === '1'} text="محتوای درباره ما ذخیره شد" />
        <ErrorBanner show={!!errorCode} text={errorCode === 'db' ? 'خطا در ذخیره تنظیمات' : ''} />
        <form action={updateAboutSettings} encType="multipart/form-data" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>عنوان (انگلیسی)</label>
              <input name="about_heading_en" placeholder="About Elite" defaultValue={settings?.about_heading_en ?? ''} style={inputStyle} />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>عنوان (فارسی)</label>
              <input name="about_heading_fa" placeholder="درباره الیت" defaultValue={settings?.about_heading_fa ?? ''} style={{ ...inputStyle, direction: 'rtl' }} />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>متن (انگلیسی)</label>
            <textarea name="about_body_en" rows={5} defaultValue={settings?.about_body_en ?? ''} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>متن (فارسی)</label>
            <textarea name="about_body_fa" rows={5} defaultValue={settings?.about_body_fa ?? ''} style={{ ...inputStyle, resize: 'vertical', direction: 'rtl' }} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>تصویر هدر (بالای صفحه)</label>
            <input name="about_hero_image" type="file" accept="image/*" style={{ ...inputStyle, padding: '8px' }} />
            {settings?.about_hero_image_url && (
              <img src={settings.about_hero_image_url} alt="Current hero" style={{ marginTop: '10px', maxWidth: '260px', borderRadius: '4px', border: '1px solid #2a2a2a' }} />
            )}
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>تصویر تیم</label>
            <input name="about_team_image" type="file" accept="image/*" style={{ ...inputStyle, padding: '8px' }} />
            {settings?.about_team_image_url && (
              <img src={settings.about_team_image_url} alt="Current team" style={{ marginTop: '10px', maxWidth: '260px', borderRadius: '4px', border: '1px solid #2a2a2a' }} />
            )}
          </div>
          <button type="submit" style={saveButtonStyle}>ذخیره درباره ما</button>
        </form>
      </div>
    </div>
  )
}
