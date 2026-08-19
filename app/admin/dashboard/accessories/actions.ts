'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

const BUCKET = 'accessory-images'

async function ensureBucket() {
  const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()
  if (error) {
    console.error('[storage] listBuckets error:', error)
    return
  }
  if (!buckets?.find((b) => b.name === BUCKET)) {
    const { error: createErr } = await supabaseAdmin.storage.createBucket(BUCKET, { public: true })
    if (createErr) console.error('[storage] createBucket error:', createErr)
  }
}

async function uploadImage(file: File, slug: string): Promise<string | null> {
  const path = `accessories/${slug}/${Date.now()}-${file.name}`
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

export async function saveAccessoryImageRecord(accessoryId: string, url: string, order: number) {
  const { error } = await supabaseAdmin.from('accessory_images').insert({
    accessory_id: accessoryId,
    url,
    order,
  })
  if (error) console.error('[db] saveAccessoryImageRecord error:', error)
}

export async function deleteAccessoryImage(imageId: string, imageUrl: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const storagePath = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : null

  if (storagePath) {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([storagePath])
    if (error) console.error('[storage] delete error:', error)
  }

  const { error: dbErr } = await supabaseAdmin.from('accessory_images').delete().eq('id', imageId)
  if (dbErr) console.error('[db] delete accessory_images error:', dbErr)
}

export async function createAccessory(formData: FormData) {
  const name_en = (formData.get('name_en') as string).trim()
  const name_fa = (formData.get('name_fa') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const category = (formData.get('category') as string).trim()
  const price = parseFloat(formData.get('price') as string)
  const price_fa_raw = formData.get('price_fa') as string
  const price_fa = price_fa_raw && price_fa_raw.trim() !== '' ? parseInt(price_fa_raw.trim(), 10) : null
  const description_en = (formData.get('description_en') as string).trim()
  const description_fa = (formData.get('description_fa') as string).trim()
  const in_stock = formData.get('in_stock') === 'true'
  const is_featured = formData.get('is_featured') === 'true'
  const images = formData.getAll('images') as File[]

  const { data: accessory, error } = await supabaseAdmin
    .from('accessories')
    .insert({ name_en, name_fa, slug, category, price, price_fa, description_en, description_fa, in_stock, is_featured })
    .select()
    .single()

  if (error || !accessory) {
    console.error('[db] createAccessory error:', error)
    redirect('/admin/dashboard/accessories/new?error=db')
  }

  const validImages = images.filter((f) => f && f.size > 0)
  if (validImages.length > 0) {
    await ensureBucket()
    for (let i = 0; i < validImages.length; i++) {
      const publicUrl = await uploadImage(validImages[i], slug)
      if (!publicUrl) continue
      const { error: insertErr } = await supabaseAdmin.from('accessory_images').insert({
        accessory_id: accessory.id,
        url: publicUrl,
        order: i,
      })
      if (insertErr) console.error('[db] insert accessory_images error:', insertErr)
    }
  }

  redirect('/admin/dashboard/accessories?success=1')
}

export async function updateAccessory(formData: FormData) {
  const id = formData.get('id') as string
  const name_en = (formData.get('name_en') as string).trim()
  const name_fa = (formData.get('name_fa') as string).trim()
  const slug = (formData.get('slug') as string).trim()
  const category = (formData.get('category') as string).trim()
  const price = parseFloat(formData.get('price') as string)
  const price_fa_raw = formData.get('price_fa') as string
  const price_fa = price_fa_raw && price_fa_raw.trim() !== '' ? parseInt(price_fa_raw.trim(), 10) : null
  const description_en = (formData.get('description_en') as string).trim()
  const description_fa = (formData.get('description_fa') as string).trim()
  const in_stock = formData.get('in_stock') === 'true'
  const is_featured = formData.get('is_featured') === 'true'

  const { error } = await supabaseAdmin
    .from('accessories')
    .update({ name_en, name_fa, slug, category, price, price_fa, description_en, description_fa, in_stock, is_featured })
    .eq('id', id)

  if (error) {
    console.error('[db] updateAccessory error:', error)
    redirect(`/admin/dashboard/accessories/edit/${id}?error=db`)
  }

  redirect('/admin/dashboard/accessories?success=1')
}

export async function toggleAccessoryFeatured(id: string, current: boolean) {
  'use server'
  const { error } = await supabaseAdmin.from('accessories').update({ is_featured: !current }).eq('id', id)
  if (error) console.error('[db] toggleAccessoryFeatured error:', error)
  revalidatePath('/admin/dashboard/accessories')
  revalidatePath('/[locale]/shop/accessory', 'page')
}
