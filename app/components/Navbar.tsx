'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const navBg = isHomepage
    ? scrolled || menuOpen
      ? 'bg-black/80 backdrop-blur-md'
      : 'bg-transparent'
    : 'bg-black/90 backdrop-blur-md'

  // Products link: anchor on homepage, full URL on interior pages
  const productsHref = isHomepage ? '#products' : `/${locale}/#products`

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 md:px-8 lg:px-16 py-5 transition-all duration-500 ${navBg}`}
    >
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center">
        <img src="/images/logo.png" alt="Elite Handpan" style={{ height: '40px', width: 'auto' }} />
      </Link>

      {/* Desktop nav links + switcher */}
      <div className="hidden md:flex items-center gap-8">
        <Link
          href={`/${locale}/shop`}
          className="text-white/70 hover:text-white text-sm tracking-wider transition-colors"
        >
          {dict.nav.shop}
        </Link>
        <a
          href={productsHref}
          className="text-white/70 hover:text-white text-sm tracking-wider transition-colors"
        >
          {dict.nav.products}
        </a>
        <Link
          href={`/${locale}/contact`}
          className="text-white/70 hover:text-white text-sm tracking-wider transition-colors"
        >
          {dict.nav.contact}
        </Link>
        <LanguageSwitcher locale={locale} />
      </div>

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMenuOpen(true)}
        aria-label="Open menu"
        className="md:hidden text-white p-2 -mr-2"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path
            d="M2 6h18M2 11h18M2 16h18"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Mobile full-screen overlay menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center gap-10">
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="absolute top-5 right-4 text-white p-2"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path
                d="M3 3l16 16M19 3L3 19"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <Link
            href={`/${locale}/shop`}
            onClick={closeMenu}
            className="text-white/90 hover:text-white text-2xl tracking-wider"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.nav.shop}
          </Link>
          <a
            href={productsHref}
            onClick={closeMenu}
            className="text-white/90 hover:text-white text-2xl tracking-wider"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.nav.products}
          </a>
          <Link
            href={`/${locale}/contact`}
            onClick={closeMenu}
            className="text-white/90 hover:text-white text-2xl tracking-wider"
            style={{ fontFamily: 'var(--font-cormorant)' }}
          >
            {dict.nav.contact}
          </Link>

          <div className="mt-4">
            <LanguageSwitcher locale={locale} />
          </div>
        </div>
      )}
    </nav>
  )
}
