import { supabaseAdmin } from '../../../lib/supabase-admin'

async function getStats() {
  const [{ count: products }, { count: messages }] = await Promise.all([
    supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('messages').select('*', { count: 'exact', head: true }),
  ])
  const { count: unread } = await supabaseAdmin
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)
  const { count: pendingOrders } = await supabaseAdmin
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return { products: products ?? 0, messages: messages ?? 0, unread: unread ?? 0, pendingOrders: pendingOrders ?? 0 }
}

const GOLD = '#3F3E7A'

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'سفارش‌های جدید', value: stats.pendingOrders, sub: 'در انتظار بررسی', color: '#4ade80', href: '/admin/dashboard/orders' },
    { label: 'محصولات هندپن', value: stats.products, sub: 'در پایگاه داده', color: GOLD, href: '/admin/dashboard/products' },
    { label: 'پیام‌ها', value: stats.messages, sub: 'مجموع دریافتی', color: '#60a5fa', href: '/admin/dashboard/messages' },
    { label: 'پیام‌های خوانده‌نشده', value: stats.unread, sub: 'نیاز به پاسخ', color: '#f87171', href: '/admin/dashboard/messages' },
  ]

  return (
    <div>
      <div style={{ marginBottom: '40px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          Elite Handpan
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>داشبورد</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px', marginBottom: '48px' }}>
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            style={{
              display: 'block',
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: '8px',
              padding: '28px 24px',
              textDecoration: 'none',
              transition: 'border-color 0.15s',
            }}
          >
            <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px' }}>{card.label}</p>
            <p style={{ fontSize: '40px', fontWeight: '300', color: card.color, margin: '0 0 6px', lineHeight: 1 }}>
              {card.value}
            </p>
            <p style={{ color: '#444', fontSize: '12px', margin: 0 }}>{card.sub}</p>
          </a>
        ))}
      </div>

      {/* Quick links */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '28px 24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#f5f5f5', margin: '0 0 20px' }}>دسترسی سریع</h2>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { href: '/admin/dashboard/products/new', label: '+ افزودن هندپن جدید' },
            { href: '/admin/dashboard/accessories/new', label: '+ افزودن اکسسوری جدید' },
            { href: '/admin/dashboard/messages', label: 'مشاهده پیام‌ها' },
            { href: '/admin/dashboard/products', label: 'لیست محصولات' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: `1px solid ${GOLD}40`,
                borderRadius: '4px',
                color: GOLD,
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
