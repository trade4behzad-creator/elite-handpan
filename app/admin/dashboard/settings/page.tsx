const GOLD = '#C9A84C'

export default function SettingsPage() {
  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          سیستم
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>تنظیمات</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>
      <div
        style={{
          background: '#111',
          border: '1px solid #1e1e1e',
          borderRadius: '8px',
          padding: '48px',
          textAlign: 'center',
          color: '#555',
        }}
      >
        <p style={{ fontSize: '16px', marginBottom: '8px' }}>در دست توسعه</p>
        <p style={{ fontSize: '13px' }}>تنظیمات سیستم به‌زودی اضافه می‌شود</p>
      </div>
    </div>
  )
}
