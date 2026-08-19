'use server'

import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

export async function translateFaqText(text: string): Promise<string | null> {
  const trimmed = text.trim()
  if (!trimmed) return null
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=fa|en`,
      { cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    const translated = data?.responseData?.translatedText
    return typeof translated === 'string' && translated.trim() ? translated.trim() : null
  } catch (err) {
    console.error('[translate] error:', err)
    return null
  }
}

export async function createFaq(formData: FormData) {
  const question_en = (formData.get('question_en') as string).trim()
  const question_fa = (formData.get('question_fa') as string).trim()
  const answer_en = (formData.get('answer_en') as string).trim()
  const answer_fa = (formData.get('answer_fa') as string).trim()

  const { data: maxRow } = await supabaseAdmin
    .from('faqs')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()

  const nextOrder = (maxRow?.sort_order ?? -1) + 1

  const { error } = await supabaseAdmin.from('faqs').insert({
    question_en,
    question_fa: question_fa || null,
    answer_en,
    answer_fa: answer_fa || null,
    sort_order: nextOrder,
  })

  if (error) console.error('[db] createFaq error:', error)
  revalidatePath('/admin/dashboard/faq')
  revalidatePath('/[locale]/faq', 'page')
}

export async function updateFaq(formData: FormData) {
  const id = formData.get('id') as string
  const question_en = (formData.get('question_en') as string).trim()
  const question_fa = (formData.get('question_fa') as string).trim()
  const answer_en = (formData.get('answer_en') as string).trim()
  const answer_fa = (formData.get('answer_fa') as string).trim()

  const { error } = await supabaseAdmin
    .from('faqs')
    .update({
      question_en,
      question_fa: question_fa || null,
      answer_en,
      answer_fa: answer_fa || null,
    })
    .eq('id', id)

  if (error) console.error('[db] updateFaq error:', error)
  revalidatePath('/admin/dashboard/faq')
  revalidatePath('/[locale]/faq', 'page')
}

export async function deleteFaq(formData: FormData) {
  const id = formData.get('id') as string
  const { error } = await supabaseAdmin.from('faqs').delete().eq('id', id)
  if (error) console.error('[db] deleteFaq error:', error)
  revalidatePath('/admin/dashboard/faq')
  revalidatePath('/[locale]/faq', 'page')
}

export async function reorderFaq(id: string, direction: -1 | 1) {
  'use server'
  const { data: all, error } = await supabaseAdmin
    .from('faqs')
    .select('id, sort_order')
    .order('sort_order', { ascending: true })

  if (error || !all) {
    console.error('[db] reorderFaq fetch error:', error)
    return
  }

  const index = all.findIndex((f) => f.id === id)
  const targetIndex = index + direction
  if (index === -1 || targetIndex < 0 || targetIndex >= all.length) return

  const current = all[index]
  const target = all[targetIndex]

  await supabaseAdmin.from('faqs').update({ sort_order: target.sort_order }).eq('id', current.id)
  await supabaseAdmin.from('faqs').update({ sort_order: current.sort_order }).eq('id', target.id)

  revalidatePath('/admin/dashboard/faq')
  revalidatePath('/[locale]/faq', 'page')
}
