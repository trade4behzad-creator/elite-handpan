import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../i18n'
import type { Dictionary } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import ShopFilters from '../../../components/ShopFilters'
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
  is_featured: boolean
  product_images: { url: string; sort_order: number }[] | null
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

async function ProductList({
  locale,
  dict,
  scale,
  notes,
  featured,
  sort,
}: {
  locale: string
  dict: Dictionary
  scale?: string
  notes?: string
  featured?: string
  sort?: string
}) {
  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      product_images (
        url,
        sort_order
      )
    `)
    .eq('category', 'handpan')

  if (scale) query = query.eq('scale', scale)
  if (notes) query = query.eq('notes', Number(notes))
  if (featured === '1') query = query.eq('is_featured', true)

  if (sort === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (sort === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('display_order', { ascending: true }).order('created_at', { ascending: true })
  }

  const { data: products } = await query

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg mb-2">{locale === 'fa' ? 'موردی یافت نشد' : 'No products match these filters'}</p>
        <p className="text-sm">{locale === 'fa' ? 'فیلترها را تغییر دهید' : 'Try adjusting your filters'}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(products as Product[]).map((product) => {
        const name = locale === 'fa' && product.name_fa ? product.name_fa : product.name_en
        const firstImage = product.product_images
          ?.sort((a: { url: string; sort_order: number }, b: { url: string; sort_order: number }) => a.sort_order - b.sort_order)[0]?.url
          || '/images/shop/handpan/p1/img1.jpg'
        return (
          <Link
            key={product.id}
            href={`/${locale}/shop/handpan/${product.slug}`}
            className="group relative block bg-white border border-gray-200 hover:border-[#3F3E7A]/60 transition-all duration-300 rounded-[4px] overflow-hidden p-6"
          >
            {product.is_featured && (
              <span
                className="absolute top-3 z-10 text-[10px] tracking-[0.15em] uppercase px-3 py-1 rounded-full text-white"
                style={{ background: '#3F3E7A', insetInlineStart: '12px' }}
              >
                {locale === 'fa' ? 'پیشنهاد ویژه' : 'Featured'}
              </span>
            )}
            <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center rounded-sm overflow-hidden mb-5 p-4">
              <img src={firstImage} alt={name} className="w-full h-full object-contain mix-blend-multiply" />
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
            <div className="flex items-center">
              <span className="text-[#3F3E7A] text-sm font-medium">
                {locale === 'fa' && product.price_fa
                  ? `${Number(product.price_fa).toLocaleString('en-US')} تومان`
                  : `$${Number(product.price).toLocaleString()}`}
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
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ scale?: string; notes?: string; featured?: string; sort?: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locale)) notFound()
  const dict = await getDictionary(locale as 'en' | 'fa')
  const { scale, notes, featured, sort } = await searchParams

  const { data: allHandpans } = await supabaseAdmin
    .from('products')
    .select('scale, notes')
    .eq('category', 'handpan')

  const scales = Array.from(new Set((allHandpans ?? []).map((p) => p.scale))).sort()
  const noteCounts = Array.from(new Set((allHandpans ?? []).map((p) => p.notes))).sort((a, b) => a - b)

  const filterLabels = {
    scaleLabel: locale === 'fa' ? 'گام (Scale)' : 'Scale',
    notesLabel: locale === 'fa' ? 'تعداد نت' : 'Note count',
    featuredLabel: locale === 'fa' ? 'پیشنهاد ویژه' : 'Featured',
    sortLabel: locale === 'fa' ? 'مرتب‌سازی' : 'Sort',
    allOption: locale === 'fa' ? 'همه' : 'All',
    sortPriceAsc: locale === 'fa' ? 'قیمت: کم به زیاد' : 'Price: Low to High',
    sortPriceDesc: locale === 'fa' ? 'قیمت: زیاد به کم' : 'Price: High to Low',
    clearLabel: locale === 'fa' ? 'پاک کردن فیلترها' : 'Clear filters',
    filtersTitle: locale === 'fa' ? 'فیلتر و مرتب‌سازی' : 'Filter & Sort',
    sortRecommendedOption: locale === 'fa' ? 'پیشنهادی' : 'Recommended',
  }

  return (
    <>
      <Navbar dict={dict} locale={locale} />
      <main className="min-h-screen bg-white pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p
              className="text-[#3F3E7A] text-xs tracking-[0.4em] uppercase mb-4"
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
            <div className="mt-6 h-px w-16 bg-[#3F3E7A] opacity-60" />
          </div>
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="w-full md:w-64 flex-shrink-0">
              <Suspense fallback={null}>
                <ShopFilters scales={scales} noteCounts={noteCounts} labels={filterLabels} />
              </Suspense>
            </div>
            <div className="flex-1 min-w-0">
              <Suspense fallback={<ProductsSkeleton />}>
                <ProductList locale={locale} dict={dict} scale={scale} notes={notes} featured={featured} sort={sort} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={locale} />
    </>
  )
}
