'use client'

import { useState } from 'react'

const faqs = [
  {
    q: 'What materials are Elite handpans made from?',
    a: 'Our handpans are crafted from high-grade stainless steel, carefully selected for its acoustic properties and durability. Each instrument undergoes a precise shaping and tuning process.',
  },
  {
    q: 'How long does production take?',
    a: 'Most models are ready to ship within 1–2 weeks. Custom orders may take 4–8 weeks depending on specifications.',
  },
  {
    q: 'Do you ship internationally?',
    a: 'Yes, we ship worldwide. All instruments are packed in professional hard cases with full tracking and insurance.',
  },
  {
    q: 'What is included with my handpan?',
    a: 'Every Elite handpan comes with a hard protective case, premium maintenance oil, and a handwoven carrying strap.',
  },
  {
    q: 'Do you offer a warranty?',
    a: 'All Elite instruments come with a 2-year warranty covering retuning, minor repairs, and quality assessment.',
  },
  {
    q: 'How do I care for my handpan?',
    a: 'Apply the included maintenance oil regularly, keep the instrument away from humidity and extreme temperatures, and store it in its case when not in use.',
  },
  {
    q: 'Can I try before I buy?',
    a: 'We offer video demonstrations for each instrument. Contact us via WhatsApp or email to arrange a live video call session.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept bank transfers and online payments. Contact us for details on your preferred payment method.',
  },
  {
    q: 'Can I return or exchange my handpan?',
    a: 'Due to the handcrafted nature of our instruments, we do not accept returns. However, we offer exchanges within 14 days if there is a manufacturing defect.',
  },
  {
    q: 'How do I place an order?',
    a: 'Simply click "Inquire" on any product page or contact us directly via WhatsApp or email. We\'ll guide you through the ordering process.',
  },
]

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

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
              className="text-lg font-medium text-[#111111] pr-8"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {item.q}
            </span>
            <span
              className="text-xl shrink-0 transition-transform duration-200"
              style={{ color: '#C9A84C' }}
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
