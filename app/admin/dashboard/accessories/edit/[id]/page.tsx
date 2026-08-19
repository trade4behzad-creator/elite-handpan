'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import EditAccessoryForm, { type Accessory, type AccessoryImage } from './EditAccessoryForm'

const GOLD = '#3F3E7A'

export default function EditAccessoryPage() {
  const params = useParams<{ id: string }>()
  const id = params?.id ?? ''

  const [accessory, setAccessory] = useState<Accessory | null>(null)
  const [images, setImages] = useState<AccessoryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    async function load() {
      setLoading(true)
      setFetchError(null)

      const { data: a, error: aErr } = await supabase
        .from('accessories')
        .select('id, name_en, name_fa, slug, category, price, price_fa, description_en, description_fa, in_stock, is_featured')
        .eq('id', id)
        .single()

      if (aErr || !a) {
        console.error('[EditAccessoryPage] accessory fetch error:', aErr)
        setFetchError(aErr?.message ?? 'اکسسوری یافت نشد')
        setLoading(false)
        return
      }

      setAccessory(a as Accessory)

      const { data: imgs, error: imgErr } = await supabase
        .from('accessory_images')
        .select('id, url, order')
        .eq('accessory_id', id)
        .order('order')

      if (imgErr) console.error('[EditAccessoryPage] images fetch error:', imgErr)
      setImages((imgs ?? []) as AccessoryImage[])
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

  if (fetchError || !accessory) {
    return (
      <div style={{ padding: '60px 40px', fontFamily: 'var(--font-vazirmatn), Arial, sans-serif' }}>
        <p style={{ color: '#f87171', fontSize: '14px', marginBottom: '8px' }}>خطا در بارگذاری اکسسوری</p>
        {fetchError && <p style={{ color: '#555', fontSize: '12px', direction: 'ltr', fontFamily: 'monospace' }}>{fetchError}</p>}
        <a href="/admin/dashboard/accessories" style={{ display: 'inline-block', marginTop: '20px', color: GOLD, fontSize: '13px', textDecoration: 'none' }}>
          ← بازگشت به لیست اکسسوری
        </a>
      </div>
    )
  }

  return <EditAccessoryForm accessory={accessory} images={images} />
}
