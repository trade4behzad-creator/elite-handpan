import Link from 'next/link'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { toggleAccessoryFeatured } from './actions'

type Accessory = {
  id: string
  name_en: string
  name_fa: string
  category: string | null
  price: number
  in_stock: boolean
  is_featured: boolean
  slug: string
}

async function deleteAccessory(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await supabaseAdmin.from('accessory_images').delete().eq('accessory_id', id)
  await supabaseAdmin.from('accessories').delete().eq('id', id)
  revalidatePath('/admin/dashboard/accessories')
}

async function toggleStock(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const current = formData.get('in_stock') === 'true'
  await supabaseAdmin.from('accessories').update({ in_stock: !current }).eq('id', id)
  revalidatePath('/admin/dashboard/accessories')
}

const GOLD = '#3F3E7A'

export default async function AccessoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams

  const { data: accessories, error } = await supabaseAdmin
    .from('accessories')
    .select('id, name_en, name_fa, category, price, in_stock, is_featured, slug')
    .order('created_at', { ascending: false })

  async function handleToggleFeatured(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const current = formData.get('current') === 'true'
    await toggleAccessoryFeatured(id, current)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
            مدیریت
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>اکسسوری</h1>
          <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
        </div>
        <Link
          href="/admin/dashboard/accessories/new"
          style={{
            padding: '12px 24px',
            background: GOLD,
            borderRadius: '4px',
            color: '#0a0a0a',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          + افزودن اکسسوری
        </Link>
      </div>

      {success === '1' && (
        <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '6px', padding: '14px 20px', marginBottom: '24px', color: '#4ade80', fontSize: '14px' }}>
          ✓ با موفقیت ذخیره شد
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '6px', padding: '14px 20px', marginBottom: '24px', color: '#f87171', fontSize: '14px' }}>
          خطا در دریافت اطلاعات: {error.message}
        </div>
      )}

      {!error && (!accessories || accessories.length === 0) && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '56px 48px', textAlign: 'center', color: '#555' }}>
          <p style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>هیچ اکسسوری‌ای یافت نشد</p>
          <p style={{ fontSize: '13px' }}>روی «افزودن اکسسوری» کلیک کنید تا اولین مورد را اضافه کنید</p>
        </div>
      )}

      {accessories && accessories.length > 0 && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['نام انگلیسی', 'نام فارسی', 'دسته‌بندی', 'قیمت', 'موجودی', 'پیشنهاد ویژه', 'عملیات'].map((h) => (
                  <th key={h} style={{ padding: '14px 20px', fontSize: '12px', color: '#555', fontWeight: 400, textAlign: 'right', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(accessories as Accessory[]).map((item, i) => (
                <tr key={item.id} style={{ borderBottom: i < accessories.length - 1 ? '1px solid #161616' : 'none' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#aaa', fontSize: '14px', direction: 'ltr', display: 'block' }}>{item.name_en}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#f5f5f5', fontSize: '14px' }}>{item.name_fa}</span>
                  </td>
                  <td style={{ padding: '14px 20px', color: '#888', fontSize: '13px' }}>{item.category || '—'}</td>
                  <td style={{ padding: '14px 20px', color: GOLD, fontSize: '14px', direction: 'ltr', whiteSpace: 'nowrap' }}>
                    ${Number(item.price).toLocaleString()}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="in_stock" value={String(item.in_stock)} />
                      <button
                        type="submit"
                        style={{
                          padding: '4px 14px',
                          background: item.in_stock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${item.in_stock ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
                          borderRadius: '12px',
                          color: item.in_stock ? '#4ade80' : '#f87171',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.in_stock ? 'موجود' : 'ناموجود'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <form action={handleToggleFeatured}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="current" value={String(item.is_featured)} />
                      <button
                        type="submit"
                        style={{
                          padding: '4px 14px',
                          background: item.is_featured ? 'rgba(63,62,122,0.12)' : 'transparent',
                          border: `1px solid ${item.is_featured ? '#3F3E7A' : '#333'}`,
                          borderRadius: '12px',
                          color: item.is_featured ? '#8f8dd6' : '#555',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.is_featured ? '★ ویژه' : '☆ عادی'}
                      </button>
                    </form>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link
                        href={`/admin/dashboard/accessories/edit/${item.id}`}
                        style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${GOLD}50`, borderRadius: '4px', color: GOLD, fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}
                      >
                        ویرایش
                      </Link>
                      <form action={deleteAccessory}>
                        <input type="hidden" name="id" value={item.id} />
                        <button
                          type="submit"
                          style={{ padding: '6px 14px', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', color: '#f87171', fontSize: '12px', cursor: 'pointer', fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}
                        >
                          حذف
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
