'use client'

import { useState } from 'react'

export type FaqItem = { q: string; a: string }

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (faqs.length === 0) return null

  return (
    <div className="max-w-3xl mx-auto px-8 pb-24">
      {faqs.map((item, i) => (
        <div key={i} className="border-b border-gray-100">
          <button
            type="button"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between py-6 text-left cursor-pointer"
          >
            <span
              className="text-xl font-semibold pr-8"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#1a1a2e' }}
            >
              {item.q}
            </span>
            <span
              className="text-xl shrink-0 transition-transform duration-200"
              style={{ color: '#3F3E7A' }}
            >
              {openIndex === i ? '−' : '+'}
            </span>
          </button>
          {openIndex === i && (
            <p
              className="text-gray-600 text-sm leading-relaxed pb-6"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {item.a}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
