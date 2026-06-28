'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EditProductForm, { type Product, type ProductImage } from './EditProductForm'

const GOLD = '#C9A84C'

export default function EditProductPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''

  const [product, setProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function load() {
      setLoading(true)
      setFetchError(null)

      const { data: p, error: pErr } = await supabase
        .from('products')
        .select('id, name_en, name_fa, slug, scale, notes, price, price_fa, description_en, description_fa, note_arrangement, in_stock')
        .eq('id', id)
        .single()

      if (pErr || !p) {
        console.error('[EditProductPage] product fetch error:', pErr)
        setFetchError(pErr?.message ?? 'محصول یافت نشد')
        setLoading(false)
        return
      }

      setProduct(p as Product)

      const { data: imgs, error: imgErr } = await supabase
        .from('product_images')
        .select('id, url, sort_order')
        .eq('product_id', id)
        .order('sort_order', { ascending: true })

      if (imgErr) console.error('[EditProductPage] images fetch error:', imgErr)
      setImages((imgs ?? []) as ProductImage[])
      setLoading(false)
    }

    load()
  }, [id])

  if (loading) {
    return (
      <div style={{ padding: '60px 40px', color: '#888', fontSize: '14px', fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: GOLD }}>◌</span>
          در حال بارگذاری...
        </div>
      </div>
    )
  }

  if (fetchError || !product) {
    return (
      <div style={{ padding: '60px 40px', fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}>
        <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '8px' }}>خطا در بارگذاری محصول</p>
        {fetchError && (
          <p style={{ color: '#555', fontSize: '12px', direction: 'ltr', fontFamily: 'monospace' }}>{fetchError}</p>
        )}
        <a
          href="/admin/dashboard/products"
          style={{ display: 'inline-block', marginTop: '20px', color: GOLD, fontSize: '13px', textDecoration: 'none' }}
        >
          ← بازگشت به لیست محصولات
        </a>
      </div>
    )
  }

  return <EditProductForm product={product} images={images} />
}
