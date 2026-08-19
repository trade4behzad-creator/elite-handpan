'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Dictionary } from '../../../../i18n'
import { useCart } from '../../../../context/CartContext'

type Product = {
  id: string
  slug: string
  name_en: string
  name_fa: string | null
  scale: string
  notes: number
  price: number
  price_fa: number | null
  price_installment: number | null
  price_installment_fa: number | null
  description_en: string | null
  description_fa: string | null
  note_arrangement: string | null
  in_stock: boolean
}

function ImagePlaceholder() {
  return (
    <svg className="w-24 h-24 text-gray-200" fill="none" viewBox="0 0 64 64" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export default function ProductDetail({
  product,
  images,
  locale,
  dict,
  features,
}: {
  product: Product
  images: string[]
  locale: string
  dict: Dictionary
  features: { title: string; body: string }[]
}) {
  const [activeImage, setActiveImage] = useState(0)
  const { addItem } = useCart()
  const router = useRouter()

  function handleInquire() {
    addItem({
      id: product.id,
      category: 'handpan',
      slug: product.slug,
      name_en: product.name_en,
      name_fa: product.name_fa,
      image: images[0] ?? null,
      price: product.price,
      price_fa: product.price_fa,
      price_installment: product.price_installment,
      price_installment_fa: product.price_installment_fa,
    })
    router.push(`/${locale}/cart`)
  }

  const name = locale === 'fa' && product.name_fa ? product.name_fa : product.name_en
  const description =
    locale === 'fa' && product.description_fa
      ? product.description_fa
      : product.description_en ?? ''

  const specs: Record<string, string> = {
    'Total Notes': String(product.notes),
    'Scale': product.scale,
    'Availability': product.in_stock ? 'In Stock' : 'Made to Order',
  }
  if (product.note_arrangement) specs['Note Arrangement'] = product.note_arrangement

  return (
    <>
      <main className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-8 pt-32 pb-0">
          <p className="text-xs text-gray-400 tracking-wide" style={{ fontFamily: 'var(--font-inter)' }}>
            <Link href={`/${locale}/shop`} className="hover:text-[#3F3E7A] transition-colors">Shop</Link>
            {' › '}
            <Link href={`/${locale}/shop/handpan`} className="hover:text-[#3F3E7A] transition-colors">Handpan</Link>
            {' › '}
            <span className="text-gray-600">{name}</span>
          </p>
        </div>

        {/* Two-column layout */}
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Image gallery */}
          <div>
            <div className="aspect-square bg-[#f5f5f5] rounded-sm overflow-hidden flex items-center justify-center p-6 mb-4">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square bg-[#f5f5f5] rounded-sm overflow-hidden flex items-center justify-center p-3 border-2 transition-colors ${
                      activeImage === i ? 'border-[#3F3E7A]' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${name} view ${i + 1}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <p
              className="text-[#3F3E7A] text-xs tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {product.scale}
            </p>
            <h1
              className="text-4xl md:text-5xl font-light text-[#111111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {name}
            </h1>
            <div className="w-12 h-px bg-[#3F3E7A] my-6" />
            {description && (
              <p className="text-gray-600 leading-relaxed mb-6" style={{ fontFamily: 'var(--font-inter)' }}>
                {description}
              </p>
            )}
            <p
              className="text-3xl font-medium mb-6"
              style={{ color: '#3F3E7A', fontFamily: 'var(--font-cormorant)' }}
            >
              {locale === 'fa' && product.price_fa
                ? `${Number(product.price_fa).toLocaleString('en-US')} تومان`
                : `$${Number(product.price).toLocaleString()}`}
            </p>

            {/* Note arrangement badges */}
            {product.note_arrangement && (
              <div className="mb-8">
                <p
                  className="text-xs text-gray-400 uppercase tracking-widest mb-3"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Note Arrangement
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.note_arrangement.split(', ').map((note) => (
                    <span
                      key={note}
                      className="bg-[#f5f5f5] text-[#333] text-xs font-mono px-2.5 py-1 rounded"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleInquire}
              className="w-full bg-[#3F3E7A] hover:opacity-90 text-white text-sm tracking-widest uppercase py-4 text-center transition-opacity font-medium"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {dict.products.addToCart}
            </button>
          </div>
        </div>

        {/* Specs table */}
        <div className="max-w-6xl mx-auto px-8 pb-16">
          <h2
            className="text-2xl font-light text-[#111111] mb-3"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Specifications
          </h2>
          <div className="w-12 h-px bg-[#3F3E7A] mb-6" />
          <div className="border border-gray-100 rounded-sm overflow-hidden">
            {Object.entries(specs).map(([key, value], i) => (
              <div key={key} className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="px-5 py-3 text-sm text-gray-500 border-r border-gray-100" style={{ fontFamily: 'var(--font-inter)' }}>
                  {key}
                </div>
                <div className="px-5 py-3 text-sm text-[#111111]" style={{ fontFamily: 'var(--font-inter)' }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features row */}
      {features.length > 0 && (
        <section className="bg-[#f9f9f9] py-16 px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white p-8 rounded-sm border border-gray-100">
                <p className="text-[#3F3E7A] text-xl mb-4">✦</p>
                <h3 className="text-lg font-semibold text-[#111111] mb-2" style={{ fontFamily: 'var(--font-cormorant)' }}>
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}