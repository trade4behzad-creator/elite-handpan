'use client'

import { motion } from 'framer-motion'
import type { Dictionary } from '../i18n'

const products = [
  { id: 1, name: 'Elite Solstice', scale: 'D Minor', notes: 9, price: '$1,400' },
  { id: 2, name: 'Elite Aurora', scale: 'F# Major', notes: 8, price: '$1,250' },
  { id: 3, name: 'Elite Eclipse', scale: 'C# Minor', notes: 10, price: '$1,600' },
  { id: 4, name: 'Elite Zenith', scale: 'E Minor', notes: 9, price: '$1,350' },
  { id: 5, name: 'Elite Nocturne', scale: 'A Minor', notes: 9, price: '$1,500' },
  { id: 6, name: 'Elite Equinox', scale: 'G Major', notes: 8, price: '$1,200' },
]

export default function ProductsSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  return (
    <section
      id="products"
      className="bg-[#080808] py-28 px-6 md:px-16"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mb-16"
      >
        <p
          className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {locale === 'fa' ? 'کلکسیون' : 'Collection'}
        </p>
        <h2
          className="text-5xl md:text-6xl font-light text-white"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {dict.products.heading}
        </h2>
        <div className="mt-6 h-px w-16 bg-[#C9A84C] opacity-60" />
      </motion.div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
          >
            <ProductCard product={product} dict={dict} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ProductCard({
  product,
  dict,
}: {
  product: (typeof products)[0]
  dict: Dictionary
}) {
  return (
    <div className="group bg-[#111111] border border-white/5 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden cursor-pointer">
      {/* Placeholder image */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a1a, #2a2a2a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1',
        }}
      >
        <span style={{ color: '#C9A84C', fontSize: '40px' }}>◉</span>
      </div>

      {/* Card content */}
      <div className="p-5">
        <h3
          className="text-lg text-white font-light mb-1"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {product.name}
        </h3>
        <p
          className="text-[#888888] text-xs tracking-wider mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {product.scale} · {product.notes} {dict.products.notes}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#C9A84C] text-sm font-medium">
            {product.price}
          </span>
          <button className="text-xs tracking-[0.2em] text-white/50 hover:text-[#C9A84C] transition-colors uppercase border border-white/10 hover:border-[#C9A84C]/40 px-3 py-1.5 rounded-[2px]">
            {dict.products.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
