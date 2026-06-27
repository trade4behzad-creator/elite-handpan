'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function AboutSection({ locale }: { locale: string }) {
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
          <p
            className="text-[#C9A84C] tracking-widest text-xs uppercase"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            OUR STORY
          </p>
          <h2
            className="text-4xl font-light text-[#111111] leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            Crafted from the Heart of Metal
          </h2>
          <p
            className="text-gray-600 text-base leading-relaxed"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Each Elite handpan begins as raw steel and is shaped by hand over weeks
            of precise craftsmanship. We forge instruments that don&apos;t just
            sound — they resonate.
          </p>
          <Link
            href={`/${locale}/about`}
            className="self-start border border-[#C9A84C] text-[#C9A84C] text-sm tracking-wider px-6 py-3 transition-all duration-300 hover:bg-[#C9A84C] hover:text-white"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Discover Our Story
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
          <img
            src="/images/about.jpg"
            alt="Elite Handpan craftsmanship"
            className="relative w-full max-w-md object-cover rounded-sm"
            style={{ aspectRatio: '4/5' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
