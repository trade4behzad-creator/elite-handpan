import { supabaseAdmin } from './supabase-admin'

export type ProductFeature = { title: string; body: string }

export async function getProductFeatures(locale: string): Promise<ProductFeature[]> {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select(
      'feature1_title_en, feature1_title_fa, feature1_body_en, feature1_body_fa, feature2_title_en, feature2_title_fa, feature2_body_en, feature2_body_fa, feature3_title_en, feature3_title_fa, feature3_body_en, feature3_body_fa'
    )
    .eq('id', 1)
    .maybeSingle()

  if (!data) return []

  const isFa = locale === 'fa'
  const raw = [
    { title: isFa ? data.feature1_title_fa : data.feature1_title_en, body: isFa ? data.feature1_body_fa : data.feature1_body_en },
    { title: isFa ? data.feature2_title_fa : data.feature2_title_en, body: isFa ? data.feature2_body_fa : data.feature2_body_en },
    { title: isFa ? data.feature3_title_fa : data.feature3_title_en, body: isFa ? data.feature3_body_fa : data.feature3_body_en },
  ]

  // Hide any block whose title or body is empty for the current locale
  return raw.filter((f): f is ProductFeature => Boolean(f.title?.trim() && f.body?.trim()))
}
