'use server'

import { redirect } from 'next/navigation'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

const BUCKET = 'instagram-images'

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

async function uploadImage(file: File): Promise<string | null> {
  const path = `posts/${Date.now()}-${file.name}`
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

export async function createInstagramPost(formData: FormData) {
  const post_url = (formData.get('post_url') as string).trim()
  const order = parseInt(formData.get('order') as string, 10) || 0
  const image = formData.get('image') as File

  if (!image || image.size === 0) {
    redirect('/admin/dashboard/instagram/new?error=noimage')
  }

  await ensureBucket()
  const publicUrl = await uploadImage(image)

  if (!publicUrl) {
    redirect('/admin/dashboard/instagram/new?error=upload')
  }

  const { error } = await supabaseAdmin.from('instagram_posts').insert({
    post_url,
    image_url: publicUrl,
    order,
  })

  if (error) {
    console.error('[db] createInstagramPost error:', error)
    redirect('/admin/dashboard/instagram/new?error=db')
  }

  redirect('/admin/dashboard/instagram?success=1')
}

export async function deleteInstagramPost(id: string, imageUrl: string) {
  const marker = `/storage/v1/object/public/${BUCKET}/`
  const storagePath = imageUrl.includes(marker) ? imageUrl.split(marker)[1] : null

  if (storagePath) {
    const { error } = await supabaseAdmin.storage.from(BUCKET).remove([storagePath])
    if (error) console.error('[storage] delete error:', error)
  }

  const { error: dbErr } = await supabaseAdmin.from('instagram_posts').delete().eq('id', id)
  if (dbErr) console.error('[db] delete instagram_posts error:', dbErr)

  redirect('/admin/dashboard/instagram?success=1')
}

export async function updateInstagramPost(formData: FormData) {
  const id = formData.get('id') as string
  const post_url = (formData.get('post_url') as string).trim()
  const order = parseInt(formData.get('order') as string, 10) || 0
  const image = formData.get('image') as File | null

  let image_url: string | undefined

  if (image && image.size > 0) {
    await ensureBucket()
    const publicUrl = await uploadImage(image)
    if (publicUrl) {
      image_url = publicUrl
    }
  }

  const updateData: Record<string, unknown> = { post_url, order }
  if (image_url) updateData.image_url = image_url

  const { error } = await supabaseAdmin
    .from('instagram_posts')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('[db] updateInstagramPost error:', error)
    redirect(`/admin/dashboard/instagram/edit/${id}?error=db`)
  }

  redirect('/admin/dashboard/instagram?success=1')
}