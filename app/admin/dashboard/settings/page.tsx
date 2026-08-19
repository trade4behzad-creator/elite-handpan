import Link from 'next/link'
import { changeAdminPassword } from './actions'

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
  marginBottom: '32px',
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

const sections = [
  { href: '/admin/dashboard/settings/contact', title: 'تماس با ما', desc: 'ایمیل، تلفن، واتساپ، اینستاگرام و آدرس' },
  { href: '/admin/dashboard/settings/cart', title: 'سبد خرید و پرداخت', desc: 'شماره کارت/شبا، نمونه چک و قوانین خرید' },
  { href: '/admin/dashboard/settings/features', title: 'ویژگی‌های صفحه محصول', desc: 'سه بلاک زیر هر محصول (کیفیت، گارانتی، ارسال)' },
  { href: '/admin/dashboard/settings/about', title: 'درباره ما', desc: 'عنوان، متن و تصاویر صفحه درباره ما' },
]

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const { success, error: errorCode } = await searchParams

  const errorMessages: Record<string, string> = {
    db: 'خطا در ذخیره تنظیمات',
    password_short: 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد',
    password_mismatch: 'رمز عبور جدید و تکرار آن یکسان نیستند',
    password_wrong: 'رمز عبور فعلی اشتباه است',
  }

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          سیستم
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>تنظیمات</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      {/* Links to each settings section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', marginBottom: '40px', maxWidth: '900px' }}>
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            style={{
              display: 'block',
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '8px',
              padding: '22px 20px',
              textDecoration: 'none',
            }}
          >
            <h3 style={{ fontSize: '15px', color: '#f5f5f5', fontWeight: 400, margin: '0 0 8px' }}>{s.title}</h3>
            <p style={{ fontSize: '12px', color: '#666', margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* ===================== Admin password ===================== */}
      <div style={cardStyle}>
        <h2 style={{ fontSize: '16px', color: '#f5f5f5', fontWeight: 400, marginTop: 0, marginBottom: '8px' }}>
          تغییر رمز عبور پنل ادمین
        </h2>
        <SuccessBanner show={success === 'password'} text="رمز عبور با موفقیت تغییر کرد" />
        <ErrorBanner show={!!errorCode} text={errorMessages[errorCode ?? ''] ?? ''} />
        <form action={changeAdminPassword} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '360px' }}>
          <div style={fieldStyle}>
            <label style={labelStyle}>رمز عبور فعلی</label>
            <input name="current_password" type="password" required autoComplete="current-password" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>رمز عبور جدید (حداقل ۶ کاراکتر)</label>
            <input name="new_password" type="password" required minLength={6} autoComplete="new-password" style={inputStyle} />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>تکرار رمز عبور جدید</label>
            <input name="confirm_password" type="password" required minLength={6} autoComplete="new-password" style={inputStyle} />
          </div>
          <button type="submit" style={saveButtonStyle}>تغییر رمز عبور</button>
        </form>
      </div>
    </div>
  )
}
