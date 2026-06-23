import type { Dictionary } from '../i18n'

export default function ContactSection({
  dict,
  locale,
}: {
  dict: Dictionary
  locale: string
}) {
  return (
    <footer id="contact" className="bg-[#0a0a0a]">
      {/* Gold divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

      <div className="py-24 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left: brand */}
          <div>
            <p
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {locale === 'fa' ? 'الیت هندپن' : 'Elite Handpan'}
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-white leading-tight mb-6"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              {dict.contact.heading}
            </h2>
            <p
              className="text-[#888888] text-base max-w-xs leading-relaxed"
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              {dict.contact.tagline}
            </p>
          </div>

          {/* Right: contact info */}
          <div
            className="flex flex-col justify-center gap-6"
            style={{ fontFamily: 'var(--font-inter)' }}
          >
            <ContactRow
              label={locale === 'fa' ? 'ایمیل' : 'Email'}
              value="info@elitehandpan.com"
              href="mailto:info@elitehandpan.com"
            />
            <div className="h-px bg-white/5" />
            <ContactRow
              label="Instagram"
              value="@elitehandpan"
              href="https://instagram.com/elitehandpan"
            />
            <div className="h-px bg-white/5" />
            <ContactRow
              label="WhatsApp"
              value="+98 900 000 0000"
              href="https://wa.me/989000000000"
            />
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="border-t border-white/5 py-6 px-6 md:px-16">
        <p
          className="text-[#888888] text-xs text-center tracking-wider"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          © 2026 Elite Handpan. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function ContactRow({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-[#888888] text-xs tracking-wider uppercase w-24 shrink-0 pt-0.5">
        {label}
      </span>
      <a
        href={href}
        className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm"
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {value}
      </a>
    </div>
  )
}
