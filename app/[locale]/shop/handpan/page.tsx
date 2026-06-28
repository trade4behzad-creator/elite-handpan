import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../i18n'
import type { Dictionary } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type Product = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  scale: string
  notes: number
  price: number
  price_fa: number | null
  in_stock: boolean
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-[4px] p-6">
          <div className="aspect-square bg-gray-100 rounded-sm mb-5" />
          <div className="h-5 bg-gray-100 rounded mb-2 w-3/4" />
          <div className="h-3 bg-gray-100 rounded mb-4 w-1/2" />
          <div className="h-3 bg-gray-100 rounded w-1/4" />
        </div>
      ))}
    </div>
  )
}

async function ProductList({ locale, dict }: { locale: string; dict: Dictionary }) {
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, name_en, name_fa, slug, scale, notes, price, price_fa, in_stock')
    .order('created_at', { ascending: true })

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg mb-2">No products available yet</p>
        <p className="text-sm">Check back soon</p>
      </div>
    )
  }

  // Fetch first image per product (separate query — no FK join needed)
  const productIds = products.map((p) => p.id)
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(products as Product[]).map((product) => {
        const name = locale === 'fa' && product.name_fa ? product.name_fa : product.name_en
        const img = firstImageMap.get(product.id)
        return (
          <Link
            key={product.id}
            href={`/${locale}/shop/handpan/${product.slug}`}
            className="group block bg-white border border-gray-200 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden p-6"
          >
            <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center rounded-sm overflow-hidden mb-5 p-4">
              {img ? (
                <img src={img} alt={name} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 64 64" aria-hidden="true">
                  <ellipse cx="32" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              )}
            </div>
            <h3
              className="text-lg md:text-xl text-[#111111] font-semibold mb-1"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {name}
            </h3>
            <p
              className="text-gray-500 text-xs tracking-wider mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {product.scale} · {product.notes} {dict.products.notes}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[#C9A84C] text-sm font-medium">
                {locale === 'fa' && product.price_fa
                  ? `${Number(product.price_fa).toLocaleString('en-US')} تومان`
                  : `$${Number(product.price).toLocaleString()}`}
              </span>
              <span className="text-xs tracking-[0.2em] text-gray-400 group-hover:text-[#C9A84C] transition-colors uppercase border border-gray-200 group-hover:border-[#C9A84C]/60 px-3 py-1.5 rounded-[2px]">
                {dict.products.cta}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default async function ShopHandpanPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main className="min-h-screen bg-white pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Collection
            </p>
            <h1
              className="text-5xl md:text-6xl font-light text-[#111111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Handpan
            </h1>
            <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
          </div>
          <Suspense fallback={<ProductsSkeleton />}>
            <ProductList locale={locale} dict={dict} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
