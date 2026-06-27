'use client'

import Image from 'next/image'
import Link from 'next/link'

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function GoldDivider() {
  return <div className="w-10 h-[2px] bg-[#C9A84C] mt-1 mb-4" />
}

export default function Footer() {
  const instagramPlaceholders = Array.from({ length: 6 })

  return (
    <footer className="relative bg-[#0d0d0d] text-white overflow-hidden">
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/about.jpg"
          alt=""
          fill
          className="object-cover opacity-10"
          aria-hidden="true"
        />
      </div>

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Col 1 — Brand */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/logo.png"
              alt="Elite Handpan Logo"
              width={120}
              height={60}
              className="object-contain"
              style={{ height: '60px', width: 'auto' }}
            />
            <p className="mt-3 text-lg font-semibold tracking-[0.25em] uppercase">ELITE</p>
            <div className="flex gap-3 mt-5">
              {[
                { icon: <TwitterIcon />, label: 'Twitter', href: '#' },
                { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
                { icon: <YouTubeIcon />, label: 'YouTube', href: '#' },
              ].map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/40 text-white hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Contact us */}
          <div>
            <h3 className="text-base font-semibold">Contact us</h3>
            <GoldDivider />
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="mailto:info@elitehandpan.com" className="hover:text-[#C9A84C] transition-colors">
                  info@elitehandpan.com
                </a>
              </li>
              <li>
                <a href="tel:+989000000000" className="hover:text-[#C9A84C] transition-colors">
                  +98 900 000 0000
                </a>
              </li>
              <li className="text-gray-400">Tehran, Iran</li>
            </ul>
          </div>

          {/* Col 3 — Other Links */}
          <div>
            <h3 className="text-base font-semibold">Other Links</h3>
            <GoldDivider />
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/en/about" className="hover:text-[#C9A84C] transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="#instruments" className="hover:text-[#C9A84C] transition-colors">Instruments</Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-[#C9A84C] transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/en/faq" className="hover:text-[#C9A84C] transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Col 4 — Instagram */}
          <div>
            <h3 className="text-base font-semibold">Instagram</h3>
            <GoldDivider />
            <div className="grid grid-cols-3 gap-1.5">
              {instagramPlaceholders.map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-[#2a2a2a] hover:opacity-80 transition-opacity cursor-pointer rounded-sm"
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10">
        <div className="w-full h-px bg-[#C9A84C]" />
        <p className="text-center text-sm text-gray-500 py-5">
          Copyrights 2026 © Elite Handpan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
