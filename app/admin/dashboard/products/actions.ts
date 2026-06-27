'use server'

import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function createProduct(formData: FormData) {
  const name_en = (formData.get('name_en') as string).trim()
  const name_fa = (formData.get('name_fa') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const scale = (formData.get('scale') as string).trim()
  const notes = parseInt(formData.get('notes') as string, 10)
  const price = parseFloat(formData.get('price') as string)
  const description_en = (formData.get('description_en') as string).trim()
  const description_fa = (formData.get('description_fa') as string).trim()
  const note_arrangement = (formData.get('note_arrangement') as string).trim()
  const in_stock = formData.get('in_stock') === 'true'
  const images = formData.getAll('images') as File[]

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({ name_en, name_fa, slug, scale, notes, price, description_en, description_fa, note_arrangement, in_stock })
    .select()
    .single()

  if (error || !product) {
    redirect('/admin/dashboard/products/new?error=db')
  }

  const validImages = images.filter((f) => f && f.size > 0)
  for (let i = 0; i < validImages.length; i++) {
    const file = validImages[i]
    const ext = file.name.split('.').pop() ?? 'jpg'
    const path = `${slug}/${Date.now()}-${i}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data: stored } = await supabaseAdmin.storage
      .from('product-images')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (stored) {
      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(stored.path)

      await supabaseAdmin.from('product_images').insert({
        product_id: product.id,
        url: publicUrl,
        order: i,
      })
    }
  }

  redirect('/admin/dashboard/products?success=1')
}
