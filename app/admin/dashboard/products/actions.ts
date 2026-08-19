'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

const BUCKET = 'product-images'

async function ensureBucket() {
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()
  if (error) {
    console.error('[storage] listBuckets error:', error)
    return
  }
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
    if (createErr) console.error('[storage] createBucket error:', createErr)
    else console.log(`[storage] bucket "${BUCKET}" created`)
  }
}

async function uploadImage(file: File, slug: string): Promise<string | null> {
  const path = `products/${slug}/${Date.now()}-${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const { data: stored, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true })

  if (error || !stored) {
    console.error('[storage] upload error:', error)
    return null
  }

  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(stored.path)
  return publicUrl
}

// Called from EditProductForm client component after client-side storage upload
export async function saveImageRecord(productId: string, url: string, order: number) {
  const { error } = await supabaseAdmin.from('product_images').insert({
    product_id: productId,
    url,
    order,
  })
  if (error) console.error('[db] saveImageRecord error:', error)
}

export async function updateProduct(formData: FormData) {
  const id = formData.get('id') as string
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
  const is_featured = formData.get('is_featured') === 'true'
  const price_fa_raw = formData.get('price_fa') as string
  const price_fa = price_fa_raw && price_fa_raw.trim() !== '' ? parseInt(price_fa_raw.trim(), 10) : null
  const price_installment_raw = formData.get('price_installment') as string
  const price_installment = price_installment_raw && price_installment_raw.trim() !== '' ? parseFloat(price_installment_raw.trim()) : null
  const price_installment_fa_raw = formData.get('price_installment_fa') as string
  const price_installment_fa = price_installment_fa_raw && price_installment_fa_raw.trim() !== '' ? parseInt(price_installment_fa_raw.trim(), 10) : null

  const { error } = await supabaseAdmin
    .from('products')
    .update({ name_en, name_fa, slug, scale, notes, price, price_fa, price_installment, price_installment_fa, description_en, description_fa, note_arrangement, in_stock, is_featured })
    .eq('id', id)

  if (error) {
    console.error('[db] updateProduct error:', error)
    redirect(`/admin/dashboard/products/edit/${id}?error=db`)
  }

  redirect('/admin/dashboard/products?success=1')
}

// Toggle the "featured" flag (shown on the shop page). Multiple products can be featured.
export async function toggleFeatured(id: string, current: boolean) {
  'use server'
  const { error } = await supabaseAdmin.from('products').update({ is_featured: !current }).eq('id', id)
  if (error) console.error('[db] toggleFeatured error:', error)
  revalidatePath('/admin/dashboard/products')
  revalidatePath('/[locale]/shop/handpan', 'page')
}

// Set (or unset) the single product shown as the homepage "Special Offer".
// Only one product can hold this at a time — selecting a new one unsets the previous one.
export async function setHomeFeatured(id: string, makeFeatured: boolean) {
  'use server'
  if (makeFeatured) {
    const { error: clearErr } = await supabaseAdmin
      .from('products')
      .update({ is_home_featured: false })
      .eq('is_home_featured', true)
    if (clearErr) console.error('[db] clear is_home_featured error:', clearErr)

    const { error } = await supabaseAdmin.from('products').update({ is_home_featured: true }).eq('id', id)
    if (error) console.error('[db] setHomeFeatured error:', error)
  } else {
    const { error } = await supabaseAdmin.from('products').update({ is_home_featured: false }).eq('id', id)
    if (error) console.error('[db] unsetHomeFeatured error:', error)
  }
  revalidatePath('/admin/dashboard/products')
  revalidatePath('/[locale]', 'page')
}

// Swap display_order with the neighboring product (direction: -1 = move up/earlier, 1 = move down/later)
export async function reorderProduct(id: string, category: string, direction: -1 | 1) {
  'use server'
  const { data: siblings, error } = await supabaseAdmin
    .from('products')
    .select('id, display_order')
    .eq('category', category)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true })
    .order('id', { ascending: true })

  if (error || !siblings) {
    console.error('[db] reorderProduct fetch error:', error)
    return
  }

  const index = siblings.findIndex((p) => p.id === id)
  const targetIndex = index + direction
  if (index === -1 || targetIndex < 0 || targetIndex >= siblings.length) return

  const current = siblings[index]
  const target = siblings[targetIndex]

  await supabaseAdmin.from('products').update({ display_order: target.display_order }).eq('id', current.id)
  await supabaseAdmin.from('products').update({ display_order: current.display_order }).eq('id', target.id)

  revalidatePath('/admin/dashboard/products')
  revalidatePath('/[locale]', 'page')
}

export async function deleteProductImage(imageId: string, imageUrl: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const storagePath = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : null

  if (storagePath) {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([storagePath])
    if (error) console.error('[storage] delete error:', error)
  }

  const { error: dbErr } = await supabaseAdmin.from('product_images').delete().eq('id', imageId)
  if (dbErr) console.error('[db] delete product_images error:', dbErr)
}

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
  const price_fa_raw = formData.get('price_fa') as string
  const price_fa = price_fa_raw && price_fa_raw.trim() !== '' ? parseInt(price_fa_raw.trim(), 10) : null
  const price_installment_raw = formData.get('price_installment') as string
  const price_installment = price_installment_raw && price_installment_raw.trim() !== '' ? parseFloat(price_installment_raw.trim()) : null
  const price_installment_fa_raw = formData.get('price_installment_fa') as string
  const price_installment_fa = price_installment_fa_raw && price_installment_fa_raw.trim() !== '' ? parseInt(price_installment_fa_raw.trim(), 10) : null
  const is_featured = formData.get('is_featured') === 'true'
  const images = formData.getAll('images') as File[]

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({ name_en, name_fa, slug, scale, notes, price, price_fa, price_installment, price_installment_fa, description_en, description_fa, note_arrangement, in_stock, is_featured })
    .select()
    .single()

  if (error || !product) {
    console.error('[db] createProduct error:', error)
    redirect('/admin/dashboard/products/new?error=db')
  }

  const validImages = images.filter((f) => f && f.size > 0)
  if (validImages.length > 0) {
    await ensureBucket()
    for (let i = 0; i < validImages.length; i++) {
      const publicUrl = await uploadImage(validImages[i], slug)
      if (!publicUrl) continue
      const { error: insertErr } = await supabaseAdmin.from('product_images').insert({
        product_id: product.id,
        url: publicUrl,
        order: i,
      })
      if (insertErr) console.error('[db] insert product_images error:', insertErr)
    }
  }

  redirect('/admin/dashboard/products?success=1')
}
