import Link from 'next/link'
import { notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../../lib/supabase-admin'

type Order = {
  id: string
  created_at: string
  status: string
  total_usd: number | null
  total_fa: number | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
  shipping_address: string | null
  notes: string | null
  user_id: string | null
}

type OrderItem = {
  id: string
  product_id: string | null
  product_name_en: string | null
  product_name_fa: string | null
  quantity: number
  price_usd: number | null
  price_fa: number | null
}

const GOLD = '#C9A84C'

const STATUSES = [
  { value: 'pending',   label: 'در انتظار' },
  { value: 'confirmed', label: 'تأیید شده' },
  { value: 'shipped',   label: 'ارسال شده' },
  { value: 'delivered', label: 'تحویل داده شده' },
  { value: 'cancelled', label: 'لغو شده' },
]

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  confirmed: { bg: 'rgba(59,130,246,0.1)',  text: '#60a5fa' },
  shipped:   { bg: 'rgba(139,92,246,0.1)',  text: '#a78bfa' },
  delivered: { bg: 'rgba(34,197,94,0.1)',   text: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   text: '#f87171' },
}

async function updateOrderStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  await supabaseAdmin.from('orders').update({ status }).eq('id', id)
  revalidatePath(`/admin/dashboard/orders/${id}`)
  revalidatePath('/admin/dashboard/orders')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', id)
    .single()

  if (!order) notFound()

  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', id)
    .order('id')

  const o = order as Order
  const orderItems = (items ?? []) as OrderItem[]
  const sc = STATUS_COLORS[o.status] ?? { bg: 'rgba(100,100,100,0.1)', text: '#888' }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
            سفارش‌ها
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>
            جزئیات سفارش
          </h1>
          <p style={{ color: '#555', fontSize: '12px', marginTop: '6px', direction: 'ltr', fontFamily: 'monospace' }}>
            #{o.id.slice(0, 8).toUpperCase()}
          </p>
          <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '12px', opacity: 0.5 }} />
        </div>
        <Link
          href="/admin/dashboard/orders"
          style={{ padding: '10px 20px', background: 'transparent', border: '1px solid #2a2a2a', borderRadius: '4px', color: '#666', fontSize: '13px', textDecoration: 'none' }}
        >
          ← بازگشت
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' }}>
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Customer info */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '28px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#f5f5f5', margin: '0 0 20px' }}>اطلاعات مشتری</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {[
                { label: 'نام', value: o.customer_name },
                { label: 'ایمیل', value: o.customer_email, ltr: true },
                { label: 'تلفن', value: o.customer_phone, ltr: true },
                { label: 'تاریخ ثبت', value: formatDate(o.created_at) },
              ].map(({ label, value, ltr }) => value ? (
                <div key={label}>
                  <p style={{ color: '#555', fontSize: '11px', marginBottom: '4px', letterSpacing: '0.04em' }}>{label}</p>
                  <p style={{ color: '#aaa', fontSize: '14px', margin: 0, direction: ltr ? 'ltr' : 'inherit' }}>{value}</p>
                </div>
              ) : null)}
            </div>
            {o.shipping_address && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                <p style={{ color: '#555', fontSize: '11px', marginBottom: '4px' }}>آدرس ارسال</p>
                <p style={{ color: '#aaa', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{o.shipping_address}</p>
              </div>
            )}
            {o.notes && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #1e1e1e' }}>
                <p style={{ color: '#555', fontSize: '11px', marginBottom: '4px' }}>یادداشت</p>
                <p style={{ color: '#aaa', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>{o.notes}</p>
              </div>
            )}
          </div>

          {/* Order items */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 28px', borderBottom: '1px solid #1e1e1e' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '400', color: '#f5f5f5', margin: 0 }}>اقلام سفارش</h2>
            </div>
            {orderItems.length === 0 ? (
              <div style={{ padding: '32px 28px', color: '#555', fontSize: '14px', textAlign: 'center' }}>
                اقلامی ثبت نشده
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                    {['محصول', 'تعداد', 'قیمت واحد', 'جمع'].map((h) => (
                      <th key={h} style={{ padding: '12px 20px', fontSize: '12px', color: '#555', fontWeight: '400', textAlign: 'right' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item, i) => (
                    <tr key={item.id} style={{ borderBottom: i < orderItems.length - 1 ? '1px solid #161616' : 'none' }}>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ color: '#f5f5f5', fontSize: '14px', display: 'block' }}>
                          {item.product_name_fa || item.product_name_en || '—'}
                        </span>
                        {item.product_name_en && item.product_name_fa && (
                          <span style={{ color: '#555', fontSize: '11px', direction: 'ltr', display: 'block', marginTop: '2px' }}>
                            {item.product_name_en}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#888', fontSize: '14px', textAlign: 'center' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '14px 20px', color: GOLD, fontSize: '14px', direction: 'ltr' }}>
                        {item.price_usd ? `$${Number(item.price_usd).toLocaleString()}` : '—'}
                      </td>
                      <td style={{ padding: '14px 20px', color: GOLD, fontSize: '14px', direction: 'ltr', fontWeight: '500' }}>
                        {item.price_usd ? `$${(Number(item.price_usd) * item.quantity).toLocaleString()}` : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {o.total_usd && (
              <div style={{ padding: '16px 28px', borderTop: '1px solid #1e1e1e', display: 'flex', justifyContent: 'flex-end', gap: '24px' }}>
                <span style={{ color: '#555', fontSize: '14px' }}>مجموع کل</span>
                <span style={{ color: GOLD, fontSize: '16px', fontWeight: '500', direction: 'ltr' }}>
                  ${Number(o.total_usd).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Current status */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '400', color: '#f5f5f5', margin: '0 0 16px' }}>وضعیت سفارش</h3>
            <span style={{ padding: '6px 16px', borderRadius: '12px', fontSize: '13px', background: sc.bg, color: sc.text }}>
              {STATUSES.find((s) => s.value === o.status)?.label ?? o.status}
            </span>
          </div>

          {/* Update status */}
          <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '400', color: '#f5f5f5', margin: '0 0 16px' }}>تغییر وضعیت</h3>
            <form action={updateOrderStatus} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input type="hidden" name="id" value={o.id} />
              <select
                name="status"
                defaultValue={o.status}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0a0a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '4px',
                  color: '#f5f5f5',
                  fontSize: '14px',
                  fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                  outline: 'none',
                }}
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: GOLD,
                  border: 'none',
                  borderRadius: '4px',
                  color: '#0a0a0a',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                }}
              >
                ذخیره وضعیت
              </button>
            </form>
          </div>

          {/* Contact customer */}
          {o.customer_email && (
            <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '400', color: '#f5f5f5', margin: '0 0 16px' }}>تماس با مشتری</h3>
              <a
                href={`mailto:${o.customer_email}`}
                style={{
                  display: 'block',
                  padding: '10px 16px',
                  background: 'transparent',
                  border: `1px solid ${GOLD}40`,
                  borderRadius: '4px',
                  color: GOLD,
                  fontSize: '13px',
                  textDecoration: 'none',
                  textAlign: 'center',
                }}
              >
                ارسال ایمیل
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
