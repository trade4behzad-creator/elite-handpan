import type { Dictionary } from '../i18n'
import { supabaseAdmin } from '../../lib/supabase-admin'
import ProductsGrid from './ProductsGrid'
import type { GridProduct } from './ProductsGrid'

type RawProduct = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  scale: string
  notes: number
  price: number
}

export default async function ProductsSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  const { data: rawProducts } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, slug, scale, notes, price')
    .order('created_at', { ascending: true })
    .limit(6)

  const productIds = (rawProducts ?? []).map((p) => p.id)

  const { data: imageRows } = await supabaseAdmin
    .from('product_images')
    .select('product_id, url')
    .in('product_id', productIds)
    .order('sort_order', { ascending: true })

  const firstImageMap = new Map<string, string>()
  for (const row of imageRows ?? []) {
    if (!firstImageMap.has(row.product_id)) {
      firstImageMap.set(row.product_id, row.url)
    }
  }

  const products: GridProduct[] = ((rawProducts ?? []) as RawProduct[]).map((p) => ({
    id: p.id,
    name_en: p.name_en,
    name_fa: p.name_fa,
    slug: p.slug,
    scale: p.scale,
    notes: p.notes,
    price: p.price,
    firstImageUrl: firstImageMap.get(p.id) ?? null,
  }))

  return (
    <section
      id="products"
      className="bg-white py-20 px-8"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section heading — keep the motion animation here as a client island */}
        <div className="mb-16">
          <p
            className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {locale === 'fa' ? 'کلکسیون' : 'Collection'}
          </p>
          <h2
            className="text-5xl md:text-6xl font-light text-[#111111]"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.products.heading}
          </h2>
          <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
        </div>

        <ProductsGrid products={products} dict={dict} locale={locale} />
      </div>
    </section>
  )
}
