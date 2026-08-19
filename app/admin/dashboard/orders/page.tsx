import Link from 'next/link'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { revalidatePath } from 'next/cache'

type Order = {
  id: string
  created_at: string
  status: string
  total_usd: number | null
  total_fa: number | null
  customer_name: string | null
  customer_email: string | null
  customer_phone: string | null
}

const GOLD = '#3F3E7A'

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending:   { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b' },
  confirmed: { bg: 'rgba(59,130,246,0.1)',  text: '#60a5fa' },
  shipped:   { bg: 'rgba(139,92,246,0.1)',  text: '#a78bfa' },
  delivered: { bg: 'rgba(34,197,94,0.1)',   text: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.1)',   text: '#f87171' },
}

const STATUS_FA: Record<string, string> = {
  pending: 'در انتظار',
  confirmed: 'تأیید شده',
  shipped: 'ارسال شده',
  delivered: 'تحویل داده شده',
  cancelled: 'لغو شده',
}

async function updateStatus(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const status = formData.get('status') as string
  await supabaseAdmin.from('orders').update({ status }).eq('id', id)
  revalidatePath('/admin/dashboard/orders')
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; phone?: string; sort?: string }>
}) {
  const { status: filterStatus, phone: filterPhone, sort } = await searchParams

  let query = supabaseAdmin
    .from('orders')
    .select('id, created_at, status, total_usd, total_fa, customer_name, customer_email, customer_phone')

  if (sort === 'phone') {
    query = query.order('customer_phone', { ascending: true }).order('created_at', { ascending: false })
  } else {
    query = query.order('created_at', { ascending: false })
  }

  if (filterStatus) {
    query = query.eq('status', filterStatus)
  }
  if (filterPhone) {
    query = query.ilike('customer_phone', `%${filterPhone.trim()}%`)
  }

  const { data: orders, error } = await query

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
          مدیریت
        </p>
        <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>سفارش‌ها</h1>
        <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
      </div>

      {/* Status filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link
          href="/admin/dashboard/orders"
          style={{
            padding: '6px 16px',
            borderRadius: '4px',
            fontSize: '12px',
            textDecoration: 'none',
            background: !filterStatus ? GOLD : 'transparent',
            color: !filterStatus ? '#0a0a0a' : '#666',
            border: `1px solid ${!filterStatus ? GOLD : '#2a2a2a'}`,
          }}
        >
          همه
        </Link>
        {statuses.map((s) => {
          const colors = STATUS_COLORS[s] ?? { bg: 'transparent', text: '#888' }
          const isActive = filterStatus === s
          return (
            <Link
              key={s}
              href={`/admin/dashboard/orders?status=${s}`}
              style={{
                padding: '6px 16px',
                borderRadius: '4px',
                fontSize: '12px',
                textDecoration: 'none',
                background: isActive ? colors.bg : 'transparent',
                color: isActive ? colors.text : '#555',
                border: `1px solid ${isActive ? colors.text + '50' : '#2a2a2a'}`,
              }}
            >
              {STATUS_FA[s] ?? s}
            </Link>
          )
        })}
      </div>

      {/* Phone search — see all orders placed with a given phone number */}
      {filterPhone && orders && (
        <div style={{ background: 'rgba(63,62,122,0.08)', border: '1px solid rgba(63,62,122,0.3)', borderRadius: '6px', padding: '12px 18px', marginBottom: '16px', color: '#8f8dd6', fontSize: '13px' }}>
          سابقه خرید شماره <span style={{ direction: 'ltr', display: 'inline-block' }}>{filterPhone}</span>: {orders.length} سفارش
        </div>
      )}
      <form method="GET" style={{ display: 'flex', gap: '8px', marginBottom: '24px', maxWidth: '360px' }}>
        {filterStatus && <input type="hidden" name="status" value={filterStatus} />}
        <input
          type="text"
          name="phone"
          defaultValue={filterPhone ?? ''}
          placeholder="جستجو بر اساس شماره تلفن مشتری..."
          style={{
            flex: 1,
            padding: '9px 14px',
            background: '#0a0a0a',
            border: '1px solid #2a2a2a',
            borderRadius: '4px',
            color: '#f5f5f5',
            fontSize: '13px',
            direction: 'ltr',
            outline: 'none',
            fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '9px 18px',
            background: GOLD,
            border: 'none',
            borderRadius: '4px',
            color: '#0a0a0a',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          جستجو
        </button>
        {filterPhone && (
          <Link
            href={filterStatus ? `/admin/dashboard/orders?status=${filterStatus}` : '/admin/dashboard/orders'}
            style={{
              padding: '9px 14px',
              border: '1px solid #2a2a2a',
              borderRadius: '4px',
              color: '#888',
              fontSize: '13px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            پاک کردن
          </Link>
        )}
      </form>

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '14px 20px', marginBottom: '24px', color: '#f87171', fontSize: '14px' }}>
          خطا در دریافت اطلاعات: {error.message}
        </div>
      )}

      {/* Empty state */}
      {!error && (!orders || orders.length === 0) && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '56px 48px', textAlign: 'center', color: '#555' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>هیچ سفارشی یافت نشد</p>
          <p style={{ fontSize: '13px' }}>سفارش‌های مشتریان اینجا نمایش داده می‌شوند</p>
        </div>
      )}

      {/* Orders table */}
      {orders && orders.length > 0 && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['شناسه', 'مشتری'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: '12px', color: '#555', fontWeight: '400', textAlign: 'right', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
                <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '400', textAlign: 'right', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                  <Link
                    href={`/admin/dashboard/orders?${new URLSearchParams({
                      ...(filterStatus ? { status: filterStatus } : {}),
                      ...(filterPhone ? { phone: filterPhone } : {}),
                      sort: sort === 'phone' ? '' : 'phone',
                    }).toString()}`}
                    style={{ color: sort === 'phone' ? GOLD : '#555', textDecoration: 'none' }}
                  >
                    شماره تلفن {sort === 'phone' ? '↑' : ''}
                  </Link>
                </th>
                {['تاریخ', 'مبلغ', 'وضعیت', 'عملیات'].map((h) => (
                  <th
                    key={h}
                    style={{ padding: '14px 20px', fontSize: '12px', color: '#555', fontWeight: '400', textAlign: 'right', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(orders as Order[]).map((order, i) => {
                const sc = STATUS_COLORS[order.status] ?? { bg: 'rgba(100,100,100,0.1)', text: '#888' }
                return (
                  <tr
                    key={order.id}
                    style={{ borderBottom: i < orders.length - 1 ? '1px solid #161616' : 'none' }}
                  >
                    {/* ID */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: '#666', fontSize: '12px', direction: 'ltr', display: 'block', fontFamily: 'monospace' }}>
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* Customer */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ color: '#f5f5f5', fontSize: '14px', display: 'block' }}>
                        {order.customer_name || '—'}
                      </span>
                      {order.customer_email && (
                        <span style={{ color: '#555', fontSize: '11px', direction: 'ltr', display: 'block', marginTop: '2px' }}>
                          {order.customer_email}
                        </span>
                      )}
                    </td>

                    {/* Phone — click to see this customer's full order history */}
                    <td style={{ padding: '14px 20px' }}>
                      {order.customer_phone ? (
                        <Link
                          href={`/admin/dashboard/orders?phone=${encodeURIComponent(order.customer_phone)}`}
                          style={{ color: GOLD, fontSize: '13px', direction: 'ltr', display: 'block', textDecoration: 'none' }}
                          title="مشاهده سابقه خرید این شماره"
                        >
                          {order.customer_phone}
                        </Link>
                      ) : (
                        <span style={{ color: '#555', fontSize: '13px' }}>—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 20px', color: '#888', fontSize: '12px', whiteSpace: 'nowrap' }}>
                      {formatDate(order.created_at)}
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '14px 20px', color: GOLD, fontSize: '14px', direction: 'ltr', whiteSpace: 'nowrap' }}>
                      {order.total_fa
                        ? `${Number(order.total_fa).toLocaleString('en-US')} تومان`
                        : order.total_usd
                          ? `$${Number(order.total_usd).toLocaleString()}`
                          : '—'}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', background: sc.bg, color: sc.text, whiteSpace: 'nowrap' }}>
                        {STATUS_FA[order.status] ?? order.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px' }}>
                      <Link
                        href={`/admin/dashboard/orders/${order.id}`}
                        style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${GOLD}50`, borderRadius: '4px', color: GOLD, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        جزئیات
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
