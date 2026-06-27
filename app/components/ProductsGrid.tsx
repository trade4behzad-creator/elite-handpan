'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Dictionary } from '../i18n'

export type GridProduct = {
  id: string
  name_en: string
  name_fa: string | null
  slug: string
  scale: string
  notes: number
  price: number
  firstImageUrl: string | null
}

export default function ProductsGrid({
  products,
  dict,
  locale,
}: {
  products: GridProduct[]
  dict: Dictionary
  locale: string
}) {
  if (products.length === 0) {
    return (
      <p className="text-center text-gray-400 py-16" style={{ fontFamily: 'var(--font-inter)' }}>
        No products available yet
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => {
        const name = locale === 'fa' && product.name_fa ? product.name_fa : product.name_en
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
          >
            <Link
              href={`/${locale}/shop/handpan/${product.slug}`}
              className="group block bg-white border border-gray-200 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden cursor-pointer p-6"
            >
              <div className="aspect-square bg-[#f5f5f5] flex items-center justify-center rounded-sm overflow-hidden mb-5 p-4">
                {product.firstImageUrl ? (
                  <img
                    src={product.firstImageUrl}
                    alt={name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
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
                  ${Number(product.price).toLocaleString()}
                </span>
                <span className="text-xs tracking-[0.2em] text-gray-400 group-hover:text-[#C9A84C] transition-colors uppercase border border-gray-200 group-hover:border-[#C9A84C]/60 px-3 py-1.5 rounded-[2px]">
                  {dict.products.cta}
                </span>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
