'use client'

import { useEffect, useRef, useState } from 'react'
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
  const navRef = useRef<HTMLElement>(null)

  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  const navBg = isHomepage
    ? scrolled || menuOpen
      ? 'bg-black/90 backdrop-blur-md'
      : 'bg-transparent'
    : 'bg-black/90 backdrop-blur-md'

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-5">
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

        {/* Mobile: language switcher always visible */}
        <div className="md:hidden">
          <LanguageSwitcher locale={locale} />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          className="md:hidden text-white p-2 -mr-2"
        >
          {menuOpen ? (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M3 3l16 16M19 3L3 19" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M2 6h18M2 11h18M2 16h18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black shadow-lg z-50">
          <Link
            href={`/${locale}/shop`}
            onClick={closeMenu}
            className="block text-white text-lg py-4 px-6 border-b border-gray-800 hover:bg-white/5 transition-colors"
          >
            Shop
          </Link>
          <Link
            href={`/${locale}/about`}
            onClick={closeMenu}
            className="block text-white text-lg py-4 px-6 border-b border-gray-800 hover:bg-white/5 transition-colors"
          >
            About
          </Link>
          <Link
            href={`/${locale}/contact`}
            onClick={closeMenu}
            className="block text-white text-lg py-4 px-6 hover:bg-white/5 transition-colors"
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}
