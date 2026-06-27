'use client'

import { motion } from 'framer-motion'
import type { Dictionary } from '../i18n'

const products = [
  { id: 1, name: 'Elite Solstice',  scale: 'D Minor',   notes: 9,  price: '$1,400', image: '/images/portfolio/p1.jpg' },
  { id: 2, name: 'Elite Aurora',    scale: 'F# Major',  notes: 8,  price: '$1,250', image: '/images/portfolio/p2.jpg' },
  { id: 3, name: 'Elite Eclipse',   scale: 'C# Minor',  notes: 10, price: '$1,600', image: '/images/portfolio/p3.jpg' },
  { id: 4, name: 'Elite Zenith',    scale: 'E Minor',   notes: 9,  price: '$1,350', image: '/images/portfolio/p4.jpg' },
  { id: 5, name: 'Elite Nocturne',  scale: 'A Minor',   notes: 9,  price: '$1,500', image: '/images/portfolio/p5.jpg' },
  { id: 6, name: 'Elite Equinox',   scale: 'G Major',   notes: 8,  price: '$1,200', image: '/images/portfolio/p6.jpg' },
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
      className="bg-white py-28 px-4 md:px-8 lg:px-16"
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
          className="text-5xl md:text-6xl font-light text-[#111111]"
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
    <div className="group bg-white border border-gray-200 hover:border-[#C9A84C]/60 transition-all duration-300 rounded-[4px] overflow-hidden cursor-pointer">
      {/* Real image */}
      <div className="aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Card content */}
      <div className="p-3 md:p-6">
        <h3
          className="text-lg md:text-xl text-[#111111] font-semibold mb-1"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          {product.name}
        </h3>
        <p
          className="text-gray-500 text-xs tracking-wider mb-4"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {product.scale} · {product.notes} {dict.products.notes}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[#C9A84C] text-sm font-medium">
            {product.price}
          </span>
          <button className="text-xs tracking-[0.2em] text-gray-400 hover:text-[#C9A84C] transition-colors uppercase border border-gray-200 hover:border-[#C9A84C]/60 px-3 py-1.5 rounded-[2px] self-start sm:self-auto">
            {dict.products.cta}
          </button>
        </div>
      </div>
    </div>
  )
}
