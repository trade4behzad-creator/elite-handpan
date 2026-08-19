'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'
import { hashAdminPassword, verifyAdminPassword } from '../../../../lib/adminAuth'

const BUCKET = 'site-assets'

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

async function uploadSettingsImage(file: File, prefix: string): Promise<string | null> {
  await ensureBucket()
  const path = `settings/${prefix}-${Date.now()}-${file.name}`
  const buffer = Buffer.from(await file.arrayBuffer())
  const { data: stored, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: true })
  if (error || !stored) {
    console.error(`[storage] ${prefix} upload error:`, error)
    return null
  }
  const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(stored.path)
  return publicUrl
}

// -------- Contact page info --------
export async function updateContactSettings(formData: FormData) {
  const update = {
    id: 1,
    contact_email: (formData.get('contact_email') as string).trim(),
    contact_phone: (formData.get('contact_phone') as string).trim(),
    contact_address: (formData.get('contact_address') as string).trim(),
    whatsapp_number: (formData.get('whatsapp_number') as string).trim(),
    instagram_url: (formData.get('instagram_url') as string).trim(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin.from('site_settings').upsert(update)
  if (error) {
    console.error('[db] updateContactSettings error:', error)
    redirect('/admin/dashboard/settings/contact?error=db')
  }

  revalidatePath('/admin/dashboard/settings/contact')
  revalidatePath('/[locale]', 'page')
  revalidatePath('/[locale]/contact', 'page')
  redirect('/admin/dashboard/settings/contact?success=1')
}

// -------- Cart / checkout info --------
export async function updateCartSettings(formData: FormData) {
  const update: Record<string, unknown> = {
    id: 1,
    payment_accounts_text: (formData.get('payment_accounts_text') as string).trim(),
    terms_fa: (formData.get('terms_fa') as string).trim(),
    terms_en: (formData.get('terms_en') as string).trim(),
    updated_at: new Date().toISOString(),
  }

  const chequeFile = formData.get('cheque_sample') as File | null
  if (chequeFile && chequeFile.size > 0) {
    const url = await uploadSettingsImage(chequeFile, 'cheque-sample')
    if (url) update.cheque_sample_url = url
  }

  const { error } = await supabaseAdmin.from('site_settings').upsert(update)
  if (error) {
    console.error('[db] updateCartSettings error:', error)
    redirect('/admin/dashboard/settings/cart?error=db')
  }

  revalidatePath('/admin/dashboard/settings/cart')
  revalidatePath('/[locale]/cart', 'page')
  redirect('/admin/dashboard/settings/cart?success=1')
}

// -------- Product-page feature blocks --------
export async function updateFeatureSettings(formData: FormData) {
  const update = {
    id: 1,
    feature1_title_en: (formData.get('feature1_title_en') as string).trim(),
    feature1_title_fa: (formData.get('feature1_title_fa') as string).trim(),
    feature1_body_en: (formData.get('feature1_body_en') as string).trim(),
    feature1_body_fa: (formData.get('feature1_body_fa') as string).trim(),
    feature2_title_en: (formData.get('feature2_title_en') as string).trim(),
    feature2_title_fa: (formData.get('feature2_title_fa') as string).trim(),
    feature2_body_en: (formData.get('feature2_body_en') as string).trim(),
    feature2_body_fa: (formData.get('feature2_body_fa') as string).trim(),
    feature3_title_en: (formData.get('feature3_title_en') as string).trim(),
    feature3_title_fa: (formData.get('feature3_title_fa') as string).trim(),
    feature3_body_en: (formData.get('feature3_body_en') as string).trim(),
    feature3_body_fa: (formData.get('feature3_body_fa') as string).trim(),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabaseAdmin.from('site_settings').upsert(update)
  if (error) {
    console.error('[db] updateFeatureSettings error:', error)
    redirect('/admin/dashboard/settings/features?error=db')
  }

  revalidatePath('/admin/dashboard/settings/features')
  revalidatePath('/[locale]/shop/handpan/[slug]', 'page')
  revalidatePath('/[locale]/shop/accessory/[slug]', 'page')
  redirect('/admin/dashboard/settings/features?success=1')
}

// -------- About page content --------
export async function updateAboutSettings(formData: FormData) {
  const update: Record<string, unknown> = {
    id: 1,
    about_heading_en: (formData.get('about_heading_en') as string).trim(),
    about_heading_fa: (formData.get('about_heading_fa') as string).trim(),
    about_body_en: (formData.get('about_body_en') as string).trim(),
    about_body_fa: (formData.get('about_body_fa') as string).trim(),
    updated_at: new Date().toISOString(),
  }

  const heroFile = formData.get('about_hero_image') as File | null
  if (heroFile && heroFile.size > 0) {
    const url = await uploadSettingsImage(heroFile, 'about-hero')
    if (url) update.about_hero_image_url = url
  }

  const teamFile = formData.get('about_team_image') as File | null
  if (teamFile && teamFile.size > 0) {
    const url = await uploadSettingsImage(teamFile, 'about-team')
    if (url) update.about_team_image_url = url
  }

  const { error } = await supabaseAdmin.from('site_settings').upsert(update)
  if (error) {
    console.error('[db] updateAboutSettings error:', error)
    redirect('/admin/dashboard/settings/about?error=db')
  }

  revalidatePath('/admin/dashboard/settings/about')
  revalidatePath('/[locale]/about', 'page')
  redirect('/admin/dashboard/settings/about?success=1')
}

// -------- Admin panel password --------
export async function changeAdminPassword(formData: FormData) {
  const currentPassword = formData.get('current_password') as string
  const newPassword = formData.get('new_password') as string
  const confirmPassword = formData.get('confirm_password') as string

  if (!newPassword || newPassword.length < 6) {
    redirect('/admin/dashboard/settings?error=password_short#password')
  }
  if (newPassword !== confirmPassword) {
    redirect('/admin/dashboard/settings?error=password_mismatch#password')
  }

  const { data: settings } = await supabaseAdmin
    .from('site_settings')
    .select('admin_password_hash')
    .eq('id', 1)
    .maybeSingle()

  const isCurrentValid = settings?.admin_password_hash
    ? verifyAdminPassword(currentPassword, settings.admin_password_hash)
    : currentPassword === process.env.ADMIN_PASSWORD

  if (!isCurrentValid) {
    redirect('/admin/dashboard/settings?error=password_wrong#password')
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ id: 1, admin_password_hash: hashAdminPassword(newPassword), updated_at: new Date().toISOString() })

  if (error) {
    console.error('[db] changeAdminPassword error:', error)
    redirect('/admin/dashboard/settings?error=db#password')
  }

  redirect('/admin/dashboard/settings?success=password#password')
}
