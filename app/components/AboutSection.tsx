import type { Dictionary } from '../i18n'
import { supabaseAdmin } from '../../lib/supabase-admin'
import SpecialOfferContent from './SpecialOfferContent'
import type { SpecialOfferProduct } from './SpecialOfferContent'

// Homepage "Special Offer" section — shows the single product the admin
// has marked as `is_home_featured` in the products dashboard.
// Renders nothing if no product is currently selected.
export default async function AboutSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .select('name_en, name_fa, slug, scale, notes, price, price_fa, description_en, description_fa, product_images(url, sort_order)')
    .eq('is_home_featured', true)
    .maybeSingle()

  if (error) console.error('AboutSection (special offer) error:', error)
  if (!product) return null

  const imageUrl =
    (product.product_images as { url: string; sort_order: number }[] | null)
      ?.sort((a, b) => a.sort_order - b.sort_order)?.[0]?.url ?? null

  const offerProduct: SpecialOfferProduct = {
    name_en: product.name_en,
    name_fa: product.name_fa,
    slug: product.slug,
    scale: product.scale,
    notes: product.notes,
    price: product.price,
    price_fa: product.price_fa,
    description_en: product.description_en,
    description_fa: product.description_fa,
    imageUrl,
  }

  return <SpecialOfferContent product={offerProduct} dict={dict} locale={locale} />
}
