'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const items = [
  { slug: '1', name: 'Elite Solstice',  description: 'D Minor · 9 Notes',   image: '/images/portfolio/p1.jpg' },
  { slug: '2', name: 'Elite Aurora',    description: 'F# Major · 8 Notes',  image: '/images/portfolio/p2.jpg' },
  { slug: '3', name: 'Elite Eclipse',   description: 'C# Minor · 10 Notes', image: '/images/portfolio/p3.jpg' },
  { slug: '4', name: 'Elite Zenith',    description: 'E Minor · 9 Notes',   image: '/images/portfolio/p4.jpg' },
  { slug: '5', name: 'Elite Nocturne',  description: 'A Minor · 9 Notes',   image: '/images/portfolio/p5.jpg' },
  { slug: '6', name: 'Elite Equinox',   description: 'G Major · 8 Notes',   image: '/images/portfolio/p6.jpg' },
]

export default function PortfolioSection() {
  return (
    <section
      className="bg-white py-24 px-4 md:px-8 lg:px-16"
      style={{ position: 'relative', zIndex: 10 }}
    >
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <h2
          className="text-5xl md:text-6xl font-light text-[#111111]"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Our Work
        </h2>
        <div className="mt-4 h-px w-12 bg-[#C9A84C] mx-auto opacity-60" />
      </motion.div>

      {/* Grid: 3 cols × 2 rows */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <motion.div
            key={item.slug}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
          >
            <Link href={`/en/portfolio/${item.slug}`} className="group block">
              {/* Square image */}
              <div className="overflow-hidden aspect-square bg-gray-100 mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              {/* Caption */}
              <div className="transition-all duration-300 group-hover:drop-shadow-sm">
                <p
                  className="text-[#111111] font-semibold text-base mb-0.5"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {item.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
