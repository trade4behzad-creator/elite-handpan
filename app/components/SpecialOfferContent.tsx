'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Dictionary } from '../i18n'

export type SpecialOfferProduct = {
  name_en: string
  name_fa: string | null
  slug: string
  scale: string
  notes: number
  price: number
  price_fa: number | null
  description_en: string | null
  description_fa: string | null
  imageUrl: string | null
}

export default function SpecialOfferContent({
  product,
  dict,
  locale,
}: {
  product: SpecialOfferProduct
  dict: Dictionary
  locale: string
}) {
  const name = locale === 'fa' && product.name_fa ? product.name_fa : product.name_en
  const description = locale === 'fa' ? product.description_fa : product.description_en
  const price =
    locale === 'fa' && product.price_fa
      ? `${Number(product.price_fa).toLocaleString('en-US')} تومان`
      : `$${Number(product.price).toLocaleString()}`

  return (
    <section
      className="bg-white py-24 px-4 md:px-8 lg:px-16"
      style={{ position: 'relative', zIndex: 10 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        {/* LEFT: text — order-2 on mobile so image shows first */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-2 md:order-1 flex flex-col gap-6"
        >
          <h2
            className="text-5xl md:text-6xl font-light text-[#111111] leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.specialOffer.eyebrow}
          </h2>
          <p
            className="text-[#3F3E7A] tracking-widest text-sm uppercase -mt-2"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {name}
          </p>
          <p
            className="text-gray-500 text-xs tracking-wider"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {product.scale} · {product.notes} {dict.products.notes}
          </p>
          {description && (
            <p
              className="text-gray-600 text-base leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {description}
            </p>
          )}
          <span className="text-[#3F3E7A] text-lg font-medium">{price}</span>
          <Link
            href={`/${locale}/shop/handpan/${product.slug}`}
            className="self-start border border-[#3F3E7A] text-[#3F3E7A] text-sm tracking-wider px-6 py-3 transition-all duration-300 hover:bg-[#3F3E7A] hover:text-white"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            {dict.specialOffer.cta}
          </Link>
        </motion.div>

        {/* RIGHT: image with radial glow — order-1 on mobile */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="order-1 md:order-2 relative flex items-center justify-center"
        >
          {/* Warm gold halo behind image */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(201,168,76,0.28) 0%, rgba(201,168,76,0.08) 45%, transparent 70%)',
            }}
          />
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={name}
              className="relative w-full max-w-md object-cover rounded-sm"
              style={{ aspectRatio: '4/5' }}
            />
          ) : (
            <div
              className="relative w-full max-w-md bg-[#f5f5f5] rounded-sm flex items-center justify-center"
              style={{ aspectRatio: '4/5' }}
            >
              <svg className="w-20 h-20 text-gray-200" fill="none" viewBox="0 0 64 64" aria-hidden="true">
                <ellipse cx="32" cy="32" rx="28" ry="16" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="6" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
