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
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 py-5 bg-black/90 backdrop-blur-md">
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center">
        <img src="/images/logo.png" alt="Elite Handpan" style={{ height: '40px', width: 'auto' }} />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-8">
        <Link href={`/${locale}/shop`} className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">
          {dict.nav.shop}
        </Link>
        <Link href={`/${locale}/about`} className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">
          About
        </Link>
        <Link href={`/${locale}/contact`} className="text-white/70 hover:text-white text-sm tracking-wider transition-colors">
          {dict.nav.contact}
        </Link>
        <LanguageSwitcher locale={locale} />
      </div>

      {/* Mobile hamburger */}
      <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open menu" className="md:hidden text-white p-2 -mr-2">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center gap-8">
          <button type="button" onClick={closeMenu} aria-label="Close menu" className="absolute top-5 right-4 text-white p-2">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
          <Link href={`/${locale}/shop`} onClick={closeMenu} className="text-white text-2xl tracking-wider font-light">Shop</Link>
          <Link href={`/${locale}/about`} onClick={closeMenu} className="text-white text-2xl tracking-wider font-light">About</Link>
          <Link href={`/${locale}/contact`} onClick={closeMenu} className="text-white text-2xl tracking-wider font-light">Contact</Link>
          <div className="mt-4"><LanguageSwitcher locale={locale} /></div>
        </div>
      )}
    </nav>
  )
}