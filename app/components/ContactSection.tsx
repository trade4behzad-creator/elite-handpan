import Link from 'next/link'
import type { Dictionary } from '../i18n'

export default function ContactSection({
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  return (
    <footer id="contact" className="bg-[#0a0a0a]">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="py-16 px-4 md:px-8 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">

          {/* Col 1: Logo + tagline + copyright */}
          <div>
            <img
              src="/images/logo.png"
              alt="Elite Handpan"
              style={{ height: '36px', width: 'auto' }}
              className="mb-5"
            />
            <p
              className="text-[#888888] text-sm mb-8"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Forged from light
            </p>
            <p
              className="text-[#555555] text-xs"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              © 2026 Elite Handpan. All rights reserved.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div>
            <p
              className="text-[#C9A84C] text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Quick Links
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="#products"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Products
                </a>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  About
                </Link>
              </li>
              <li>
                <a
                  href="#contact"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact info */}
          <div>
            <p
              className="text-[#C9A84C] text-xs tracking-widest uppercase mb-6"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Contact
            </p>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:info@elitehandpan.com"
                  className="text-white/60 hover:text-[#C9A84C] text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  info@elitehandpan.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/elitehandpan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#C9A84C] text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  @elitehandpan
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/989000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-[#C9A84C] text-sm transition-colors"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  +98 900 000 0000
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Instagram placeholder grid */}
        <div className="max-w-6xl mx-auto mt-16">
          <p
            className="text-[#888888] text-sm text-center mb-6 tracking-wider"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            Follow us @elitehandpan
          </p>
          <div className="grid grid-cols-3 gap-2 max-w-sm mx-auto md:max-w-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-[#1a1a1a] rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
