import Link from 'next/link'
import { supabaseAdmin } from '../../../../lib/supabase'
import { revalidatePath } from 'next/cache'

type Product = {
  id: string
  name_en: string
  name_fa: string
  scale: string
  price: number
  in_stock: boolean
  slug: string
}

async function deleteProduct(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  await supabaseAdmin.from('product_images').delete().eq('product_id', id)
  await supabaseAdmin.from('products').delete().eq('id', id)
  revalidatePath('/admin/dashboard/products')
}

async function toggleStock(formData: FormData) {
  'use server'
  const id = formData.get('id') as string
  const current = formData.get('in_stock') === 'true'
  await supabaseAdmin.from('products').update({ in_stock: !current }).eq('id', id)
  revalidatePath('/admin/dashboard/products')
}

const GOLD = '#C9A84C'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>
}) {
  const { success } = await searchParams

  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, scale, price, in_stock, slug')
    .order('created_at', { ascending: false })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <p style={{ color: GOLD, fontSize: '11px', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>
            مدیریت
          </p>
          <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#f5f5f5', margin: 0 }}>محصولات هندپن</h1>
          <div style={{ width: '40px', height: '1px', background: GOLD, marginTop: '16px', opacity: 0.5 }} />
        </div>
        <Link
          href="/admin/dashboard/products/new"
          style={{
            padding: '11px 24px',
            background: GOLD,
            color: '#0a0a0a',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          + افزودن محصول جدید
        </Link>
      </div>

      {/* Success banner */}
      {success === '1' && (
        <div
          style={{
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '6px',
            padding: '14px 20px',
            marginBottom: '24px',
            color: '#4ade80',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>✓</span>
          محصول با موفقیت ذخیره شد
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '6px',
            padding: '14px 20px',
            marginBottom: '24px',
            color: '#f87171',
            fontSize: '14px',
          }}
        >
          خطا در دریافت اطلاعات: {error.message}
        </div>
      )}

      {/* Empty state */}
      {!error && (!products || products.length === 0) && (
        <div
          style={{
            background: '#111',
            border: '1px solid #1e1e1e',
            borderRadius: '8px',
            padding: '56px 48px',
            textAlign: 'center',
            color: '#555',
          }}
        >
          <p style={{ fontSize: '16px', marginBottom: '8px', color: '#666' }}>هیچ محصولی یافت نشد</p>
          <p style={{ fontSize: '13px', marginBottom: '24px' }}>اولین محصول خود را اضافه کنید</p>
          <Link
            href="/admin/dashboard/products/new"
            style={{
              padding: '10px 24px',
              background: GOLD,
              color: '#0a0a0a',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
            }}
          >
            + افزودن محصول جدید
          </Link>
        </div>
      )}

      {/* Products table */}
      {products && products.length > 0 && (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['نام انگلیسی', 'نام فارسی', 'گام', 'قیمت', 'موجودی', 'عملیات'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 20px',
                      fontSize: '12px',
                      color: '#555',
                      fontWeight: '400',
                      textAlign: 'right',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products as Product[]).map((product, i) => (
                <tr
                  key={product.id}
                  style={{
                    borderBottom: i < products.length - 1 ? '1px solid #161616' : 'none',
                    transition: 'background 0.1s',
                  }}
                >
                  {/* Name EN */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#aaa', fontSize: '14px', direction: 'ltr', display: 'block' }}>
                      {product.name_en}
                    </span>
                    <span style={{ color: '#444', fontSize: '11px', direction: 'ltr', display: 'block', marginTop: '2px' }}>
                      /{product.slug}
                    </span>
                  </td>

                  {/* Name FA */}
                  <td style={{ padding: '14px 20px', color: '#f5f5f5', fontSize: '14px' }}>
                    {product.name_fa || '—'}
                  </td>

                  {/* Scale */}
                  <td style={{ padding: '14px 20px', color: '#888', fontSize: '13px', direction: 'ltr', whiteSpace: 'nowrap' }}>
                    {product.scale}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '14px 20px', color: GOLD, fontSize: '14px', direction: 'ltr', whiteSpace: 'nowrap' }}>
                    ${Number(product.price).toLocaleString()}
                  </td>

                  {/* Stock toggle */}
                  <td style={{ padding: '14px 20px' }}>
                    <form action={toggleStock}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="in_stock" value={String(product.in_stock)} />
                      <button
                        type="submit"
                        title="کلیک کنید برای تغییر"
                        style={{
                          padding: '4px 14px',
                          background: product.in_stock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          border: `1px solid ${product.in_stock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                          borderRadius: '12px',
                          color: product.in_stock ? '#4ade80' : '#f87171',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {product.in_stock ? 'موجود' : 'ناموجود'}
                      </button>
                    </form>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Link
                        href={`/admin/dashboard/products/edit/${product.id}`}
                        style={{
                          padding: '6px 14px',
                          background: 'transparent',
                          border: `1px solid ${GOLD}50`,
                          borderRadius: '4px',
                          color: GOLD,
                          fontSize: '12px',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ویرایش
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={product.id} />
                        <button
                          type="submit"
                          style={{
                            padding: '6px 14px',
                            background: 'transparent',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '4px',
                            color: '#f87171',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                            whiteSpace: 'nowrap',
                          }}
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
