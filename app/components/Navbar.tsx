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

  const isActive = (segment: string) => pathname.includes(segment)

  const desktopLinkClass = (segment: string) =>
    `text-sm tracking-wider transition-colors ${
      isActive(segment) ? 'text-[#C9A84C]' : 'text-white/70 hover:text-white'
    }`

  const mobileLinkClass = (segment: string) =>
    `block w-full text-center text-lg py-4 hover:bg-white/5 transition-colors ${
      isActive(segment) ? 'text-[#C9A84C]' : 'text-white'
    }`

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <Link href={`/${locale}/shop`} className={desktopLinkClass('/shop')}>
            {dict.nav.shop}
          </Link>
          <Link href={`/${locale}/about`} className={desktopLinkClass('/about')}>
            About
          </Link>
          <Link href={`/${locale}/contact`} className={desktopLinkClass('/contact')}>
            {dict.nav.contact}
          </Link>
          <LanguageSwitcher locale={locale} />
        </div>

        {/* Mobile: language switcher + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="text-white p-2 -mr-2"
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
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black shadow-lg z-50">
          <Link href={`/${locale}/shop`} onClick={closeMenu} className={`${mobileLinkClass('/shop')} border-b border-gray-800`}>
            Shop
          </Link>
          <Link href={`/${locale}/about`} onClick={closeMenu} className={`${mobileLinkClass('/about')} border-b border-gray-800`}>
            About
          </Link>
          <Link href={`/${locale}/contact`} onClick={closeMenu} className={mobileLinkClass('/contact')}>
            Contact
          </Link>
        </div>
      )}
    </nav>
  )
}
