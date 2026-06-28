import type { Dictionary } from '../i18n'
import { supabaseAdmin } from '../../lib/supabase-admin'
import ProductsGrid from './ProductsGrid'
import type { GridProduct } from './ProductsGrid'

export default async function ProductsSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, slug, scale, notes, price, price_fa, in_stock, product_images(id, url, sort_order)')
    .eq('category', 'handpan')
    .order('created_at')
    .limit(6)

  console.log('ProductsSection products:', JSON.stringify(products, null, 2))
  if (error) console.error('ProductsSection error:', error)

  const gridProducts: GridProduct[] = (products ?? []).map((p: any) => {
    const imageUrl = (p.product_images as any[])
      ?.sort((a: any, b: any) => a.sort_order - b.sort_order)?.[0]?.url
      ?? null
    return {
      id: p.id,
      name_en: p.name_en,
      name_fa: p.name_fa,
      slug: p.slug,
      scale: p.scale,
      notes: p.notes,
      price: p.price,
      firstImageUrl: imageUrl,
    }
  })

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

        <ProductsGrid products={gridProducts} dict={dict} locale={locale} />
      </div>
    </section>
  )
}
