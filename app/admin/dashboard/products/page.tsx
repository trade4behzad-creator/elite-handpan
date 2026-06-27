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
  product_images?: { url: string }[]
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

export default async function ProductsPage() {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, scale, price, in_stock, slug, product_images(url)')
    .order('created_at', { ascending: false })

  const GOLD = '#C9A84C'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
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

      {(!products || products.length === 0) ? (
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
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>هیچ محصولی یافت نشد</p>
          <p style={{ fontSize: '13px' }}>اولین محصول خود را اضافه کنید</p>
        </div>
      ) : (
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                {['تصویر', 'نام', 'گام', 'قیمت', 'موجودی', 'عملیات'].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: '14px 20px',
                      fontSize: '12px',
                      color: '#555',
                      fontWeight: '400',
                      textAlign: 'right',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(products as Product[]).map((product, i) => {
                const img = product.product_images?.[0]?.url
                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: i < products.length - 1 ? '1px solid #161616' : 'none',
                    }}
                  >
                    {/* Image */}
                    <td style={{ padding: '12px 20px' }}>
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          background: '#1a1a1a',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {img ? (
                          <img src={img} alt={product.name_en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ color: '#333', fontSize: '18px' }}>◎</span>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td style={{ padding: '12px 20px' }}>
                      <p style={{ color: '#f5f5f5', fontSize: '14px', margin: '0 0 2px' }}>{product.name_fa || product.name_en}</p>
                      <p style={{ color: '#555', fontSize: '12px', margin: 0, direction: 'ltr' }}>{product.name_en}</p>
                    </td>

                    {/* Scale */}
                    <td style={{ padding: '12px 20px', color: '#888', fontSize: '13px', direction: 'ltr' }}>
                      {product.scale}
                    </td>

                    {/* Price */}
                    <td style={{ padding: '12px 20px', color: GOLD, fontSize: '14px', direction: 'ltr' }}>
                      ${product.price?.toLocaleString()}
                    </td>

                    {/* Stock toggle */}
                    <td style={{ padding: '12px 20px' }}>
                      <form action={toggleStock}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="in_stock" value={String(product.in_stock)} />
                        <button
                          type="submit"
                          style={{
                            padding: '4px 12px',
                            background: product.in_stock ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                            border: `1px solid ${product.in_stock ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
                            borderRadius: '12px',
                            color: product.in_stock ? '#4ade80' : '#f87171',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontFamily: 'var(--font-vazirmatn), Arial, sans-serif',
                          }}
                        >
                          {product.in_stock ? 'موجود' : 'ناموجود'}
                        </button>
                      </form>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px 20px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link
                          href={`/admin/dashboard/products/${product.id}/edit`}
                          style={{
                            padding: '6px 14px',
                            background: 'transparent',
                            border: `1px solid ${GOLD}40`,
                            borderRadius: '4px',
                            color: GOLD,
                            fontSize: '12px',
                            textDecoration: 'none',
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
                            }}
                          >
                            حذف
                          </button>
                        </form>
                      </div>
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
