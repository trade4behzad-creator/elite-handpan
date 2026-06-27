'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Dictionary } from '../../../../i18n'

type Accessory = {
  slug: string
  id: number
  name: string
  category: string
  price: string
  description: string
  images: string[]
  specs: Record<string, string>
}

const features = [
  {
    title: 'High Quality',
    body: 'Each instrument is crafted with premium materials and rigorous quality control.',
  },
  {
    title: '2-Year Warranty',
    body: 'All Elite instruments come with a full two-year warranty including retuning service.',
  },
  {
    title: 'Worldwide Shipping',
    body: 'Professional packaging and tracked shipping to anywhere in the world.',
  },
]

export default function AccessoryDetail({
  accessory,
  locale,
  dict,
}: {
  accessory: Accessory
  locale: string
  dict: Dictionary
}) {
  const [activeImage, setActiveImage] = useState(0)

  return (
    <>
      <main className="bg-white">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-8 pt-32 pb-0">
          <p
            className="text-xs text-gray-400 tracking-wide"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <Link href={`/${locale}/shop`} className="hover:text-[#C9A84C] transition-colors">Shop</Link>
            {' › '}
            <Link href={`/${locale}/shop/accessory`} className="hover:text-[#C9A84C] transition-colors">Accessories</Link>
            {' › '}
            <span className="text-gray-600">{accessory.name}</span>
          </p>
        </div>

        {/* Main two-column section */}
        <div className="max-w-6xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Image gallery */}
          <div>
            <div className="aspect-square bg-[#f5f5f5] rounded-sm overflow-hidden flex items-center justify-center p-6 mb-4">
              <img
                src={accessory.images[activeImage]}
                alt={accessory.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {accessory.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square bg-[#f5f5f5] rounded-sm overflow-hidden flex items-center justify-center p-3 border-2 transition-colors ${
                    activeImage === i ? 'border-[#C9A84C]' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${accessory.name} view ${i + 1}`}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Product info */}
          <div className="flex flex-col">
            <p
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {accessory.category}
            </p>
            <h1
              className="text-4xl md:text-5xl font-light text-[#111111]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {accessory.name}
            </h1>
            <div className="w-12 h-px bg-[#C9A84C] my-6" />
            <p
              className="text-gray-600 leading-relaxed mb-6"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {accessory.description}
            </p>
            <p
              className="text-3xl font-medium mb-8"
              style={{ color: '#C9A84C', fontFamily: 'var(--font-cormorant)' }}
            >
              {accessory.price}
            </p>

            {/* Inquire button */}
            <a
              href="https://wa.me/989000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#C9A84C] hover:bg-[#b8943e] text-black text-sm tracking-widest uppercase py-4 text-center transition-colors font-medium"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {dict.products.cta}
            </a>
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
          <div className="w-12 h-px bg-[#C9A84C] mb-6" />
          <div className="border border-gray-100 rounded-sm overflow-hidden">
            {Object.entries(accessory.specs).map(([key, value], i) => (
              <div
                key={key}
                className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div
                  className="px-5 py-3 text-sm text-gray-500 border-r border-gray-100"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {key}
                </div>
                <div
                  className="px-5 py-3 text-sm text-[#111111]"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Features row */}
      <section className="bg-[#f9f9f9] py-16 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white p-8 rounded-sm border border-gray-100">
              <p className="text-[#C9A84C] text-xl mb-4">✦</p>
              <h3
                className="text-lg font-semibold text-[#111111] mb-2"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm text-gray-500 leading-relaxed"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
