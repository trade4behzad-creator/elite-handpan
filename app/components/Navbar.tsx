'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { Dictionary } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5 transition-all duration-500 ${
        scrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center">
        <span
          className="text-[#C9A84C] tracking-[0.35em] text-sm font-semibold uppercase"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          ELITE
        </span>
      </Link>

      {/* Nav links + switcher */}
      <div className="flex items-center gap-8">
        <a
          href="#products"
          className="text-white/70 hover:text-white text-sm tracking-wider transition-colors"
        >
          {dict.nav.products}
        </a>
        <a
          href="#contact"
          className="text-white/70 hover:text-white text-sm tracking-wider transition-colors"
        >
          {dict.nav.contact}
        </a>
        <LanguageSwitcher locale={locale} />
      </div>
    </nav>
  )
}
