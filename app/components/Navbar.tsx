'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Dictionary } from '../i18n'
import LanguageSwitcher from './LanguageSwitcher'
import { useCart } from '../context/CartContext'

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
  const { totalItems } = useCart()

  const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`

  const isActive = (segment: string) => pathname.includes(segment)

  const desktopLinkClass = (segment: string) =>
    `text-sm tracking-wider transition-colors ${
      isActive(segment) ? 'text-[#3F3E7A]' : 'text-white/70 hover:text-white'
    }`

  const mobileLinkClass = (segment: string) =>
    `block w-full text-center text-lg py-4 hover:bg-white/5 transition-colors ${
      isActive(segment) ? 'text-[#3F3E7A]' : 'text-white'
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
    ? 'bg-black'
    : 'bg-transparent'
  : 'bg-black/90 backdrop-blur-md'

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navBg}`}
    >
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-16 py-2">
        {/* Logo + desktop nav links, grouped together on the start side */}
        <div className="flex items-center gap-10">
          <Link href={`/${locale}`} className="flex items-center">
            <img src="/images/logo.png" alt="Elite Handpan" style={{ height: '44px', width: 'auto' }} />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href={`/${locale}/shop`} className={desktopLinkClass('/shop')}>
              {dict.nav.shop}
            </Link>
            <Link href={`/${locale}/about`} className={desktopLinkClass('/about')}>
              {dict.nav.about}
            </Link>
            <Link href={`/${locale}/contact`} className={desktopLinkClass('/contact')}>
              {dict.nav.contact}
            </Link>
            <Link href={`/${locale}/faq`} className={desktopLinkClass('/faq')}>
              {dict.nav.faq}
            </Link>
          </div>
        </div>

        {/* Cart + language switcher, on the end side */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href={`/${locale}/cart`}
            title={locale === 'fa' ? 'سبد خرید' : 'Cart'}
            className="relative text-white/70 hover:text-white transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute -top-2 -right-2 flex items-center justify-center text-[10px] text-white rounded-full"
                style={{ background: '#3F3E7A', width: '16px', height: '16px' }}
              >
                {totalItems}
              </span>
            )}
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
            {dict.nav.shop}
          </Link>
          <Link href={`/${locale}/about`} onClick={closeMenu} className={`${mobileLinkClass('/about')} border-b border-gray-800`}>
            {dict.nav.about}
          </Link>
          <Link href={`/${locale}/contact`} onClick={closeMenu} className={`${mobileLinkClass('/contact')} border-b border-gray-800`}>
            {dict.nav.contact}
          </Link>
          <Link href={`/${locale}/faq`} onClick={closeMenu} className={`${mobileLinkClass('/faq')} border-b border-gray-800`}>
            {dict.nav.faq}
          </Link>
          <Link
            href={`/${locale}/cart`}
            onClick={closeMenu}
            className="flex items-center justify-center gap-2 py-4 text-white hover:bg-white/5 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {locale === 'fa' ? 'سبد خرید' : 'Cart'}
            {totalItems > 0 && <span style={{ color: '#3F3E7A' }}>({totalItems})</span>}
          </Link>
        </div>
      )}
    </nav>
  )
}
