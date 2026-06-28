import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, hasLocale } from '../../../i18n'
import type { Dictionary } from '../../../i18n'
import Navbar from '../../../components/Navbar'
import Footer from '../../../components/Footer'
import { supabaseAdmin } from '../../../../lib/supabase-admin'

type Accessory = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  category: string | null
  price: number
  price_fa: number | null
  description_en: string | null
  in_stock: boolean
  accessory_images: { url: string }[] | null
}

function AccessoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
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

async function AccessoryList({ locale, dict }: { locale: string; dict: Dictionary }) {
  const { data: accessories } = await supabaseAdmin
    .from('accessories')
    .select('id, name_en, name_fa, slug, category, price, price_fa, description_en, in_stock, accessory_images(url)')
    .order('created_at', { ascending: true })

  if (!accessories || accessories.length === 0) {
    return (
      <div className="text-center py-24 text-gray-400">
        <p className="text-lg mb-2">No accessories available yet</p>
        <p className="text-sm">Check back soon</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {(accessories as Accessory[]).map((item) => {
        const name = locale === 'fa' && item.name_fa ? item.name_fa : item.name_en
        const img = item.accessory_images?.[0]?.url
        return (
          <Link
            key={item.id}
            href={`/${locale}/shop/accessory/${item.slug}`}
            className="group block bg-white border border-gray-200 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden p-6"
          >
            <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center rounded-sm overflow-hidden mb-5 p-4">
              {img ? (
                <img src={img} alt={name} className="w-full h-full object-contain mix-blend-multiply" />
              ) : (
                <svg className="w-16 h-16 text-gray-200" fill="none" viewBox="0 0 64 64" aria-hidden="true">
                  <rect x="16" y="16" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M24 32h16M32 24v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
              {item.category ?? 'Accessory'}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-[#C9A84C] text-sm font-medium">
                {locale === 'fa' && item.price_fa
                  ? `${Number(item.price_fa).toLocaleString('en-US')} تومان`
                  : `$${Number(item.price).toLocaleString()}`}
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

export default async function ShopAccessoryPage({
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
              Accessories
            </h1>
            <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
          </div>
          <Suspense fallback={<AccessoriesSkeleton />}>
            <AccessoryList locale={locale} dict={dict} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
